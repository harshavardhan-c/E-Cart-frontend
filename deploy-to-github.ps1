# Deploy Script - Push Backend and Frontend to Separate Repos
# Author: Kiro AI Assistant
# Date: $(Get-Date -Format "yyyy-MM-dd")

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🚀 DEPLOYING TO GITHUB                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$backendRepo = "https://github.com/harshavardhan-c/E-Cart-backend.git"
$frontendRepo = "https://github.com/harshavardhan-c/E-Cart-frontend.git"

# Function to deploy backend
function Deploy-Backend {
    Write-Host "📦 Deploying Backend..." -ForegroundColor Yellow
    Write-Host "Repository: $backendRepo" -ForegroundColor White
    Write-Host ""
    
    cd backend
    
    # Check if git is initialized
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing git repository..." -ForegroundColor Yellow
        git init
        git remote add origin $backendRepo
    } else {
        # Check if remote exists
        $remotes = git remote
        if ($remotes -notcontains "origin") {
            git remote add origin $backendRepo
        }
    }
    
    # Check git status
    Write-Host "Checking changes..." -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Add all changes
    Write-Host "Adding changes..." -ForegroundColor Cyan
    git add .
    
    # Commit changes
    $commitMessage = "fix: Update OTP system with SendGrid configuration"
    Write-Host "Committing changes..." -ForegroundColor Cyan
    Write-Host "Message: $commitMessage" -ForegroundColor White
    git commit -m $commitMessage
    
    # Push to GitHub
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend deployment failed!" -ForegroundColor Red
        Write-Host "Trying 'master' branch..." -ForegroundColor Yellow
        git push -u origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend deployment failed!" -ForegroundColor Red
        }
    }
    
    cd ..
    Write-Host ""
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "📦 Deploying Frontend..." -ForegroundColor Yellow
    Write-Host "Repository: $frontendRepo" -ForegroundColor White
    Write-Host ""
    
    cd Frontend
    
    # Check if git is initialized
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing git repository..." -ForegroundColor Yellow
        git init
        git remote add origin $frontendRepo
    } else {
        # Check if remote exists
        $remotes = git remote
        if ($remotes -notcontains "origin") {
            git remote add origin $frontendRepo
        }
    }
    
    # Check git status
    Write-Host "Checking changes..." -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Add all changes
    Write-Host "Adding changes..." -ForegroundColor Cyan
    git add .
    
    # Commit changes
    $commitMessage = "fix: Update API configuration and OTP verification flow"
    Write-Host "Committing changes..." -ForegroundColor Cyan
    Write-Host "Message: $commitMessage" -ForegroundColor White
    git commit -m $commitMessage
    
    # Push to GitHub
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
        Write-Host "Trying 'master' branch..." -ForegroundColor Yellow
        git push -u origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
        }
    }
    
    cd ..
    Write-Host ""
}

# Main deployment
Write-Host "Starting deployment process..." -ForegroundColor Cyan
Write-Host ""

# Ask user what to deploy
Write-Host "What would you like to deploy?" -ForegroundColor Yellow
Write-Host "1. Backend only" -ForegroundColor White
Write-Host "2. Frontend only" -ForegroundColor White
Write-Host "3. Both (Backend + Frontend)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1/2/3)"

switch ($choice) {
    "1" {
        Deploy-Backend
    }
    "2" {
        Deploy-Frontend
    }
    "3" {
        Deploy-Backend
        Deploy-Frontend
    }
    default {
        Write-Host "Invalid choice. Deploying both..." -ForegroundColor Yellow
        Deploy-Backend
        Deploy-Frontend
    }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ DEPLOYMENT COMPLETE                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check Render dashboard for backend deployment" -ForegroundColor White
Write-Host "2. Check Vercel dashboard for frontend deployment" -ForegroundColor White
Write-Host "3. Verify OTP system is working in production" -ForegroundColor White
Write-Host ""
Write-Host "Backend: https://dashboard.render.com/" -ForegroundColor Yellow
Write-Host "Frontend: https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host ""
