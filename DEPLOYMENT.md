# Deployment

## GitHub

Create a GitHub repository named `gbpiet`, then add it as `origin` and push the `main` branch.

## Vercel (frontend)

Import the GitHub repository in Vercel and set **Root Directory** to `frontend`.
Add the variables from `frontend/.env.example`, using the public Render URL for `VITE_API_URL`.

## Render (backend)

Create a Blueprint from the GitHub repository; Render will read `render.yaml`.
Set all values marked `sync: false` using `backend/.env.example` as a guide.
After Vercel is deployed, set `CLIENT_URL` to its exact HTTPS URL to allow Socket.IO and API requests.
