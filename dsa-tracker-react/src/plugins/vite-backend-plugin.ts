import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface BackendConfig {
  port: number
  explanationsPath: string
}

export function viteBackendPlugin(config: BackendConfig): Plugin {
  return {
    name: 'vite-backend-plugin',
    configureServer(server) {
      // Add API routes to the Vite dev server
      server.middlewares.use('/api', async (req, res, next) => {
        const url = req.url || ''
        const method = req.method || 'GET'
        
        try {
          // Handle CORS
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          
          if (method === 'OPTIONS') {
            res.statusCode = 200
            res.end()
            return
          }

          // Route handlers
          if (url.startsWith('/topics')) {
            await handleTopicsAPI(req, res, config.explanationsPath)
          } else if (url.startsWith('/files/')) {
            await handleFilesAPI(req, res, config.explanationsPath)
          } else if (url.startsWith('/content/')) {
            await handleContentAPI(req, res, config.explanationsPath)
          } else if (url.startsWith('/leetcode')) {
            await handleLeetCodeAPI(req, res)
          } else if (url.startsWith('/test/')) {
            await handleLeetCodeTest(req, res)
          } else if (url === '/health') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
          } else if (url.startsWith('/debug/paths')) {
            await handleDebugPaths(req, res, config.explanationsPath)
          } else if (url === '/debug/paths') {
            await handleDebugPaths(req, res, config.explanationsPath)
          } else {
            next()
          }
        } catch (error) {
          console.error('API Error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
    }
  }
}

// API Handlers
async function handleTopicsAPI(_req: any, res: any, explanationsPath: string) {
  try {
    const topics: any[] = []
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'explanations'),
      explanationsPath,
      path.join(explanationsPath, '../'),
      path.join(process.cwd(), '../')
    ]

    // Define topic mapping to match LocalFileService
    const TOPIC_MAPPING: { [key: string]: any } = {
      '01_Two_Pointers': {
        id: 'two-pointers',
        title: 'Two Pointers',
        category: 'Arrays & Pointers'
      },
      '02_Sliding_Window': {
        id: 'sliding-window',
        title: 'Sliding Window',
        category: 'Arrays & Pointers'
      },
      '03_Binary_Search': {
        id: 'binary-search',
        title: 'Binary Search',
        category: 'Searching'
      },
      '04_Dynamic_Programming': {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        category: 'Dynamic Programming'
      },
      '05_Greedy_Algorithms': {
        id: 'greedy',
        title: 'Greedy Algorithms',
        category: 'Greedy'
      },
      '06_Backtracking': {
        id: 'backtracking',
        title: 'Backtracking',
        category: 'Recursion & Backtracking'
      },
      '07_Graph_Algorithms': {
        id: 'graph-algorithms',
        title: 'Graph Algorithms',
        category: 'Graphs'
      },
      '08_Tree_Algorithms': {
        id: 'tree-algorithms',
        title: 'Tree Algorithms',
        category: 'Trees'
      },
      '09_Stack_Queue': {
        id: 'stack-queue',
        title: 'Stack & Queue',
        category: 'Stack & Queue'
      },
      '10_Heap_Priority_Queue': {
        id: 'heap',
        title: 'Heap & Priority Queue',
        category: 'Heap'
      }
    }

    for (const basePath of possiblePaths) {
      try {
        if (fs.existsSync(basePath)) {
          console.log(`Checking path: ${basePath}`)
          const directories = fs.readdirSync(basePath)
          
          directories.forEach(dir => {
            if (dir.match(/^\d+_/) && TOPIC_MAPPING[dir]) {
              const dirPath = path.join(basePath, dir)
              if (fs.statSync(dirPath).isDirectory()) {
                const files = fs.readdirSync(dirPath)
                
                // Read theory content
                let theoryContent = ''
                let problemsContent = ''
                
                const theoryFiles = files.filter(f => f.includes('THEORY') && f.endsWith('.md'))
                const problemFiles = files.filter(f => (f.includes('PROBLEMS') || f.includes('SOLUTIONS')) && f.endsWith('.md'))
                
                if (theoryFiles.length > 0) {
                  try {
                    theoryContent = fs.readFileSync(path.join(dirPath, theoryFiles[0]), 'utf8')
                  } catch (error) {
                    theoryContent = `# ${TOPIC_MAPPING[dir].title}\n\nTheory content will be loaded from your local files.`
                  }
                }
                
                if (problemFiles.length > 0) {
                  try {
                    problemsContent = fs.readFileSync(path.join(dirPath, problemFiles[0]), 'utf8')
                  } catch (error) {
                    problemsContent = `# ${TOPIC_MAPPING[dir].title} Problems\n\nProblem solutions will be loaded from your local files.`
                  }
                }
                
                const topicInfo = {
                  id: TOPIC_MAPPING[dir].id,
                  title: TOPIC_MAPPING[dir].title,
                  category: TOPIC_MAPPING[dir].category,
                  theoryFile: theoryFiles[0] ? `${dir}/${theoryFiles[0]}` : null,
                  problemsFile: problemFiles[0] ? `${dir}/${problemFiles[0]}` : null,
                  theoryContent,
                  problemsContent,
                  readingTime: Math.max(Math.ceil(theoryContent.length / 1000), 5),
                  isRead: false,
                  hasTheory: theoryFiles.length > 0,
                  hasProblems: problemFiles.length > 0,
                  directory: dir,
                  path: dirPath,
                  files: files.filter(file => file.endsWith('.md'))
                }
                
                topics.push(topicInfo)
              }
            }
          })
          
          if (topics.length > 0) {
            console.log(`Found ${topics.length} topics in ${basePath}`)
            break
          }
        }
      } catch (dirError) {
        console.error(`Error reading directory ${basePath}:`, dirError)
      }
    }

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ topics }))
  } catch (error) {
    console.error('Error in handleTopicsAPI:', error)
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Failed to read topics' }))
  }
}

async function handleFilesAPI(req: any, res: any, explanationsPath: string) {
  try {
    const urlPath = req.url.replace('/files/', '')
    const requestPath = decodeURIComponent(urlPath)
    
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'explanations', requestPath),
      path.join(explanationsPath, requestPath),
      path.join(explanationsPath, '../', requestPath),
      path.join(process.cwd(), '../', requestPath)
    ]

    let dirPath = null
    let files = null

    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath) && fs.statSync(tryPath).isDirectory()) {
        dirPath = tryPath
        files = fs.readdirSync(tryPath)
        break
      }
    }

    if (!files) {
      res.statusCode = 404
      res.end(JSON.stringify({ error: 'Directory not found' }))
      return
    }

    const fileList = files.map(file => {
      const fullPath = path.join(dirPath!, file)
      try {
        const stats = fs.statSync(fullPath)
        return {
          name: file,
          path: path.join(requestPath, file),
          isDirectory: stats.isDirectory(),
          size: stats.size,
          lastModified: stats.mtime,
          extension: stats.isDirectory() ? null : path.extname(file).substr(1)
        }
      } catch (error) {
        return null
      }
    }).filter(Boolean)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      path: requestPath,
      absolutePath: dirPath,
      files: fileList
    }))
  } catch (error) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Failed to list directory contents' }))
  }
}

async function handleContentAPI(req: any, res: any, explanationsPath: string) {
  try {
    const urlPath = req.url.replace('/content/', '')
    const requestPath = decodeURIComponent(urlPath)
    
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'explanations', requestPath),
      path.join(explanationsPath, requestPath),
      path.join(explanationsPath, '../', requestPath),
      path.join(process.cwd(), '../', requestPath)
    ]

    let filePath = null

    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) {
        filePath = tryPath
        break
      }
    }

    if (!filePath) {
      res.statusCode = 404
      res.end(JSON.stringify({ error: 'File not found' }))
      return
    }

    const content = fs.readFileSync(filePath, 'utf8')
    const stats = fs.statSync(filePath)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      path: requestPath,
      absolutePath: filePath,
      content: content,
      size: stats.size,
      lastModified: stats.mtime,
      extension: path.extname(filePath).substr(1)
    }))
  } catch (error) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Failed to read file' }))
  }
}

// LeetCode API handler with proper CORS and fetch
async function handleLeetCodeAPI(req: any, res: any) {
  try {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', 
      process.env.NODE_ENV === 'production' ? req.headers.origin || '*' : 'http://localhost:5173'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    
    if (req.method === 'OPTIONS') {
      res.statusCode = 200
      res.end()
      return
    }

    // Parse request body for POST requests
    let body = ''
    if (req.method === 'POST') {
      for await (const chunk of req) {
        body += chunk.toString()
      }
    }

    const { query, variables } = body ? JSON.parse(body) : {}
    
    console.log(`Proxying request to LeetCode API for user: ${variables?.username || 'unknown'}`)
    
    // Import fetch dynamically (since it's a CommonJS module)
    const fetch = (await import('node-fetch')).default
    
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
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`LeetCode API responded with status: ${response.status}`)
      console.error('Response body:', errorText)
      res.statusCode = response.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ 
        error: `LeetCode API responded with status: ${response.status}`, 
        details: errorText 
      }))
      return
    }
    
    const data = await response.json()
    console.log('LeetCode API response received successfully')
    
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  } catch (error) {
    console.error('Error proxying LeetCode API request:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ 
      error: 'Failed to proxy request to LeetCode API', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }))
  }
}

// LeetCode test endpoint handler
async function handleLeetCodeTest(req: any, res: any) {
  try {
    res.setHeader('Access-Control-Allow-Origin', 
      process.env.NODE_ENV === 'production' ? req.headers.origin || '*' : 'http://localhost:5173'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (req.method === 'OPTIONS') {
      res.statusCode = 200
      res.end()
      return
    }

    const url = new URL(req.url, 'http://localhost:5173')
    const username = url.pathname.split('/').pop()
    
    if (!username) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Username is required' }))
      return
    }

    console.log(`Testing direct LeetCode API call for user: ${username}`)
    
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
    `
    
    const fetch = (await import('node-fetch')).default
    
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
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Test call failed with status: ${response.status}`)
      res.statusCode = response.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ 
        error: `Test call failed with status: ${response.status}`, 
        details: errorText 
      }))
      return
    }
    
    const data = await response.json()
    console.log('Test call successful')
    
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  } catch (error) {
    console.error('Error in test call:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ 
      error: 'Test call failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }))
  }
}

async function handleDebugPaths(_req: any, res: any, explanationsPath: string) {
  const pathInfo = {
    explanationsPath,
    currentDir: process.cwd(),
    parentDir: path.join(process.cwd(), '..'),
    exists: {
      explanationsPath: fs.existsSync(explanationsPath),
      parentDir: fs.existsSync(path.join(process.cwd(), '..')),
    },
    directories: {} as any
  }
  
  const pathsToCheck = [
    explanationsPath,
    path.join(process.cwd(), '..'),
  ]
  
  for (const [index, dirPath] of pathsToCheck.entries()) {
    try {
      if (fs.existsSync(dirPath)) {
        pathInfo.directories[`path_${index}`] = fs.readdirSync(dirPath)
          .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory())
          .slice(0, 10)
      }
    } catch (error) {
      pathInfo.directories[`path_${index}`] = `Error: ${(error as Error).message}`
    }
  }
  
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(pathInfo))
}
