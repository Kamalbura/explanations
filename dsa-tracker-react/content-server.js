// Static file serving configuration to load your actual markdown files
// This will allow the app to read from your explanations directory

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for your React app
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app'] // Replace with your actual Vercel domain
    : 'http://localhost:5173'
}));

// Base path to your explanations directory
const EXPLANATIONS_PATH = path.join(__dirname, '../../');

// API endpoint to get all available topics
app.get('/api/topics', (req, res) => {
  try {
    const topics = [];
    const directories = fs.readdirSync(EXPLANATIONS_PATH);
    
    directories.forEach(dir => {
      if (dir.match(/^\d+_/)) { // Match directories like 01_Two_Pointers
        const dirPath = path.join(EXPLANATIONS_PATH, dir);
        if (fs.statSync(dirPath).isDirectory()) {
          const files = fs.readdirSync(dirPath);
          
          const topicInfo = {
            id: dir.toLowerCase().replace(/^\d+_/, '').replace(/_/g, '-'),
            title: dir.replace(/^\d+_/, '').replace(/_/g, ' '),
            directory: dir,
            hasTheory: files.includes('THEORY_COMPLETE.md'),
            hasProblems: files.includes('PROBLEMS_SOLUTIONS.md'),
            files: files
          };
          
          topics.push(topicInfo);
        }
      }
    });
    
    res.json(topics);
  } catch (error) {
    console.error('Error reading topics:', error);
    res.status(500).json({ error: 'Failed to read topics' });
  }
});

// API endpoint to get theory content for a specific topic
app.get('/api/topics/:topicDir/theory', (req, res) => {
  try {
    const { topicDir } = req.params;
    const filePath = path.join(EXPLANATIONS_PATH, topicDir, 'THEORY_COMPLETE.md');
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.json({ 
        content,
        filePath: filePath,
        lastModified: fs.statSync(filePath).mtime
      });
    } else {
      res.status(404).json({ error: 'Theory file not found' });
    }
  } catch (error) {
    console.error('Error reading theory file:', error);
    res.status(500).json({ error: 'Failed to read theory file' });
  }
});

// API endpoint to get problems content for a specific topic
app.get('/api/topics/:topicDir/problems', (req, res) => {
  try {
    const { topicDir } = req.params;
    const filePath = path.join(EXPLANATIONS_PATH, topicDir, 'PROBLEMS_SOLUTIONS.md');
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.json({ 
        content,
        filePath: filePath,
        lastModified: fs.statSync(filePath).mtime
      });
    } else {
      res.status(404).json({ error: 'Problems file not found' });
    }
  } catch (error) {
    console.error('Error reading problems file:', error);
    res.status(500).json({ error: 'Failed to read problems file' });
  }
});

// API endpoint to get roadmap and progress files
app.get('/api/roadmap', (req, res) => {
  try {
    const files = fs.readdirSync(EXPLANATIONS_PATH);
    const roadmapFiles = files.filter(file => 
      file.includes('ROADMAP') || 
      file.includes('ITERATION') || 
      file.includes('PROGRESS')
    );
    
    const roadmapContent = {};
    roadmapFiles.forEach(file => {
      const filePath = path.join(EXPLANATIONS_PATH, file);
      if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
        roadmapContent[file] = fs.readFileSync(filePath, 'utf8');
      }
    });
    
    res.json(roadmapContent);
  } catch (error) {
    console.error('Error reading roadmap files:', error);
    res.status(500).json({ error: 'Failed to read roadmap files' });
  }
});

app.listen(PORT, () => {
  console.log(`📚 DSA Content Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${EXPLANATIONS_PATH}`);
  console.log(`🔗 React app should connect to this server for file content`);
});
