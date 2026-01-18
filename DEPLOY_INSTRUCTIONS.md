
# 🚀 Noor Official V3 - Deployment Guide

Follow these steps to host your earning platform live on **Render.com**.

## 1. Prepare Your Code
1. Ensure all changes are saved.
2. Initialize a Git repository in the project root:
   ```bash
   git init
   git add .
   git commit -m "chore: prepare for production deployment"
   ```
3. Create a new repository on **GitHub**.
4. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## 2. Setup on Render.com
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name:** `noor-official-v3`
   - **Environment:** `Node`
   - **Region:** Choose the one closest to Pakistan (e.g., Singapore).
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

## 3. Environment Variables
Click on the **Environment** tab in Render and add the following:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | Your MongoDB Atlas Connection String |
| `JWT_SECRET` | Create a long, strong random password |
| `API_KEY` | Your Google Gemini API Key |

## 4. Finalize
1. Click **Create Web Service**.
2. Render will start the build process. It will install dependencies, build the React frontend into `dist/`, and then start the Express server.
3. Once the logs say `🚀 NOOR CORE V3 live`, your site is ready!

---
**Note:** Since this app uses a mock/localStorage database in its current state, data will reset on server restarts unless you have connected a real MongoDB instance via `MONGO_URI`.
