// Service to load content directly from GitHub repository
export interface GitHubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url?: string
  url: string
}

export interface TopicContent {
  id: string
  title: string
  category: string
  theoryFile?: string
  problemsFile?: string
  theoryContent: string
  problemsContent: string
  readingTime: number
  isRead: boolean
}

export class GitHubContentService {
  // GitHub repository configuration
  private static readonly GITHUB_CONFIG = {
    owner: 'Kamalbura',
    repo: 'explanations',
    branch: 'main',
    basePath: 'dsa-tracker-react/public/explanations'
  }

  // Map your actual directory structure
  private static readonly TOPIC_MAPPING = {
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

  /**
   * Build GitHub API URL for directory contents
   */
  private static buildApiUrl(path: string = ''): string {
    const { owner, repo, basePath } = this.GITHUB_CONFIG
    const fullPath = path ? `${basePath}/${path}` : basePath
    return `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`
  }

  /**
   * Build raw GitHub URL for file content
   */
  private static buildRawUrl(path: string): string {
    const { owner, repo, branch, basePath } = this.GITHUB_CONFIG
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${basePath}/${path}`
  }

  /**
   * Fetch content from GitHub API
   */
  private static async fetchFromGitHub(url: string): Promise<any> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching from GitHub:', error)
      throw error
    }
  }

  /**
   * Fetch raw file content from GitHub
   */
  private static async fetchRawContent(path: string): Promise<string> {
    try {
      const url = this.buildRawUrl(path)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      console.error(`Error fetching raw content for ${path}:`, error)
      return `# Error Loading Content\n\nFailed to load content from: \`${path}\`\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Get list of topic directories from GitHub
   */
  static async getTopicDirectories(): Promise<GitHubFile[]> {
    try {
      const url = this.buildApiUrl()
      const contents = await this.fetchFromGitHub(url)
      
      return contents.filter((item: GitHubFile) => 
        item.type === 'dir' && /^\d+_/.test(item.name)
      )
    } catch (error) {
      console.error('Error fetching topic directories:', error)
      return []
    }
  }

  /**
   * Get files in a specific topic directory
   */
  static async getTopicFiles(topicDir: string): Promise<GitHubFile[]> {
    try {
      const url = this.buildApiUrl(topicDir)
      const contents = await this.fetchFromGitHub(url)
      
      return contents.filter((item: GitHubFile) => 
        item.type === 'file' && item.name.endsWith('.md')
      )
    } catch (error) {
      console.error(`Error fetching files for ${topicDir}:`, error)
      return []
    }
  }

  /**
   * Load all topics with their content
   */
  static async loadAllTopics(): Promise<TopicContent[]> {
    try {
      const topics: TopicContent[] = []
      
      for (const [dirName, config] of Object.entries(this.TOPIC_MAPPING)) {
        console.log(`Loading topic: ${config.title} (${dirName})`)
        
        // Try to load theory content
        let theoryContent = ''
        try {
          theoryContent = await this.fetchRawContent(`${dirName}/THEORY_COMPLETE.md`)
        } catch (error) {
          console.warn(`No theory file found for ${dirName}`)
          theoryContent = `# ${config.title}\n\n📁 Theory content not found for this topic.\n\nPath: \`${dirName}/THEORY_COMPLETE.md\``
        }

        // Try to load problems content
        let problemsContent = ''
        try {
          problemsContent = await this.fetchRawContent(`${dirName}/PROBLEMS_SOLUTIONS.md`)
        } catch (error) {
          console.warn(`No problems file found for ${dirName}`)
          problemsContent = `# ${config.title} - Problems\n\n📁 Problems content not found for this topic.\n\nPath: \`${dirName}/PROBLEMS_SOLUTIONS.md\``
        }

        // Calculate reading time based on content length
        const readingTime = Math.max(1, Math.ceil(theoryContent.length / 1000))

        topics.push({
          id: config.id,
          title: config.title,
          category: config.category,
          theoryFile: `${dirName}/THEORY_COMPLETE.md`,
          problemsFile: `${dirName}/PROBLEMS_SOLUTIONS.md`,
          theoryContent,
          problemsContent,
          readingTime,
          isRead: false
        })
      }

      console.log(`Successfully loaded ${topics.length} topics from GitHub`)
      return topics
    } catch (error) {
      console.error('Error loading topics from GitHub:', error)
      return this.getFallbackTopics()
    }
  }

  /**
   * Load content from any file path in the repository
   */
  static async loadFileContent(filePath: string): Promise<string> {
    return await this.fetchRawContent(filePath)
  }

  /**
   * Get directory structure for file explorer
   */
  static async getDirectoryStructure(path: string = ''): Promise<GitHubFile[]> {
    try {
      const url = this.buildApiUrl(path)
      const contents = await this.fetchFromGitHub(url)
      return contents
    } catch (error) {
      console.error(`Error fetching directory structure for ${path}:`, error)
      return []
    }
  }

  /**
   * Fallback content when GitHub is not available
   */
  private static getFallbackTopics(): TopicContent[] {
    const topics: TopicContent[] = []
    
    for (const [dirName, config] of Object.entries(this.TOPIC_MAPPING)) {
      topics.push({
        id: config.id,
        title: config.title,
        category: config.category,
        theoryFile: `${dirName}/THEORY_COMPLETE.md`,
        problemsFile: `${dirName}/PROBLEMS_SOLUTIONS.md`,
        theoryContent: `# ${config.title}\n\n📁 **Loading from GitHub Repository**\n\n**Repository**: [Kamalbura/explanations](https://github.com/Kamalbura/explanations)\n**Path**: \`${this.GITHUB_CONFIG.basePath}/${dirName}/THEORY_COMPLETE.md\`\n\n---\n\n## Unable to Connect to GitHub\n\nThere was an issue loading content from the GitHub repository. This could be due to:\n\n- Network connectivity issues\n- GitHub API rate limiting\n- Repository access permissions\n- File not found at the expected path\n\n### Manual Access\n\nYou can view the content directly on GitHub:\n[View ${config.title} Theory](https://github.com/${this.GITHUB_CONFIG.owner}/${this.GITHUB_CONFIG.repo}/blob/${this.GITHUB_CONFIG.branch}/${this.GITHUB_CONFIG.basePath}/${dirName}/THEORY_COMPLETE.md)\n\n### Troubleshooting\n\n1. Check your internet connection\n2. Verify the repository is accessible\n3. Ensure the file exists at the specified path\n4. Try refreshing the page\n\n*Content will load automatically once the connection is restored.*`,
        problemsContent: `# ${config.title} - Problems\n\n📁 **GitHub Repository**: [View Problems](https://github.com/${this.GITHUB_CONFIG.owner}/${this.GITHUB_CONFIG.repo}/blob/${this.GITHUB_CONFIG.branch}/${this.GITHUB_CONFIG.basePath}/${dirName}/PROBLEMS_SOLUTIONS.md)\n\nProblem solutions will be loaded from GitHub when available.`,
        readingTime: 5,
        isRead: false
      })
    }
    
    return topics
  }

  static getAvailableTopics(): Array<{id: string, title: string, category: string}> {
    return Object.values(this.TOPIC_MAPPING)
  }
}
