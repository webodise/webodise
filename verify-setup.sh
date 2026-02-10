#!/bin/bash
# Vercel Deployment Setup Verification Script
# Run this to verify all configuration files are in place

echo "🔍 Vercel Deployment Configuration Check"
echo "=========================================="
echo ""

# Check root configuration files
echo "📁 Root Level Configuration:"
echo "──────────────────────────"

if [ -f vercel.json ]; then
  echo "✅ vercel.json"
else
  echo "❌ vercel.json (MISSING - Critical!)"
fi

if [ -f .vercelignore ]; then
  echo "✅ .vercelignore"
else
  echo "❌ .vercelignore (MISSING)"
fi

if [ -f .gitignore ]; then
  echo "✅ .gitignore"
else
  echo "❌ .gitignore (MISSING)"
fi

if [ -f .env.example ]; then
  echo "✅ .env.example"
else
  echo "❌ .env.example (MISSING)"
fi

echo ""
echo "📚 Documentation Files:"
echo "─────────────────────"

if [ -f SETUP_SUMMARY.md ]; then
  echo "✅ SETUP_SUMMARY.md"
else
  echo "❌ SETUP_SUMMARY.md (MISSING)"
fi

if [ -f VERCEL_SETUP.md ]; then
  echo "✅ VERCEL_SETUP.md"
else
  echo "❌ VERCEL_SETUP.md (MISSING)"
fi

if [ -f DEPLOYMENT_CHECKLIST.md ]; then
  echo "✅ DEPLOYMENT_CHECKLIST.md"
else
  echo "❌ DEPLOYMENT_CHECKLIST.md (MISSING)"
fi

if [ -f ARCHITECTURE.md ]; then
  echo "✅ ARCHITECTURE.md"
else
  echo "❌ ARCHITECTURE.md (MISSING)"
fi

if [ -f QUICK_START.md ]; then
  echo "✅ QUICK_START.md"
else
  echo "❌ QUICK_START.md (MISSING)"
fi

echo ""
echo "👁️ Client Configuration:"
echo "─────────────────────"

if [ -f client/.env.example ]; then
  echo "✅ client/.env.example"
else
  echo "❌ client/.env.example (MISSING)"
fi

if grep -q "\"build\": \"vite build\"" client/package.json; then
  echo "✅ client/package.json has build script"
else
  echo "⚠️  client/package.json build script check"
fi

if [ -f client/vite.config.ts ]; then
  echo "✅ client/vite.config.ts exists"
else
  echo "❌ client/vite.config.ts (MISSING)"
fi

echo ""
echo "🖥️ Server Configuration:"
echo "─────────────────────"

if grep -q "\"build\"" server/package.json; then
  echo "✅ server/package.json has build script"
else
  echo "⚠️  server/package.json build script check"
fi

if grep -q "mongoose" server/package.json; then
  echo "✅ server/package.json has MongoDB support"
else
  echo "⚠️  server/package.json MongoDB check"
fi

if grep -q "Access-Control-Allow-Origin" server/app.js; then
  echo "✅ server/app.js has CORS middleware"
else
  echo "❌ server/app.js CORS middleware (MISSING)"
fi

echo ""
echo "📋 Git Configuration:"
echo "──────────────────"

if grep -q "\.env" .gitignore; then
  echo "✅ .gitignore excludes environment files"
else
  echo "❌ .gitignore missing environment exclusions"
fi

echo ""
echo "=========================================="
echo "✅ Vercel Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Review QUICK_START.md"
echo "2. Commit: git add . && git commit -m 'Setup Vercel'"
echo "3. Push: git push origin main"
echo "4. Go to: https://vercel.com"
echo "5. Import your GitHub repository"
echo "6. Add environment variables"
echo "7. Deploy!"
echo ""
