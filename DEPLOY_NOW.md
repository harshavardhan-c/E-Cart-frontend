# 🚀 Deploy Now - Step by Step

## Option 1: Automated Deployment (Recommended)

Run this command in PowerShell:

```powershell
.\deploy-to-github.ps1
```

Then select option 3 (Both) to deploy backend and frontend together.

---

## Option 2: Manual Deployment

### Step 1: Deploy Backend

```bash
# Navigate to backend
cd backend

# Initialize git if needed
git init
git remote add origin https://github.com/harshavardhan-c/E-Cart-backend.git

# Add all changes
git add .

# Commit
git commit -m "fix: Update OTP system with SendGrid - working version"

# Push (try main first, then master if needed)
git push -u origin main
# OR
git push -u origin master

# Go back to root
cd ..
```

### Step 2: Deploy Frontend

```bash
# Navigate to frontend
cd Frontend

# Add all changes
git add .

# Commit
git commit -m "fix: Update OTP verification and API configuration"

# Push
git push -u origin main
# OR
git push -u origin master

# Go back to root
cd ..
```

---

## What Happens After Push?

### Backend (Render):
1. GitHub webhook triggers Render
2. Render pulls latest code
3. Runs `npm install`
4. Runs `npm start`
5. Deploys to: https://e-cart-ws8c.onrender.com
6. Takes 2-5 minutes

### Frontend (Vercel):
1. GitHub webhook triggers Vercel
2. Vercel pulls latest code
3. Runs `npm install`
4. Runs `npm run build`
5. Deploys to your Vercel URL
6. Takes 1-3 minutes

---

## Verify Deployment

### 1. Check Render (Backend)
- Go to: https://dashboard.render.com/
- Find: `e-cart-backend`
- Status should be: "Live"
- Logs should show: "✅ SMTP server is ready to send emails"

### 2. Check Vercel (Frontend)
- Go to: https://vercel.com/dashboard
- Find your project
- Status should be: "Ready"
- Visit your live URL

### 3. Test OTP
- Go to your live frontend
- Try login with OTP
- Should work immediately!

---

## Quick Commands

### Deploy Both (Fastest)
```powershell
# Backend
cd backend; git add .; git commit -m "fix: OTP system update"; git push; cd ..

# Frontend  
cd Frontend; git add .; git commit -m "fix: OTP update"; git push; cd ..
```

### Check Status
```bash
# Backend
cd backend; git status; cd ..

# Frontend
cd Frontend; git status; cd ..
```

---

## If You Get Errors

### "fatal: not a git repository"
```bash
cd backend
git init
git remote add origin https://github.com/harshavardhan-c/E-Cart-backend.git
cd ..
```

### "failed to push"
```bash
# Try pulling first
git pull origin main --rebase
# Then push
git push origin main
```

### "rejected - non-fast-forward"
```bash
# Force push (use carefully!)
git push -f origin main
```

---

## Ready to Deploy?

**Run this now:**
```powershell
.\deploy-to-github.ps1
```

**Or manually:**
1. Open PowerShell in project root
2. Run backend commands above
3. Run frontend commands above
4. Wait for deployments
5. Test OTP system

---

**Deployment takes 5-10 minutes total. Your OTP system will be live!** 🎉
