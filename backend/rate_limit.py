"""
In-memory rate limiting for the chat endpoint.

Counts live in RAM, so they reset when the server restarts. That is fine for a
single-instance deployment: the goal is to stop one visitor or script from
running up the OpenAI bill, not to meter usage exactly. The global daily cap
is the backstop for anyone who dodges the per-client limits (e.g. by spoofing
X-Forwarded-For or rotating IPs).
"""
import threading
import time
from collections import OrderedDict, deque
from typing import Callable, Deque, Optional

MINUTE = 60
DAY = 24 * 60 * 60
MAX_TRACKED_CLIENTS = 10_000


def _drop_older_than(hits: Deque[float], cutoff: float) -> None:
    while hits and hits[0] <= cutoff:
        hits.popleft()


class RateLimiter:
    def __init__(
        self,
        per_minute: int,
        per_day: int,
        global_per_day: int,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.per_minute = per_minute
        self.per_day = per_day
        self.global_per_day = global_per_day
        self._clock = clock
        self._clients: "OrderedDict[str, Deque[float]]" = OrderedDict()
        self._global: Deque[float] = deque()
        self._lock = threading.Lock()

    def check(self, client_id: str) -> Optional[str]:
        """Record a request and return None if allowed, or a message saying which limit was hit"""
        now = self._clock()
        with self._lock:
            _drop_older_than(self._global, now - DAY)
            hits = self._clients.setdefault(client_id, deque())
            self._clients.move_to_end(client_id)
            _drop_older_than(hits, now - DAY)

            if len(self._global) >= self.global_per_day:
                return "The assistant has reached its daily limit. Please try again tomorrow."
            if len(hits) >= self.per_day:
                return "You've reached today's message limit. Please try again tomorrow."
            if sum(1 for hit in hits if hit > now - MINUTE) >= self.per_minute:
                return "You're sending messages too quickly. Please wait a minute and try again."

            hits.append(now)
            self._global.append(now)
            while len(self._clients) > MAX_TRACKED_CLIENTS:
                self._clients.popitem(last=False)
        return None
