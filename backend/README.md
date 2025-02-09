# Monkeypox API (Backend)
This backend fetches and processes Monkeypox case data from a public CSV and serves it as JSON.

## Deploy on Render
1. Push the `backend` folder to GitHub.
2. Go to Render, create a new Web Service, and connect it to the repository.
3. Set the **start command** to `npm start`.
4. Deploy and note the backend URL (e.g., `https://monkeypox-api.onrender.com`).

## API Endpoint
- `GET /monkeypox-data` – Returns processed Monkeypox case data.
