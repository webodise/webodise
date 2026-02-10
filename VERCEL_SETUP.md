# Vercel Deployment Guide

This project is a monorepo with a React/Vite frontend (`client/`) and an Express backend (`server/`).

## Pre-deployment Checklist

### 1. Environment Variables
Set up these environment variables in your Vercel project dashboard:

**Project Settings > Environment Variables**

```
MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/webodise?retryWrites=true&w=majority
VITE_API_URL: https://your-domain.vercel.app/api
```

### 2. Build Configuration
Vercel will automatically use:
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: Installs dependencies for both client and server

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup for Vercel deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Vercel will auto-detect the configuration

6. Add environment variables:
   - `MONGODB_URI`
   - `VITE_API_URL`

7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and add environment variables when asked

## API Endpoints

After deployment, your API endpoints will be:

- **Get all contacts**: `GET https://your-domain.vercel.app/api/contacts`
- **Create contact**: `POST https://your-domain.vercel.app/api/contacts`
- **Get users**: `GET https://your-domain.vercel.app/users`

## Frontend Configuration

The frontend (`client/.env`) should be configured with:

```
VITE_API_URL=https://your-domain.vercel.app/api
```

This is automatically set via environment variables in Vercel.

## Troubleshooting

### Build Fails
- Check that `client/package.json` has the build script
- Verify all dependencies are properly installed
- Check for TypeScript errors: `cd client && npm run build`

### API Calls Return 404
- Ensure `MONGODB_URI` is set correctly
- Check the Vercel function logs
- Verify CORS headers are being sent

### MongoDB Connection Error
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

## Local Development

### Start the project locally:

```bash
# Terminal 1 - Frontend
cd client
npm install
npm run dev

# Terminal 2 - Backend
cd server
npm install
npm start
```

Frontend will run on `http://localhost:8080`
Backend will run on `http://localhost:3000`

## Important Notes

- The `vercel.json` configures the entire deployment
- CORS is handled in `server/app.js`
- Make sure `.env` files are never committed to Git
- Use `.env.example` files as templates for environment variables

## Monitoring

After deployment, monitor your project:
1. Go to your Vercel Dashboard
2. Click on your project
3. Navigate to "Analytics" to view traffic
4. Check "Deployments" to see deployment history
5. View "Logs" for debugging

---

For more help, visit: https://vercel.com/docs
