# Church Financial System - Deployment Guide

## Quick Deployment Options

### 1. **Railway** (Recommended - Easiest)
- **Cost:** Free tier available
- **Steps:**
  1. Go to [railway.app](https://railway.app)
  2. Sign up with GitHub
  3. Click "New Project" → "Deploy from GitHub repo"
  4. Select your repository
  5. Railway automatically detects it's a Node.js app
  6. Your app will be live with a URL like `https://your-app-name.railway.app`

### 2. **Render** (Good Alternative)
- **Cost:** Free tier available
- **Steps:**
  1. Go to [render.com](https://render.com)
  2. Sign up and connect GitHub
  3. Create "Web Service"
  4. Connect your repository
  5. Build command: `npm install`
  6. Start command: `npm start`
  7. Deploy automatically

### 3. **Glitch** (Simple)
- **Cost:** Free
- **Steps:**
  1. Go to [glitch.com](https://glitch.com)
  2. Click "New Project" → "Import from GitHub"
  3. Paste your repository URL
  4. Runs automatically

## Database Considerations

### SQLite (Current Setup)
- ✅ Good for small deployments
- ❌ Limited concurrent access
- ✅ No additional setup required

### PostgreSQL (Recommended for Production)
For better scalability, consider upgrading to PostgreSQL:

1. **Update package.json dependencies:**
```json
{
  "dependencies": {
    "pg": "^8.11.0",
    "express": "^4.18.2",
    // ... other dependencies
  }
}
```

2. **Update server.js database connection:**
```javascript
// Replace SQLite with PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});

// Update all database queries to use pool.query() instead of db.run()/db.get()/db.all()
```

## Environment Variables for Deployment

Create a `.env` file in your project root:
```
PORT=3001
NODE_ENV=production
# Add database URL if using PostgreSQL
# DATABASE_URL=postgresql://username:password@host:port/database
```

## Steps to Deploy

### Option A: GitHub + Railway (Recommended)
1. Create a GitHub repository
2. Upload all your files to GitHub
3. Go to [railway.app](https://railway.app)
4. Connect your GitHub account
5. Deploy from repository
6. Get your live URL

### Option B: Manual Upload to VPS
1. Get a VPS (Digital Ocean, Linode, etc.)
2. Install Node.js and npm
3. Upload files via FTP/SFTP or Git
4. Run `npm install`
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "church-finance"
pm2 startup
pm2 save
```

## Required Files for Deployment

Ensure these files are included:
- `package.json` ✅
- `server.js` ✅
- `index.html` ✅
- `styles.css` ✅
- `app.js` ✅
- `.env` (create if needed)

## Post-Deployment Steps

1. **Test the deployment:**
   - Visit your live URL
   - Check `/api/health` endpoint
   - Test database operations

2. **Update CORS settings if needed:**
   - The current server allows all origins (`cors()`)
   - For production, specify allowed domains

3. **Set up SSL/HTTPS:**
   - Most platforms provide free SSL certificates
   - Required for secure financial data

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to GitHub
   - Use platform's secret management

2. **Database Security:**
   - Use connection pooling
   - Implement proper authentication

3. **Rate Limiting:**
   - Already included in the current code
   - Adjust limits as needed

## Troubleshooting

**Common Issues:**
- **Port issues:** Set `PORT` environment variable
- **Database errors:** Check connection string
- **File permissions:** Ensure proper read/write access
- **CORS errors:** Update allowed origins

## Recommended Hosting Platforms by Use Case

- **Small Church (Free):** Railway, Render
- **Growing Church (Paid):** Digital Ocean VPS
- **Enterprise:** AWS, Google Cloud
- **Shared Hosting:** Check if Node.js is supported

Choose Railway for the quickest deployment with minimal configuration!