@echo off
echo Starting DSA Tracker Application...
echo.

REM Change to the correct directory
cd dsa-tracker-react

REM Start content server in a new window
start cmd /k "title DSA Content Server && node content-server.mjs"
echo Content server starting on http://localhost:3001
echo.

REM Wait a moment for server to initialize
timeout /t 3 /nobreak >nul

REM Start React app in a new window
start cmd /k "title DSA React App && npm run dev"
echo React app starting on http://localhost:5173
echo.

echo Both processes started successfully!
echo Browse to http://localhost:5173 to view the application
echo.
echo Press any key to close this launcher window (servers will continue running)
pause > nul
