/**
 * Vercel serverless function to proxy LeetCode GraphQL API requests
 * This solves CORS issues when calling LeetCode API from the browser
 */

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { query, variables } = req.body;

    if (!query) {
      res.status(400).json({ error: 'GraphQL query is required' });
      return;
    }

    console.log('Proxying LeetCode request for user:', variables?.username || 'unknown');

    // Forward the request to LeetCode's GraphQL API
    const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      console.error('LeetCode GraphQL errors:', data.errors);
      
      // Handle common errors
      if (data.errors.some((e) => e.message?.includes('not found'))) {
        res.status(404).json({
          error: `Username ${variables?.username || 'unknown'} not found on LeetCode`,
          details: 'Please check the username spelling and try again.'
        });
        return;
      }
      
      res.status(400).json({
        error: 'LeetCode API error',
        details: data.errors.map((e) => e.message).join(', ')
      });
      return;
    }

    // Return successful response
    res.status(200).json(data);

  } catch (error) {
    console.error('Error proxying LeetCode request:', error);
    
    // Handle specific error types
    if (error.message?.includes('fetch')) {
      res.status(503).json({
        error: 'Unable to connect to LeetCode API',
        details: 'LeetCode servers may be temporarily unavailable. Please try again later.'
      });
      return;
    }

    if (error.name === 'AbortError') {
      res.status(408).json({
        error: 'Request timeout',
        details: 'The request to LeetCode took too long. Please try again.'
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while fetching LeetCode data.'
    });
  }
}
