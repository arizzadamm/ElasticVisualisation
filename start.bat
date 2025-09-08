@echo off
echo Starting Norse Attack Map Application...
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both backend and frontend
npm run dev:full
