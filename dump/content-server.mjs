// Advanced proxy server for LeetCode integration with session support
// This server handles API proxying, content serving, and LeetCode authentication

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import axios from 'axios';
import NodeCache from 'node-cache';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup cache with 5 minute TTL
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
// Session cache for storing LeetCode user sessions
const sessionCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 }); // 1 hour TTL

// Enable CORS for your React app with credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Parse cookies, JSON and URL-encoded bodies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base path to your explanations directory - both relative and absolute paths
const EXPLANATIONS_PATH = path.join(__dirname, '../');
const PUBLIC_EXPLANATIONS_PATH = path.join(__dirname, 'public/explanations');

// Dynamic path to the explanations folder
const USER_EXPLANATIONS_PATH = path.resolve(__dirname, '..');
const ABSOLUTE_EXPLANATIONS_PATH = USER_EXPLANATIONS_PATH;

// Debug path information
console.log('Path configurations:');
console.log(` - EXPLANATIONS_PATH: ${EXPLANATIONS_PATH}`);
console.log(` - PUBLIC_EXPLANATIONS_PATH: ${PUBLIC_EXPLANATIONS_PATH}`);
console.log(` - USER_EXPLANATIONS_PATH: ${USER_EXPLANATIONS_PATH}`);
console.log(` - ABSOLUTE_EXPLANATIONS_PATH: ${ABSOLUTE_EXPLANATIONS_PATH}`);

// LeetCode API endpoints
const LEETCODE_BASE_URL = 'https://leetcode.com';
const LEETCODE_API_URL = 'https://leetcode.com/api';
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

// LeetCode GraphQL API proxy endpoint with session support
app.post('/api/leetcode/graphql', async (req, res) => {
  try {
    // Get session from cookies if available
    const sessionId = req.cookies['leetcode_session'] || '';
    const csrfToken = req.cookies['csrftoken'] || '';
    const cacheKey = `${sessionId}:${JSON.stringify(req.body)}`;
    
    // Check cache first
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Serving cached LeetCode response');
      return res.json(cachedResponse);
    }
    
    console.log('Fetching from LeetCode API...');
    
    // Setup headers with session cookies if available
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com'
    };
    
    // Add auth cookies if available
    if (sessionId) {
      headers['Cookie'] = `LEETCODE_SESSION=${sessionId}; csrftoken=${csrfToken}`;
      if (csrfToken) {
        headers['x-csrftoken'] = csrfToken;
      }
    }
    
    // Make request to LeetCode
    const response = await axios.post(LEETCODE_GRAPHQL_URL, req.body, { headers });
    
    // Cache the response
    apiCache.set(cacheKey, response.data);
    
    // Pass through any cookies from LeetCode
    if (response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(cookie => {
        res.append('Set-Cookie', cookie);
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('LeetCode API proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error proxying request to LeetCode API',
      message: error.message,
      details: error.response?.data || {}
    });
  }
});

// LeetCode Login endpoint
app.post('/api/leetcode/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // If password is provided, attempt full login (still experimental)
    if (password) {
      try {
        // Get CSRF token first
        const csrfResponse = await axios.get(`${LEETCODE_BASE_URL}/accounts/login/`);
        const csrfTokenMatch = csrfResponse.data.match(/csrfToken: "([^"]+)"/);
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : '';
        
        if (!csrfToken) {
          return res.status(500).json({ error: 'Failed to get CSRF token' });
        }
        
        // Attempt login
        const loginResponse = await axios.post(`${LEETCODE_BASE_URL}/accounts/login/`, 
          { login: username, password, csrfmiddlewaretoken: csrfToken },
          { 
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `csrftoken=${csrfToken}`,
              'X-CSRFToken': csrfToken,
              'Referer': `${LEETCODE_BASE_URL}/accounts/login/`
            },
            withCredentials: true,
            maxRedirects: 0
          }
        );
        
        // Extract session cookies
        const cookies = loginResponse.headers['set-cookie'];
        if (cookies) {
          // Pass cookies to client
          cookies.forEach(cookie => {
            res.append('Set-Cookie', cookie);
          });
          
          // Store session in cache
          const sessionMatch = cookies.find(c => c.includes('LEETCODE_SESSION='));
          if (sessionMatch) {
            const sessionId = sessionMatch.split(';')[0].split('=')[1];
            sessionCache.set(`user:${username}`, { sessionId, csrfToken });
          }
          
          return res.json({ success: true, message: 'Login successful', username });
        }
        
        return res.status(401).json({ error: 'Login failed' });
      } catch (loginError) {
        console.error('LeetCode login error:', loginError.message);
        // Fall back to session-less mode
      }
    }
    
    // Store username for session-less mode
    sessionCache.set(`activeUser`, { username });
    
    // Set a cookie for client-side tracking
    res.cookie('leetcode_username', username, { maxAge: 86400000, httpOnly: false }); // 24 hours
    res.json({ success: true, message: 'Username stored for LeetCode tracking', username });
    
  } catch (error) {
    console.error('LeetCode login proxy error:', error.message);
    res.status(500).json({ error: 'Login request failed' });
  }
});

// LeetCode Logout endpoint
app.post('/api/leetcode/logout', (req, res) => {
  try {
    const username = req.cookies['leetcode_username'];
    
    // Clear session from cache
    if (username) {
      sessionCache.del(`user:${username}`);
      sessionCache.del('activeUser');
    }
    
    // Clear cookies
    res.clearCookie('leetcode_username');
    res.clearCookie('leetcode_session');
    res.clearCookie('csrftoken');
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('LeetCode logout error:', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Check LeetCode login status
app.get('/api/leetcode/status', (req, res) => {
  try {
    const username = req.cookies['leetcode_username'];
    const sessionId = req.cookies['leetcode_session'];
    
    if (username || sessionId) {
      const user = sessionCache.get(`user:${username}`) || sessionCache.get('activeUser');
      if (user) {
        return res.json({ 
          loggedIn: true, 
          username: user.username || username,
          hasFullSession: !!sessionId
        });
      }
    }
    
    res.json({ loggedIn: false });
  } catch (error) {
    console.error('LeetCode status check error:', error.message);
    res.status(500).json({ error: 'Failed to check login status' });
  }
});

// API endpoint to get all available topics - dynamically reading from filesystem
app.get('/api/topics', (req, res) => {
  try {
    const topics = [];
    
    // Try all explanation paths
    const possiblePaths = [
      PUBLIC_EXPLANATIONS_PATH,
      EXPLANATIONS_PATH,
      USER_EXPLANATIONS_PATH,
      ABSOLUTE_EXPLANATIONS_PATH,
      path.join(__dirname, '../..') // Another possible path for parent directory
    ];
    
    let foundPath = false;
    
    for (const basePath of possiblePaths) {
      try {
        if (fs.existsSync(basePath)) {
          const directories = fs.readdirSync(basePath);
          
          directories.forEach(dir => {
            if (dir.match(/^\d+_/)) { // Match directories like 01_Two_Pointers
              const dirPath = path.join(basePath, dir);
              if (fs.statSync(dirPath).isDirectory()) {
                const files = fs.readdirSync(dirPath);
                
                const topicInfo = {
                  id: dir.toLowerCase().replace(/^\d+_/, '').replace(/_/g, '-'),
                  title: dir.replace(/^\d+_/, '').replace(/_/g, ' '),
                  directory: dir,
                  hasTheory: files.some(file => file.includes('THEORY')),
                  hasProblems: files.some(file => file.includes('PROBLEMS') || file.includes('SOLUTIONS')),
                  path: dirPath,
                  files: files.filter(file => file.endsWith('.md'))
                };
                
                topics.push(topicInfo);
              }
            }
          });
          
          foundPath = true;
          break;
        }
      } catch (dirError) {
        console.error(`Error reading directory ${basePath}:`, dirError);
      }
    }
    
    if (!foundPath) {
      return res.status(404).json({ error: 'No valid explanations directories found' });
    }
    
    res.json(topics);
  } catch (error) {
    console.error('Error reading topics:', error);
    res.status(500).json({ error: 'Failed to read topics', message: error.message });
  }
});

// API endpoint to list all files in a directory
app.get('/api/files/:directory(*)', (req, res) => {
  try {
    let requestPath = req.params.directory;
    // Using wildcard pattern (*) instead of req.params[0]
    
    console.log(`Requested directory path: ${requestPath}`);
    
    // Try paths in priority order
    const possiblePaths = [
      path.join(PUBLIC_EXPLANATIONS_PATH, requestPath),
      path.join(EXPLANATIONS_PATH, requestPath),
      path.join(USER_EXPLANATIONS_PATH, requestPath), // User specified path
      path.join(ABSOLUTE_EXPLANATIONS_PATH, requestPath),
      path.join(__dirname, '../', requestPath), // Add this path for better directory navigation
      path.join(__dirname, '../../', requestPath), // Try parent of parent directory
      // Try direct paths for DSA topic directories
      ...['01_Two_Pointers', '02_Sliding_Window', '03_Binary_Search', '04_Dynamic_Programming',
          '05_Greedy_Algorithms', '06_Backtracking', '07_Graph_Algorithms', 
          '08_Tree_Algorithms', '09_Stack_Queue', '10_Heap_Priority_Queue'].map(dir => 
            path.join(USER_EXPLANATIONS_PATH, dir, requestPath.replace(/:/g, '_'))
      )
    ];
    
    console.log('Looking in these paths:');
    possiblePaths.forEach(p => console.log(` - ${p}`));
    
    let dirPath = null;
    let files = null;
    
    // Find first existing path
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        const stats = fs.statSync(tryPath);
        if (stats.isDirectory()) {
          dirPath = tryPath;
          files = fs.readdirSync(tryPath);
          console.log(`Found directory at ${tryPath} with ${files.length} files`);
          break;
        }
      }
    }
    
    if (!files) {
      console.log('Directory not found in any of the search paths');
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    // Process file information
    const fileList = files.map(file => {
      const fullPath = path.join(dirPath, file);
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (error) {
        console.error(`Error getting stats for file ${fullPath}:`, error.message);
        return null;
      }
      
      const isDirectory = stats.isDirectory();
      
      return {
        name: file,
        path: path.join(requestPath, file),
        isDirectory,
        size: stats.size,
        lastModified: stats.mtime,
        extension: isDirectory ? null : path.extname(file).substr(1)
      };
    }).filter(Boolean); // Remove any null entries from failed stats
    
    res.json({ 
      path: requestPath,
      absolutePath: dirPath,
      files: fileList
    });
  } catch (error) {
    console.error('Error listing directory:', error);
    res.status(500).json({ error: 'Failed to list directory contents' });
  }
});

// API endpoint to get file content by path
app.get('/api/content/:filepath(*)', (req, res) => {
  try {
    let requestPath = req.params.filepath;
    // Handle additional path fragments (no longer needed with the (*) wildcard pattern)
    // Using the wildcard pattern instead of req.params[0]
    
    console.log(`Requested file path: ${requestPath}`);
    
    // Try paths in priority order
    const possiblePaths = [
      path.join(PUBLIC_EXPLANATIONS_PATH, requestPath),
      path.join(EXPLANATIONS_PATH, requestPath),
      path.join(USER_EXPLANATIONS_PATH, requestPath), // User specified path
      path.join(__dirname, '../', requestPath) // Add this path for better file navigation
    ];
    
    console.log('Looking for file in these paths:');
    possiblePaths.forEach(p => console.log(` - ${p}`));
    
    let filePath = null;
    
    // Find first existing path
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        const stats = fs.statSync(tryPath);
        if (stats.isFile()) {
          filePath = tryPath;
          console.log(`Found file at ${tryPath}`);
          break;
        }
      }
    }
    
    if (!filePath) {
      console.log('File not found in any of the search paths');
      return res.status(404).json({ error: 'File not found' });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    res.json({
      path: requestPath,
      absolutePath: filePath,
      content: content,
      size: stats.size,
      lastModified: stats.mtime,
      extension: path.extname(filePath).substr(1)
    });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// API endpoint to get theory content for a specific topic
app.get('/api/topics/:topicDir/theory', (req, res) => {
  try {
    const { topicDir } = req.params;
    
    // Try all possible paths
    const possiblePaths = [
      path.join(PUBLIC_EXPLANATIONS_PATH, topicDir, 'THEORY_COMPLETE.md'),
      path.join(EXPLANATIONS_PATH, topicDir, 'THEORY_COMPLETE.md'),
      path.join(USER_EXPLANATIONS_PATH, topicDir, 'THEORY_COMPLETE.md')
    ];
    
    let filePath = null;
    
    // Find first existing path
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        filePath = tryPath;
        break;
      }
    }
    
    if (filePath) {
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
    
    // Try all possible paths for problems files with various naming patterns
    const possiblePaths = [
      path.join(PUBLIC_EXPLANATIONS_PATH, topicDir, 'PROBLEMS_SOLUTIONS.md'),
      path.join(EXPLANATIONS_PATH, topicDir, 'PROBLEMS_SOLUTIONS.md'),
      path.join(USER_EXPLANATIONS_PATH, topicDir, 'PROBLEMS_SOLUTIONS.md'),
      path.join(PUBLIC_EXPLANATIONS_PATH, topicDir, 'PROBLEMS_WITH_SOLUTIONS.md'),
      path.join(EXPLANATIONS_PATH, topicDir, 'PROBLEMS_WITH_SOLUTIONS.md'),
      path.join(USER_EXPLANATIONS_PATH, topicDir, 'PROBLEMS_WITH_SOLUTIONS.md')
    ];
    
    let filePath = null;
    
    // Find first existing path
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        filePath = tryPath;
        break;
      }
    }
    
    if (filePath) {
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
    const baseDirectories = [USER_EXPLANATIONS_PATH, EXPLANATIONS_PATH];
    const roadmapContent = {};
    
    for (const baseDir of baseDirectories) {
      try {
        if (fs.existsSync(baseDir)) {
          const files = fs.readdirSync(baseDir);
          const roadmapFiles = files.filter(file => 
            file.includes('ROADMAP') || 
            file.includes('ITERATION') || 
            file.includes('PROGRESS')
          );
          
          roadmapFiles.forEach(file => {
            const filePath = path.join(baseDir, file);
            if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
              roadmapContent[file] = fs.readFileSync(filePath, 'utf8');
            }
          });
          
          // If we found roadmap files in this directory, no need to check others
          if (Object.keys(roadmapContent).length > 0) {
            break;
          }
        }
      } catch (error) {
        console.error(`Error reading roadmap files from ${baseDir}:`, error);
      }
    }
    
    if (Object.keys(roadmapContent).length === 0) {
      return res.status(404).json({ error: 'No roadmap files found' });
    }
    
    res.json(roadmapContent);
  } catch (error) {
    console.error('Error reading roadmap files:', error);
    res.status(500).json({ error: 'Failed to read roadmap files' });
  }
});

// LeetCode specific API endpoints
app.get('/api/leetcode/problems/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const username = req.cookies['leetcode_username'];
    const sessionId = req.cookies['leetcode_session'];
    
    // First check cache
    const cacheKey = `problem:${slug}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('Serving cached problem data');
      return res.json(cachedData);
    }
    
    // Construct headers for authenticated or unauthenticated request
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': `https://leetcode.com/problems/${slug}/`
    };
    
    // Add auth if available
    if (sessionId) {
      const csrfToken = req.cookies['csrftoken'] || '';
      headers['Cookie'] = `LEETCODE_SESSION=${sessionId}; csrftoken=${csrfToken}`;
      if (csrfToken) {
        headers['x-csrftoken'] = csrfToken;
      }
    }
    
    // Query for problem details
    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          likes
          dislikes
          isLiked
          isPaidOnly
          status
          stats
          hints
          solution {
            id
            content
            isPaidOnly
          }
          topicTags {
            name
            slug
          }
          codeSnippets {
            lang
            langSlug
            code
          }
          exampleTestcases
        }
      }
    `;
    
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query, variables: { titleSlug: slug } },
      { headers }
    );
    
    if (response.data.errors) {
      return res.status(400).json({ 
        error: 'Failed to fetch problem', 
        details: response.data.errors 
      });
    }
    
    // Enhance with user progress if available
    if (username && response.data.data.question) {
      try {
        // Try to fetch user progress
        const userProgressQuery = `
          query userProblemProgress($username: String!, $slug: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              submissionCalendar
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `;
        
        const progressResponse = await axios.post(
          LEETCODE_GRAPHQL_URL,
          { 
            query: userProgressQuery, 
            variables: { username, slug } 
          },
          { headers }
        );
        
        if (progressResponse.data?.data?.matchedUser) {
          response.data.data.userProgress = progressResponse.data.data.matchedUser;
        }
      } catch (progressError) {
        console.warn('Failed to fetch user progress:', progressError.message);
      }
    }
    
    // Cache the response
    apiCache.set(cacheKey, response.data);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error.message);
    res.status(500).json({ error: 'Failed to fetch problem details' });
  }
});

// LeetCode submit solution endpoint
app.post('/api/leetcode/submit', async (req, res) => {
  try {
    const { slug, code, language } = req.body;
    const sessionId = req.cookies['leetcode_session'];
    const csrfToken = req.cookies['csrftoken'];
    
    // Check required session data
    if (!sessionId || !csrfToken) {
      return res.status(401).json({ 
        error: 'Authentication required for submission',
        redirectTo: '/leetcode/login' 
      });
    }
    
    // First get question ID
    const questionQuery = `
      query getQuestionID($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
        }
      }
    `;
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': `https://leetcode.com/problems/${slug}/`,
      'Cookie': `LEETCODE_SESSION=${sessionId}; csrftoken=${csrfToken}`,
      'x-csrftoken': csrfToken
    };
    
    // Get question ID
    const idResponse = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query: questionQuery, variables: { titleSlug: slug } },
      { headers }
    );
    
    if (!idResponse.data?.data?.question?.questionId) {
      return res.status(400).json({ error: 'Failed to get question ID' });
    }
    
    const questionId = idResponse.data.data.question.questionId;
    
    // Submit the solution
    const submitResponse = await axios.post(
      `${LEETCODE_API_URL}/problems/${slug}/submit/`,
      {
        question_id: questionId,
        lang: language,
        typed_code: code
      },
      { headers }
    );
    
    if (!submitResponse.data || !submitResponse.data.submission_id) {
      return res.status(400).json({ error: 'Submission failed' });
    }
    
    // Return the submission ID to check status
    res.json({
      success: true,
      submissionId: submitResponse.data.submission_id,
      message: 'Solution submitted successfully'
    });
    
  } catch (error) {
    console.error('LeetCode submission error:', error.message);
    res.status(500).json({ 
      error: 'Failed to submit solution',
      message: error.message
    });
  }
});

// Check solution submission status
app.get('/api/leetcode/submission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.cookies['leetcode_session'];
    const csrfToken = req.cookies['csrftoken'];
    
    if (!sessionId || !csrfToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com/',
      'Cookie': `LEETCODE_SESSION=${sessionId}; csrftoken=${csrfToken}`
    };
    
    const response = await axios.get(
      `${LEETCODE_API_URL}/submissions/${id}/check/`,
      { headers }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Submission check error:', error.message);
    res.status(500).json({ error: 'Failed to check submission status' });
  }
});

// Serve the explanations directory statically
app.use('/explanations', express.static(PUBLIC_EXPLANATIONS_PATH));

// Also serve the user-specified explanations directory
app.use('/user-explanations', express.static(USER_EXPLANATIONS_PATH));

// Clear cache endpoint for development/debugging
app.get('/api/clear-cache', (req, res) => {
  apiCache.flushAll();
  res.json({ message: 'Cache cleared successfully' });
});

// Endpoint to get LeetCode problems by tag
app.get('/api/leetcode/problems/bytag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    
    // First check cache
    const cacheKey = `tag_problems:${tag}_${limit}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving cached problems for tag: ${tag}`);
      return res.json(cachedData);
    }
    
    console.log(`Fetching problems for tag: ${tag}, limit: ${limit}`);
    
    // Construct headers for request
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com/problemset/'
    };
    
    // GraphQL query to get problems by tag
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              id
              slug
            }
          }
        }
      }
    `;
    
    // Variables for the GraphQL query
    const variables = {
      categorySlug: "",
      limit,
      skip: 0,
      filters: {
        tags: [tag]
      }
    };
    
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query, variables },
      { headers }
    );
    
    if (!response.data || response.data.errors) {
      console.error('LeetCode API errors:', response.data?.errors);
      return res.status(400).json({ 
        error: 'Failed to fetch problems by tag', 
        details: response.data?.errors 
      });
    }
    
    const questions = response.data.data.problemsetQuestionList.questions || [];
    
    // Map to a more convenient format
    const problems = questions.map(q => ({
      questionId: q.frontendQuestionId,
      title: q.title,
      titleSlug: q.titleSlug,
      difficulty: q.difficulty,
      isPaidOnly: q.paidOnly,
      acRate: q.acRate,
      status: q.status,
      tags: q.topicTags.map(tag => tag.name),
      topicTags: q.topicTags
    }));
    
    // Cache the response
    apiCache.set(cacheKey, problems);
    
    res.json(problems);
  } catch (error) {
    console.error(`Error fetching problems for tag ${req.params.tag}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch problems by tag',
      message: error.message
    });
  }
});

// Endpoint to get daily coding challenge
app.get('/api/leetcode/daily-challenge', async (req, res) => {
  try {
    // First check cache
    const cacheKey = `daily_challenge`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('Serving cached daily challenge');
      return res.json(cachedData);
    }
    
    const query = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          userStatus
          link
          question {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            hasVideoSolution
            hasSolution
            topicTags {
              name
              id
              slug
            }
          }
        }
      }
    `;
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com/'
    };
    
    // Add session cookie if available
    const sessionId = req.cookies['leetcode_session'];
    if (sessionId) {
      const csrfToken = req.cookies['csrftoken'] || '';
      headers['Cookie'] = `LEETCODE_SESSION=${sessionId}; csrftoken=${csrfToken}`;
    }
    
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query },
      { headers }
    );
    
    if (!response.data || response.data.errors) {
      console.error('LeetCode API errors:', response.data?.errors);
      return res.status(400).json({ 
        error: 'Failed to fetch daily challenge', 
        details: response.data?.errors 
      });
    }
    
    const dailyChallenge = response.data.data.activeDailyCodingChallengeQuestion;
    
    // Cache the response for 6 hours instead of default 5 minutes
    apiCache.set(cacheKey, dailyChallenge, 21600);
    
    res.json(dailyChallenge);
  } catch (error) {
    console.error('Error fetching daily challenge:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch daily challenge',
      message: error.message
    });
  }
});

// Endpoint to get user's solved problems
app.get('/api/leetcode/user/:username/solved', async (req, res) => {
  try {
    const { username } = req.params;
    
    // First check cache
    const cacheKey = `user_solved:${username}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving cached solved problems for user: ${username}`);
      return res.json(cachedData);
    }
    
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          problemsSolvedBeatsStats {
            difficulty
            percentage
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          solvedPerDifficultyCount: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          contributionPoint {
            points
            questionCount
            testcaseCount
          }
          profile {
            reputation
            ranking
          }
          submissionCalendar
        }
        recentSubmissionList(username: $username, limit: 20) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'DSA-Tracker-App/1.0'
    };
    
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query, variables: { username } },
      { headers }
    );
    
    if (!response.data || response.data.errors) {
      console.error('LeetCode API errors:', response.data?.errors);
      return res.status(400).json({ 
        error: 'Failed to fetch user solved problems', 
        details: response.data?.errors 
      });
    }
    
    const userData = response.data.data.matchedUser;
    const recentSubmissions = response.data.data.recentSubmissionList || [];
    
    const result = {
      totalSolved: userData.submitStats.acSubmissionNum.reduce((total, item) => total + item.count, 0),
      difficultyBreakdown: userData.submitStats.acSubmissionNum,
      recentSubmissions,
      profile: userData.profile,
      submissionCalendar: userData.submissionCalendar,
      ranking: userData.profile?.ranking
    };
    
    // Cache the response
    apiCache.set(cacheKey, result, 3600); // Cache for 1 hour
    
    res.json(result);
  } catch (error) {
    console.error(`Error fetching solved problems for user ${req.params.username}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch user solved problems',
      message: error.message
    });
  }
});

// Add diagnostic endpoint to check paths
app.get('/api/debug/paths', (req, res) => {
  try {
    const pathInfo = {
      EXPLANATIONS_PATH,
      PUBLIC_EXPLANATIONS_PATH,
      USER_EXPLANATIONS_PATH,
      ABSOLUTE_EXPLANATIONS_PATH,
      currentDir: __dirname,
      parentDir: path.join(__dirname, '..'),
      exists: {
        EXPLANATIONS_PATH: fs.existsSync(EXPLANATIONS_PATH),
        PUBLIC_EXPLANATIONS_PATH: fs.existsSync(PUBLIC_EXPLANATIONS_PATH),
        USER_EXPLANATIONS_PATH: fs.existsSync(USER_EXPLANATIONS_PATH),
        ABSOLUTE_EXPLANATIONS_PATH: fs.existsSync(ABSOLUTE_EXPLANATIONS_PATH)
      },
      directories: {}
    };
    
    // List files in each important directory
    for (const [name, dirPath] of Object.entries({
      EXPLANATIONS_PATH,
      PUBLIC_EXPLANATIONS_PATH,
      USER_EXPLANATIONS_PATH,
      ABSOLUTE_EXPLANATIONS_PATH
    })) {
      try {
        if (fs.existsSync(dirPath)) {
          pathInfo.directories[name] = fs.readdirSync(dirPath)
            .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory())
            .slice(0, 10); // Only include first 10 directories
        } else {
          pathInfo.directories[name] = 'Directory does not exist';
        }
      } catch (error) {
        pathInfo.directories[name] = `Error: ${error.message}`;
      }
    }
    
    res.json(pathInfo);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get path information',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`📚 DSA Content Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from:`);
  console.log(`   - ${PUBLIC_EXPLANATIONS_PATH} (public)`);
  console.log(`   - ${EXPLANATIONS_PATH} (project root)`);
  console.log(`   - ${USER_EXPLANATIONS_PATH} (user specified)`);
  console.log(`   - ${ABSOLUTE_EXPLANATIONS_PATH} (absolute path)`);
  console.log(`🔗 React app should connect to this server at http://localhost:5173`);
  console.log(`🔄 LeetCode API proxy available with session support`);
  console.log(`🗄️ Dynamic file browsing enabled at /api/files/`);
  console.log(`🔍 Path diagnostics available at /api/debug/paths`);
});
