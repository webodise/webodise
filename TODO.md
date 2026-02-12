# Fix Server Deployment Error

## Tasks
- [x] Update server/package.json: Replace "jade" with "pug" and upgrade "multer" to version 2.x
- [x] Update server/app.js: Change view engine from 'jade' to 'pug'
- [x] Rename server/views/error.jade to error.pug
- [x] Rename server/views/index.jade to index.pug
- [x] Rename server/views/layout.jade to layout.pug
- [x] Run npm install in server directory to update dependencies
- [x] Set frontend and backend URLs in client/.env
- [x] Update client/vercel.json for SPA routing and asset serving
- [ ] Test the changes by running the server locally or triggering a build
