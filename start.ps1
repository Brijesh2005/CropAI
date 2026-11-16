Write-Host "===================================================" -ForegroundColor Green
Write-Host "Starting TerraVision Farm (Backend + Frontend)" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend in a separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

# Start Frontend in a separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host "`nBoth servers have been launched in separate windows!" -ForegroundColor Cyan
Write-Host "  Web App:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "  API Docs: http://localhost:8000/docs`n" -ForegroundColor Yellow

