# 🚀 Deploying IPTV Services Website to Vercel

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Your code is already on GitHub ✅
3. **MySQL Database** - You'll need a hosted MySQL database (e.g., PlanetScale, Railway, or Aiven)

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Database

Since Vercel is serverless, you need a hosted MySQL database. Choose one:

#### Option A: PlanetScale (Recommended - Free Tier)
1. Go to https://planetscale.com
2. Sign up and create a new database
3. Get your connection string
4. Format: `mysql://user:password@host/database?ssl={"rejectUnauthorized":true}`

#### Option B: Railway (Easy Setup)
1. Go to https://railway.app
2. Create a new MySQL database
3. Copy the connection details

#### Option C: Aiven (Reliable)
1. Go to https://aiven.io
2. Create MySQL service
3. Get connection string

### Step 2: Import Your Database

1. Export your local database:
```bash
mysqldump -u root -p iptv_database > database_backup.sql
```

2. Import to your hosted database using their tools or CLI

---

### Step 3: Deploy to Vercel

#### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Your GitHub Repository**
   - Select: `alexelgato61-design/Iptv_ready_to_deploy`
   - Click "Import"

3. **Configure Project Settings**
   
   **Framework Preset:** Next.js
   
   **Root Directory:** `next-app`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `.next`
   
   **Install Command:** `npm install`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add these:

   ```env
   # Database
   DB_HOST=your-hosted-db-host.com
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=iptv_database
   
   # JWT Secret
   JWT_SECRET=iptv-jwt-secret-key-2025-change-in-production-e8f9a2b3c4d5e6f7
   
   # Backend URL (will be your Vercel backend URL)
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=IPTV Admin <noreply@yoursite.com>
   EMAIL_SECURE=false
   
   # Frontend URL (your Vercel domain)
   FRONTEND_URL=https://your-frontend-url.vercel.app
   
   # Node Environment
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

---

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Frontend**
```bash
cd next-app
vercel
```

4. **Deploy Backend (API)**
```bash
cd ../backend
vercel
```

5. **Set Environment Variables**
```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add JWT_SECRET
# ... add all other variables
```

---

## ⚙️ Important Configuration Changes

### 1. Update next-app/next.config.js

The current proxy won't work on Vercel. Update the rewrites section:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
    },
  ]
},
```

### 2. Update API Calls in Frontend

Make sure all API calls use the environment variable:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Example API call
fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  // ...
})
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS for all connections
- [ ] Enable CORS only for your frontend domain
- [ ] Set up proper environment variables
- [ ] Use SSL for database connections
- [ ] Set NODE_ENV=production
- [ ] Update email credentials with app-specific passwords
- [ ] Add rate limiting for API routes

---

## 🌐 Alternative: Split Deployment

### Option A: Frontend on Vercel, Backend on Railway

**Frontend (Vercel):**
1. Deploy only `next-app` folder to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL

**Backend (Railway):**
1. Go to https://railway.app
2. Create new project from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add all environment variables
6. Railway will auto-deploy

### Option B: Both on Railway

Railway supports both frontend and backend easily:
1. Create new project
2. Deploy from GitHub
3. Railway auto-detects Next.js and Node.js

---

## 📝 Post-Deployment Steps

1. **Test Your Deployment**
   - Visit your Vercel URL
   - Test login functionality
   - Check all API endpoints
   - Test file uploads
   - Verify email sending

2. **Set Up Custom Domain** (Optional)
   - Go to Vercel project settings
   - Add your custom domain
   - Update DNS records
   - Update FRONTEND_URL environment variable

3. **Monitor Your App**
   - Check Vercel Analytics
   - Monitor error logs
   - Set up alerts

---

## 🐛 Common Issues & Solutions

### Issue 1: API Routes Not Working
**Solution:** Make sure NEXT_PUBLIC_API_URL is set correctly

### Issue 2: Database Connection Failed
**Solution:** 
- Verify database host, user, password
- Check if database allows external connections
- Enable SSL if required

### Issue 3: File Uploads Not Working
**Solution:** Vercel has a 50MB limit. Use cloud storage:
- Cloudinary (recommended)
- AWS S3
- Google Cloud Storage

### Issue 4: Environment Variables Not Loading
**Solution:**
- Redeploy after adding variables
- Check variable names (no typos)
- Use NEXT_PUBLIC_ prefix for frontend variables

---

## 💡 Pro Tips

1. **Use Connection Pooling** - Already configured in your database.js ✅

2. **Optimize Images** - Vercel automatically optimizes images

3. **Use Edge Functions** - For faster global performance

4. **Set Up Preview Deployments** - Every push creates a preview URL

5. **Enable Vercel Analytics** - Free monitoring and insights

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PlanetScale with Vercel](https://planetscale.com/docs/tutorials/deploy-to-vercel)
- [Railway Documentation](https://docs.railway.app)

---

## 🚨 Important Notes

1. **Vercel Limitations:**
   - Serverless functions have 10-second timeout on Hobby plan
   - 50MB upload limit
   - Functions are stateless

2. **Database:**
   - Must use hosted database (no local MySQL)
   - Connection pooling is important
   - Use SSL connections in production

3. **File Storage:**
   - Vercel filesystem is read-only
   - Use cloud storage for uploads
   - Already have uploads/ folder - migrate to cloud storage

---

## ✅ Quick Checklist

- [ ] GitHub repository is up to date
- [ ] Database is hosted and accessible
- [ ] Database schema is imported
- [ ] Environment variables are prepared
- [ ] next.config.js is updated for production
- [ ] API URLs are configured
- [ ] Email credentials are set up
- [ ] Ready to deploy!

---

**Need Help?** Check Vercel's support or community forums.

**Your Repository:** https://github.com/alexelgato61-design/Iptv_ready_to_deploy

**Ready to deploy!** 🚀
