# 🚀 Deployment Guide - Push to Separate Repositories

## Quick Deploy (Automated)

Run this PowerShell script:
```powershell
.\deploy-to-github.ps1
```

It will:
1. Ask what to deploy (Backend/Frontend/Both)
2. Add all changes
3. Commit with descriptive message
4. Push to respective GitHub repos
5. Trigger automatic redeployment

---

## Manual Deployment

### Deploy Backend

```bash
cd backend

# Initialize git (if not already done)
git init
git remote add origin https://github.com/harshavardhan-c/E-Cart-backend.git

# Add and commit changes
git add .
git commit -m "fix: Update OTP system with SendGrid configuration"

# Push to GitHub
git push -u origin main
# If main doesn't work, try: git push -u origin master
```

### Deploy Frontend

```bash
cd Frontend

# Check current remote
git remote -v

# Add and commit changes
git add .
git commit -m "fix: Update API configuration and OTP verification flow"

# Push to GitHub
git push -u origin main
# If main doesn't work, try: git push -u origin master
```

---

## What Changed

### Backend Changes:
- ✅ SendGrid SMTP configuration (replaced Gmail)
- ✅ Enhanced error logging in OTP sending
- ✅ Fixed OTP expiry time (10 minutes)
- ✅ Improved SMTP connection handling
- ✅ Non-blocking SMTP verification in production

### Frontend Changes:
- ✅ Updated API base URL configuration
- ✅ Fixed OTP verification flow
- ✅ Improved error handling

---

## After Deployment

### 1. Verify Backend (Render)

1. Go to: https://dashboard.render.com/
2. Find your `e-cart-backend` service
3. Check deployment logs
4. Look for: `✅ Your service is live 🎉`
5. Verify: `✅ SMTP server is ready to send emails`

### 2. Verify Frontend (Vercel)

1. Go to: https://vercel.com/dashboard
2. Find your frontend project
3. Check deployment status
4. Wait for "Ready" status
5. Visit your live URL

### 3. Test OTP System

1. Go to your live frontend URL
2. Click "Login"
3. Enter email address
4. Click "Send OTP"
5. Check email inbox (and spam folder)
6. Enter OTP and verify

---

## Environment Variables

### Backend (Render)

Make sure these are set in Render dashboard:

```env
PORT=5000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://bniqkmttkhzmfgyqkkoa.supabase.co
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here

# JWT
JWT_SECRET=your_secret_here

# Frontend URL
FRONTEND_URL=your_vercel_url_here

# SendGrid SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
SMTP_FROM=chamalaharshavardhan55@gmail.com
```

### Frontend (Vercel)

Make sure these are set in Vercel dashboard:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://e-cart-ws8c.onrender.com/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bniqkmttkhzmfgyqkkoa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## Troubleshooting

### Backend Deployment Issues

**Issue:** Build fails
**Fix:** Check Render logs for errors

**Issue:** SMTP errors on startup
**Fix:** Verify SendGrid API key in environment variables

**Issue:** Port already in use
**Fix:** Render handles this automatically

### Frontend Deployment Issues

**Issue:** Build fails
**Fix:** Check Vercel logs for errors

**Issue:** API connection fails
**Fix:** Verify NEXT_PUBLIC_API_BASE_URL is correct

**Issue:** Environment variables not working
**Fix:** Redeploy after updating env vars

---

## Deployment Checklist

### Before Deploying:
- [ ] All changes committed locally
- [ ] Tested OTP system locally
- [ ] Environment variables documented
- [ ] No sensitive data in code

### Backend Deployment:
- [ ] Code pushed to GitHub
- [ ] Render auto-deployment triggered
- [ ] Deployment successful
- [ ] Backend health check passes
- [ ] SMTP connection working

### Frontend Deployment:
- [ ] Code pushed to GitHub
- [ ] Vercel auto-deployment triggered
- [ ] Deployment successful
- [ ] Frontend loads correctly
- [ ] API connection working

### Post-Deployment:
- [ ] Test OTP sending
- [ ] Test OTP verification
- [ ] Test login flow
- [ ] Check email delivery
- [ ] Monitor error logs

---

## Monitoring

### Backend Logs (Render)
```
✅ Server running on port 5000
✅ SMTP server is ready to send emails
📧 Attempting to send OTP to [email]...
✅ OTP sent successfully to [email]
```

### Frontend Logs (Vercel)
Check browser console for:
```
POST /api/auth/send-otp 200 OK
```

### SendGrid Dashboard
Monitor email activity:
https://app.sendgrid.com/email_activity

---

## Support

If deployment fails:
1. Check deployment logs
2. Verify environment variables
3. Test endpoints manually
4. Check GitHub Actions (if configured)

---

**Ready to deploy?** Run `.\deploy-to-github.ps1` or follow manual steps above!
