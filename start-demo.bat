@echo off
echo Starting Norse Attack Map in DEMO MODE...
echo.
echo This will use simulated attack data instead of Elasticsearch
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both backend and frontend in demo mode
npm run dev:demo:full
