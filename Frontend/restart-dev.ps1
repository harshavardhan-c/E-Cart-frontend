# Clean and restart development server
Write-Host "Cleaning build cache..." -ForegroundColor Yellow

# Remove build cache
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Removed .next directory" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "Removed node_modules cache" -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Update baseline browser mapping
Write-Host "Updating baseline browser mapping..." -ForegroundColor Yellow
npm install baseline-browser-mapping@latest -D

Write-Host "Starting development server..." -ForegroundColor Yellow
npm run dev