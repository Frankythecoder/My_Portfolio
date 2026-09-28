from rate_limit import DAY, MINUTE, RateLimiter


class FakeClock:
  def __init__(self):
    self.now = 1000.0

  def __call__(self):
    return self.now


def test_per_minute_limit_resets_after_a_minute():
  clock = FakeClock()
  limiter = RateLimiter(per_minute=2, per_day=100, global_per_day=100, clock=clock)

  assert limiter.check("a") is None
  assert limiter.check("a") is None
  assert "too quickly" in limiter.check("a")
  assert limiter.check("b") is None  # other visitors are unaffected

  clock.now += MINUTE + 1
  assert limiter.check("a") is None


def test_per_day_limit_resets_after_a_day():
  clock = FakeClock()
  limiter = RateLimiter(per_minute=100, per_day=3, global_per_day=100, clock=clock)

  for _ in range(3):
    assert limiter.check("a") is None
  assert "today's message limit" in limiter.check("a")

  clock.now += DAY + 1
  assert limiter.check("a") is None


def test_global_limit_applies_across_visitors():
  limiter = RateLimiter(per_minute=100, per_day=100, global_per_day=2, clock=FakeClock())

  assert limiter.check("a") is None
  assert limiter.check("b") is None
  assert "daily limit" in limiter.check("c")


def test_rejected_requests_do_not_count():
  clock = FakeClock()
  limiter = RateLimiter(per_minute=1, per_day=2, global_per_day=100, clock=clock)

  assert limiter.check("a") is None
  for _ in range(5):
    assert limiter.check("a") is not None

  clock.now += MINUTE + 1
  assert limiter.check("a") is None  # the rejected attempts didn't use up the daily quota
