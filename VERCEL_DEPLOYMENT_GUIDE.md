# Vercel Deployment Guide for E-Cart Project

## Prerequisites
1. GitHub account with your code pushed
2. Vercel account (sign up at vercel.com)
3. Backend API deployed (Render, Railway, or similar)

## Step-by-Step Deployment

### 1. Deploy Backend First
Before deploying the frontend, you need to deploy your backend API:

**Option A: Deploy to Render**
1. Go to render.com and sign up
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository and the `backend` folder
5. Set build command: `npm install`
6. Set start command: `npm start` or `node server.js`
7. Add environment variables from `backend/.env`
8. Deploy and note the URL (e.g., `https://your-app.onrender.com`)

**Option B: Deploy to Railway**
1. Go to railway.app and sign up
2. Create new project from GitHub repo
3. Select the backend folder
4. Add environment variables
5. Deploy and get the URL

### 2. Deploy Frontend to Vercel

#### Method 1: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/harshavardhan-c/E-Cart.git`
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bniqkmttkhzmfgyqkkoa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaXFrbXR0a2h6bWZneXFra29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTY1MzYsImV4cCI6MjA3Njc5MjUzNn0.f6Lzj5ulRXWH5BTh4wFh57Gv3582FGKAvYqpoPCRTqU
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
   ```
   
   **Important**: Replace `https://your-backend-url.com/api` with your actual deployed backend URL

6. Click "Deploy"

#### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Frontend directory
cd Frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bniqkmttkhzmfgyqkkoa.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production |
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-backend-url.com/api` | Production |

### 4. Common Issues and Solutions

#### Build Errors
- **TypeScript errors**: Already fixed in latest commit
- **Missing dependencies**: Check package.json in Frontend folder
- **Environment variables**: Ensure all NEXT_PUBLIC_ variables are set

#### Runtime Errors
- **API connection**: Verify backend URL is correct and accessible
- **CORS issues**: Configure backend to allow your Vercel domain
- **Database connection**: Ensure Supabase credentials are correct

### 5. Post-Deployment Steps

1. **Test the deployment**: Visit your Vercel URL and test all features
2. **Update CORS**: Add your Vercel domain to backend CORS configuration
3. **Custom domain** (optional): Add custom domain in Vercel settings
4. **SSL**: Vercel provides SSL automatically

### 6. Backend CORS Configuration

Update your backend to allow your Vercel domain:

```javascript
// In your backend server.js or app.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app', // Add your Vercel URL
    'https://your-custom-domain.com'      // Add custom domain if any
  ],
  credentials: true
}));
```

## Troubleshooting

### If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Verify environment variables are set correctly
4. Check that the root directory is set to "Frontend"

### If app loads but API calls fail:
1. Verify backend is deployed and accessible
2. Check CORS configuration
3. Verify API base URL environment variable
4. Check browser network tab for error details

## Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment