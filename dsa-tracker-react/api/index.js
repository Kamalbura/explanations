const fs = require('fs');
const path = require('path');

// Helper to handle serverless function responses
const handleResponse = (res, data, status = 200) => {
  res.status(status).json(data);
};

// Helper to get base path for content (works differently in Vercel vs local)
const getBasePath = () => {
  // When deployed to Vercel
  if (process.env.VERCEL) {
    return path.join(process.cwd());
  }
  
  // When running locally
  return path.join(__dirname, '../../');
};

// Set up CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url;
  const basePath = getBasePath();

  try {
    // Route handling based on URL path
    if (url.startsWith('/api/topics') && !url.includes('/theory') && !url.includes('/problems')) {
      // Get all topics
      const topics = [];
      const EXPLANATIONS_PATH = basePath;
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
      
      return handleResponse(res, topics);
    } 
    else if (url.match(/\/api\/topics\/.*\/theory/)) {
      // Get theory for a specific topic
      const topicDir = url.split('/')[3];
      const filePath = path.join(basePath, topicDir, 'THEORY_COMPLETE.md');
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return handleResponse(res, { 
          content,
          filePath: filePath,
          lastModified: fs.statSync(filePath).mtime
        });
      } else {
        return handleResponse(res, { error: 'Theory file not found' }, 404);
      }
    } 
    else if (url.match(/\/api\/topics\/.*\/problems/)) {
      // Get problems for a specific topic
      const topicDir = url.split('/')[3];
      const filePath = path.join(basePath, topicDir, 'PROBLEMS_SOLUTIONS.md');
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return handleResponse(res, { 
          content,
          filePath: filePath,
          lastModified: fs.statSync(filePath).mtime
        });
      } else {
        return handleResponse(res, { error: 'Problems file not found' }, 404);
      }
    } 
    else if (url === '/api/roadmap') {
      // Get roadmap and progress files
      const files = fs.readdirSync(basePath);
      const roadmapFiles = files.filter(file => 
        file.includes('ROADMAP') || 
        file.includes('ITERATION') || 
        file.includes('PROGRESS')
      );
      
      const roadmapContent = {};
      roadmapFiles.forEach(file => {
        const filePath = path.join(basePath, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
          roadmapContent[file] = fs.readFileSync(filePath, 'utf8');
        }
      });
      
      return handleResponse(res, roadmapContent);
    }
    else if (url.startsWith('/api/leetcode')) {
      // Proxy for LeetCode API requests
      const { query, variables } = req.body;
      try {
        const leetcodeUsername = variables?.username || "unknown";
        console.log(`Proxying request to LeetCode API for user: ${leetcodeUsername}`);
        
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com',
            'Origin': 'https://leetcode.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          },
          body: JSON.stringify({ query, variables })
        });
        
        if (!response.ok) {
          throw new Error(`LeetCode API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("LeetCode API response received successfully");
        
        return handleResponse(res, data);
      } catch (error) {
        console.error("LeetCode API proxy error:", error.message);
        return handleResponse(res, { error: error.message }, 500);
      }
    }
    else {
      // Handle unknown routes
      return handleResponse(res, { error: 'Route not found' }, 404);
    }
    
  } catch (error) {
    console.error('API error:', error);
    return handleResponse(res, { error: error.message }, 500);
  }
};
