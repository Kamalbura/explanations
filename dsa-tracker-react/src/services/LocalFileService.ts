// Service to load content from your actual markdown files
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

export class LocalFileService {
  // Map your actual directory structure to match your explanations folder
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
   * Load all topic content from your local files
   */
  static async loadAllTopics(): Promise<TopicContent[]> {
    try {
      const response = await fetch('/api/topics')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.topics || []
    } catch (error) {
      console.error('Error loading topics from API:', error)
      // Fallback to static content
      return this.getFallbackTopics()
    }
  }

  /**
   * Fallback content when API is not available
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
        theoryContent: `# ${config.title}\n\n📁 **Theory File**: \`${dirName}/THEORY_COMPLETE.md\`\n\nThis content will be loaded from your local file system.\n\n## File Status\n- Directory: ✅ Found\n- Theory file: Checking...\n- Problems file: Checking...\n\n*Content loading in progress...*`,
        problemsContent: `# ${config.title} Problems\n\n📁 **Problems File**: \`${dirName}/PROBLEMS_SOLUTIONS.md\`\n\nProblem solutions will be loaded from your local files.`,
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
