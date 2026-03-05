# Full-Stack Deployment: Vercel (Frontend) + Render (Backend)

All code changes for deployment are in place. Follow these steps to go live.

## 1. Deploy Backend to Render

1. Push your code to GitHub (if not already).
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo.
4. Settings:
   - **Root Directory**: leave empty
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Environment Variables** (add each):
   - `MONGO` = your MongoDB connection string
   - `JWT_SECRET` = your JWT secret
   - `EMAIL_SERVICE` = gmail
   - `EMAIL_USER` = your email
   - `EMAIL_PASS` = your app password
   - `CLIENT_URL` = your Vercel frontend URL (e.g. `https://your-app.vercel.app`) — set after deploying frontend, then redeploy backend
6. Deploy. Copy your Render URL (e.g. `https://mern-estate-xxxx.onrender.com`).

## 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your GitHub repo.
3. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_FIREBASE_API_KEY` = your Firebase API key
   - `VITE_API_URL` = your Render backend URL (e.g. `https://mern-estate-xxxx.onrender.com`) — no trailing slash
5. Deploy. Copy your Vercel URL.

## 3. Cross-Reference URLs

- In **Render**: set `CLIENT_URL` to your Vercel URL. Redeploy if needed.
- In **Vercel**: set `VITE_API_URL` to your Render URL. Redeploy so the frontend build picks up the correct API URL.

## 4. Render Health Check (optional)

In Render dashboard → your service → **Settings** → **Health Check Path**, set to `/api/health` so Render can verify the server is running.

## Notes

- **Render free tier**: service sleeps after ~15 min inactivity; first request may take 30+ seconds to wake.
- **Local development**: Leave `VITE_API_URL` unset in `client/.env`; the Vite proxy will send `/api` requests to `localhost:3000`.
- **Production**: Ensure Render runs with `NODE_ENV=production` (Render sets this by default for production deploys).
