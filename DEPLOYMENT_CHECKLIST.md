# Vercel Deployment Checklist ✅

Complete this checklist before deploying to Vercel.

## 📋 Pre-Deployment Steps

### 1. Code Setup
- [ ] All changes committed to Git
  ```bash
  git status
  git add .
  git commit -m "Setup Vercel deployment"
  git push origin main
  ```

### 2. Environment Variables Created
- [ ] `.env.example` file created in root
- [ ] `client/.env.example` file created
- [ ] No `.env` or `.env.local` files committed to Git

### 3. Dependencies Verified
- [ ] `client/package.json` has build script
  ```json
  "build": "vite build"
  ```
- [ ] `server/package.json` has dependencies:
  ```json
  "dotenv": "^16.6.1",
  "express": "~4.16.1",
  "mongoose": "^7.5.0"
  ```

### 4. Configuration Files Ready
- [ ] `vercel.json` is in the root directory
- [ ] `.vercelignore` is in the root directory
- [ ] `.gitignore` is in the root directory
- [ ] All database models set up (Contact.js, etc.)

## 🚀 Vercel Deployment

### Step 1: Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (recommended)

### Step 2: Create New Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Search for your repository (webodise)
4. Click Import

### Step 3: Configure Project Settings
When prompted by Vercel:
- **Framework**: Detected as Vite (auto-detected)
- **Build Command**: Should auto-detect as `cd client && npm install && npm run build`
- **Output Directory**: Should be `client/dist`
- **Install Command**: Leave as default (Vercel will handle monorepo)

### Step 4: Set Environment Variables
Click "Environment Variables" and add:

```
MONGODB_URI = your-mongodb-connection-string
VITE_API_URL = https://your-project-name.vercel.app/api
```

Where `your-project-name` is your Vercel project name.

**To get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database cluster
3. Create a user with password
4. Get the connection string
5. Replace `<password>` with your database password
6. Change database name to `webodise`

Example:
```
mongodb+srv://username:password@cluster0.xyz.mongodb.net/webodise?retryWrites=true&w=majority
```

### Step 5: Deploy
Click "Deploy" and wait for the build to complete.

## ✅ Post-Deployment Verification

### 1. Check Deployment Status
- [ ] Visit your Vercel project dashboard
- [ ] Confirm deployment completed successfully
- [ ] No build errors in deployment logs

### 2. Test Frontend
- [ ] Visit `https://your-project-name.vercel.app`
- [ ] Page loads correctly
- [ ] No console errors
- [ ] Navigation works

### 3. Test API (if you have API calls)
- Open browser DevTools (F12)
- Check Network tab when making API calls
- Verify requests go to `/api/...` endpoints
- Check for CORS errors in console

### 4. Monitor Logs
- Go to Vercel Dashboard → Your Project
- Click "Deployments" tab
- View logs by clicking the latest deployment
- Check for any errors

## 🔧 Troubleshooting

### Build Fails
**Error**: `Cannot find module 'module-name'`
- [ ] Check `client/package.json` has all dependencies
- [ ] Run `npm install --legacy-peer-deps` locally first
- [ ] Push changes and redeploy

**Error**: `MONGODB_URI is undefined`
- [ ] Verify environment variable is set in Vercel dashboard
- [ ] Environment variable name must be exact: `MONGODB_URI`
- [ ] Redeploy after adding environment variables

### API Doesn't Work
- [ ] Check network requests in browser DevTools
- [ ] Verify `MONGODB_URI` is correct
- [ ] Check MongoDB Atlas IP whitelist allows Vercel IPs
- [ ] View server logs in Vercel dashboard

### CORS Issues
- [ ] Check `server/app.js` has CORS middleware
- [ ] Verify `Access-Control-Allow-Origin` header is being set
- [ ] Clear browser cache and try again

## 📊 Monitoring After Deployment

### View Logs
1. Go to your project in Vercel
2. Click "Deployments"
3. Click latest deployment
4. See build logs and runtime logs

### Analytics
1. Click "Analytics" tab
2. View traffic, response times, and errors

### Redeploy
- Push new code to GitHub
- Vercel auto-deploys the latest commit
- Or manually click "Redeploy" in Vercel dashboard

## 🔐 Security Checklist

- [ ] Never commit `.env` or `.env.local` to Git
- [ ] Use strong MongoDB password
- [ ] Enable 2FA on Vercel account
- [ ] Use different secrets for production and staging
- [ ] Review Vercel logs regularly for errors
- [ ] Keep dependencies updated

## 📚 Useful Commands

### Local Testing
```bash
# Terminal 1 - Frontend
cd client
npm install
npm run dev

# Terminal 2 - Backend
cd ../server
npm install
npm start
```

### Build Production
```bash
# Build frontend
cd client
npm run build
npm run preview

# Test backend
cd ../server
npm start
```

### Check for Issues
```bash
# Lint frontend
cd client
npm run lint

# Run tests
npm run test
```

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com

---

**Last Updated**: February 2026
**Project**: Webodise
**Status**: Ready for Deployment ✅
