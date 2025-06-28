/**
 * Simple proxy server for LeetCode GraphQL API requests
 * This helps bypass CORS issues when connecting to LeetCode
 */

// CommonJS version for easier compatibility
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = 3030;

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Parse JSON request bodies
app.use(express.json());

// Proxy endpoint for LeetCode API
app.post('/api/leetcode', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    console.log(`Proxying request to LeetCode API for user: ${variables?.username || 'unknown'}`);
    console.log('GraphQL Query:', query);
    console.log('Variables:', JSON.stringify(variables));
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LeetCode API responded with status: ${response.status}`);
      console.error('Response body:', errorText);
      return res.status(response.status).json({ error: `LeetCode API responded with status: ${response.status}`, details: errorText });
    }
    
    const data = await response.json();
    console.log('LeetCode API response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error proxying LeetCode API request:', error);
    res.status(500).json({ error: 'Failed to proxy request to LeetCode API', details: error.message });
  }
});

// Health check endpoint to verify the server is running
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Special endpoint to test the LeetCode API directly
app.get('/test/:username', async (req, res) => {
  const username = req.params.username;
  try {
    console.log(`Testing direct LeetCode API call for user: ${username}`);
    
    const query = `
      query getUserProfile($username: String!) { 
        matchedUser(username: $username) { 
          username 
          profile { 
            realName 
            userAvatar 
          } 
        } 
      }
    `;
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Test call failed with status: ${response.status}`);
      console.error('Response body:', errorText);
      return res.status(response.status).json({ error: `Test call failed with status: ${response.status}`, details: errorText });
    }
    
    const data = await response.json();
    console.log('Test call successful:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error in test call:', error);
    res.status(500).json({ error: 'Test call failed', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🔄 LeetCode API Proxy running on http://localhost:${PORT}`);
  console.log(`🚀 Ready to handle requests to LeetCode GraphQL API`);
  console.log(`💡 Health check available at http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint available at http://localhost:${PORT}/test/{username}`);
});
