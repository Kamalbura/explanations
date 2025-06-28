@echo off
echo Starting DSA Tracker App...
echo.
echo This will start both the content server and the React app
echo.

:: Start the content server
start cmd /k "title DSA Content Server && node content-server.mjs"
echo Content server starting on http://localhost:3001

:: Wait a moment for the server to start
timeout /t 2 > nul

:: Start the React app
start cmd /k "title DSA React App && npm run dev"
echo React app starting on http://localhost:5173

echo.
echo Both processes started. Use the browser to access http://localhost:5173
echo.
echo Press any key to close this window (the servers will keep running)
pause > nul
