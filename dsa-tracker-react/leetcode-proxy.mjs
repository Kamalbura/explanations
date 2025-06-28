/**
 * Simple proxy server for LeetCode GraphQL API requests
 * This helps bypass CORS issues when connecting to LeetCode
 */

// Use CommonJS require for this server file
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
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
      console.error(`LeetCode API responded with status: ${response.status}`);
      return res.status(response.status).json({ error: `LeetCode API responded with status: ${response.status}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying LeetCode API request:', error);
    res.status(500).json({ error: 'Failed to proxy request to LeetCode API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🔄 LeetCode API Proxy running on http://localhost:${PORT}`);
  console.log(`🚀 Ready to handle requests to LeetCode GraphQL API`);
});
