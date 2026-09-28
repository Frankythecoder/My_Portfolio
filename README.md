# My Portfolio Project

## Project info

This is a portfolio project built with modern web technologies.

**Setup**

Follow these steps:

```sh
# Step 1: Clone the repository using your project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install backend dependencies.
pip install -r requirements.txt

# Step 4: Install the necessary frontend dependencies.
npm install

# Step 5: Start the frontend development server with auto-reloading and an instant preview.
npm run dev

# Step 6: Start the backend AI chat.
uvicorn app:app --reload --port 8000

```

**Contact form**

The "Drop me a note" form posts directly to [Web3Forms](https://web3forms.com), so no email server is needed.
Get a free access key at web3forms.com (it is tied to the inbox that receives messages) and set it in `frontend/.env`
locally and in your host's environment variables when deploying:

```sh
VITE_WEB3FORMS_ACCESS_KEY=your-access-key
```

## What technologies are used for this project?

This project is built with:

Frontend:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Backend:
- Python
- OpenAI API
- uvicorn
- FastAPI