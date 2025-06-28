# DSA Tracker Application - Quick Start Guide

This guide will help you run the DSA Tracker Application correctly.

## Running the Application

### Method 1: Using the launcher script
1. Navigate to the `explanations` directory: 
   ```
   cd C:\Users\burak\Desktop\prep\DSA_Approaches\explanations
   ```

2. Run the launcher script:
   ```
   start-servers.bat
   ```
   This will start both the content server and React app in separate windows.

### Method 2: Manual startup
1. Navigate to the `dsa-tracker-react` directory:
   ```
   cd C:\Users\burak\Desktop\prep\DSA_Approaches\explanations\dsa-tracker-react
   ```

2. Start the content server:
   ```
   node content-server.mjs
   ```

3. In a new terminal window, start the React app:
   ```
   npm run dev
   ```

## Accessing the Application
- The React app will be available at [http://localhost:5173](http://localhost:5173)
- The content server runs at [http://localhost:3001](http://localhost:3001)

## Debugging the Server
- Path diagnostics are available at [http://localhost:3001/api/debug/paths](http://localhost:3001/api/debug/paths)
- You can clear the server cache at [http://localhost:3001/api/clear-cache](http://localhost:3001/api/clear-cache)

## Important Notes
- Make sure both the content server and React app are running for the application to work properly
- The content server looks for DSA study materials in multiple directories
- If you encounter any "file not found" errors, check the path diagnostics endpoint

## File Structure
The application expects DSA content in directories like:
- `01_Two_Pointers`
- `02_Sliding_Window` 
- And other algorithm-specific folders

Inside each topic folder, it looks for files like `THEORY_COMPLETE.md` and `PROBLEMS_SOLUTIONS.md`.
