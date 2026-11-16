@echo off
echo ===================================================
echo Starting TerraVision Farm (Backend + Frontend)
echo ===================================================

echo Starting FastAPI Backend on port 8000...
start "TerraVision Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

echo Starting Vite Frontend on port 5173...
start "TerraVision Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Web App:  http://localhost:5173
echo - API Docs: http://localhost:8000/docs
echo.
pause

