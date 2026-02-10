# 🏗️ Webodise Vercel Deployment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Repository                          │
│  (webodise with client/ and server/ folders)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ git push
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Webhook                            │
│  (Automatically triggered on code push)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              Vercel Build Process                              │
│  1. Install dependencies (root + client + server)             │
│  2. Build React app:  npm run build                           │
│  3. Optimize output                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
    ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Frontend   │  │   Backend    │  │    Static    │
    │   (React)   │  │   (Express)  │  │   Assets    │
    │  dist/     │  │   routes/    │  │  public/    │
    └────┬────────┘  └──────┬───────┘  └──────┬───────┘
         │                   │                │
         └───────────────────┼────────────────┘
                              │
                              ↓
              ┌────────────────────────────────┐
              │   https://your-domain.         │
              │   vercel.app                   │
              └────────────────────────────────┘
```

## Request Flow

### 1. Frontend Request
```
Browser           Vercel Edge        Client App
  │                   │                  │
  ├─ GET / ────────→  │                  │
  │                   ├─ Routes to ────→ │
  │                   │   client/dist/  │
  │                   │                  │
  │                   │ ← HTML, JS, CSS ─┤
  │ ← Serve Page ─────┤
  │
```

### 2. API Request
```
Frontend          Vercel Edge       Express Server      MongoDB
  │                   │                  │                 │
  ├─ POST /api/  ────→│                  │                 │
  │   contacts        │                  │                 │
  │                   ├─ Route to ────→  │                 │
  │                   │ /server/routes/  │                 │
  │                   │ contacts.js      ├─ Query ────────→│
  │                   │                  │                 │
  │                   │                  │ ← Document ─────┤
  │                   │                  │                 │
  │                   │ ← JSON Response ─┤                 │
  │ ← API Response ────┤
  │
```

## File Organization

```
webodise/ (Root)
│
├── 📄 vercel.json           ← Vercel deployment config
├── 📄 .vercelignore         ← Files to exclude from Vercel
├── 📄 .gitignore            ← Files to exclude from Git
├── 📄 .env.example          ← Backend environment template
│
├── 📖 SETUP_SUMMARY.md      ← This setup summary
├── 📖 VERCEL_SETUP.md       ← Full deployment guide
├── 📖 DEPLOYMENT_CHECKLIST  ← Step-by-step checklist
│
├── 📁 client/ (React App - Built to dist/)
│   ├── 📄 package.json      ← Frontend dependencies
│   ├── 📄 vite.config.ts    ← Vite configuration
│   ├── 📄 .env.example      ← Frontend env template
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx      ← Entry point
│       ├── 📁 pages/        ← Page components
│       ├── 📁 components/   ← React components
│       ├── 📁 hooks/        ← Custom hooks
│       └── 📁 lib/          ← Utilities
│
└── 📁 server/ (Express API)
    ├── 📄 package.json      ← Backend dependencies
    ├── 📄 app.js            ← Express configuration
    │
    ├── 📁 bin/
    │   └── 📄 www           ← Server entry point
    │
    ├── 📁 routes/           ← API endpoints
    │   ├── 📄 contacts.js   ← Contacts API
    │   ├── 📄 users.js      ← Users API
    │   └── 📄 index.js      ← Home endpoint
    │
    ├── 📁 models/           ← Database models
    │   └── 📄 Contact.js    ← Contact model
    │
    └── 📁 public/           ← Static files
```

## Environment Variables Flow

```
┌──────────────────────────────────────────┐
│   Vercel Dashboard                       │
│   Environment Variables Configuration   │
└────────────┬─────────────────────────────┘
             │
             ├─ MONGODB_URI ────────────→ Backend (.env)
             │                           Express app.js
             │
             └─ VITE_API_URL ────────────→ Frontend
                                         React components
```

## Build Process Timeline

```
Timeline of Vercel Deployment
═════════════════════════════════════════════════

Start Build
    ↓
Install Dependencies (Root + Client + Server)
    ↓
Run Build Command: cd client && npm run build
    ↓
Generate client/dist/ folder
    ↓
Configure Express routing (/api → /server/routes)
    ↓
Set Headers (CORS, Cache, etc.)
    ↓
Optimize for Production
    ↓
✅ Deployment Complete
    ↓
Live at https://your-domain.vercel.app
```

## API Endpoint Mapping

```
Frontend                Vercel Route          Backend Handler
────────────────────────────────────────────────────────────

GET /                ──→ /              ──→ index.jade
GET /users           ──→ /users         ──→ routes/users.js
POST /api/contacts   ──→ /api/contacts  ──→ routes/contacts.js
GET /api/contacts    ──→ /api/contacts  ──→ routes/contacts.js
```

## CORS Headers Configuration

Vercel automatically adds these headers to all `/api/*` requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Cache-Control: public, max-age=0, must-revalidate
```

## Performance Optimization

```
Frontend Optimization:
├─ Minified JavaScript (Vite build)
├─ CSS optimization
├─ Tree-shaking unused code
└─ Fast content delivery via Vercel Edge Network

Backend Optimization:
├─ Express running in Node.js 20.x
├─ MongoDB connection pooling
├─ Gzip compression
└─ Request logging via Morgan middleware
```

## Security Configuration

```
Production Security
═════════════════════

1. Environment Variables
   ├─ MONGODB_URI → Vercel Secure Storage
   └─ VITE_API_URL → Frontend Configuration

2. CORS Protection
   ├─ Whitelist allowed origins
   └─ Restrict HTTP methods

3. Database Security
   ├─ Mongoose models validation
   ├─ Input sanitization
   └─ Error message hiding in production

4. HTTPS/TLS
   └─ Vercel provides free SSL certificates
```

## Deployment Status Check

```
Monitor your deployment:

Vercel Dashboard
    ↓
Deployments Tab
    ↓
Click Latest Deployment
    ↓
View Logs (Build + Runtime)
    ↓
Check Metrics (Requests, Errors)
    ↓
Review Analytics (Traffic, Response Time)
```

---

## Next Steps

1. **Push to GitHub**: `git push origin main`
2. **Create Vercel Project**: vercel.com/new
3. **Add Env Variables**: MONGODB_URI, VITE_API_URL
4. **Deploy**: Click Deploy button
5. **Monitor**: Watch logs and analytics

🎉 Your deployment infrastructure is ready!
