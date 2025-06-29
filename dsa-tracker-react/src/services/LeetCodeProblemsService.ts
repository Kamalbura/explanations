// LeetCode Problems Service
// This service handles fetching and organizing LeetCode problems by categories/tags

export interface LeetCodeProblem {
  id: string
  title: string
  titleSlug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topicTags: Array<{
    name: string
    slug: string
  }>
  status: 'NotStarted' | 'Solved' | 'Attempted'
  acRate: number
  questionFrontendId: string
  isPaidOnly: boolean
  url: string
}

export interface ProblemCategory {
  name: string
  slug: string
  count: number
  problems: LeetCodeProblem[]
}

class LeetCodeProblemsService {
  private static instance: LeetCodeProblemsService
  private cache: Map<string, LeetCodeProblem[]> = new Map()
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

  public static getInstance(): LeetCodeProblemsService {
    if (!LeetCodeProblemsService.instance) {
      LeetCodeProblemsService.instance = new LeetCodeProblemsService()
    }
    return LeetCodeProblemsService.instance
  }

  // Popular DSA categories and their corresponding LeetCode tags
  private readonly DSA_CATEGORIES = {
    'Array': ['array'],
    'String': ['string'],
    'Linked List': ['linked-list'],
    'Stack': ['stack'],
    'Queue': ['queue'],
    'Tree': ['tree', 'binary-tree'],
    'Binary Search Tree': ['binary-search-tree'],
    'Heap': ['heap-priority-queue'],
    'Hash Table': ['hash-table'],
    'Binary Search': ['binary-search'],
    'Two Pointers': ['two-pointers'],
    'Sliding Window': ['sliding-window'],
    'Dynamic Programming': ['dynamic-programming'],
    'Greedy': ['greedy'],
    'Backtracking': ['backtracking'],
    'Graph': ['graph'],
    'Depth-First Search': ['depth-first-search'],
    'Breadth-First Search': ['breadth-first-search'],
    'Union Find': ['union-find'],
    'Trie': ['trie'],
    'Design': ['design'],
    'Math': ['math'],
    'Bit Manipulation': ['bit-manipulation'],
    'Recursion': ['recursion'],
    'Divide and Conquer': ['divide-and-conquer'],
    'Sorting': ['sorting'],
    'Matrix': ['matrix']
  }

  // Simulated LeetCode API call (In production, you'd use actual LeetCode API or GraphQL)
  async fetchProblems(category?: string, limit: number = 50): Promise<LeetCodeProblem[]> {
    const cacheKey = category || 'all'
    const now = Date.now()

    // Return cached data if still valid
    if (this.cache.has(cacheKey) && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache.get(cacheKey) || []
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate mock problems based on real LeetCode data structure
      const problems = this.generateMockProblems(category, limit)
      
      this.cache.set(cacheKey, problems)
      this.lastFetch = now

      return problems
    } catch (error) {
      console.error('Error fetching LeetCode problems:', error)
      return []
    }
  }

  async fetchProblemsByTag(tag: string, limit: number = 30): Promise<LeetCodeProblem[]> {
    return this.fetchProblems(tag, limit)
  }

  async getAllCategories(): Promise<ProblemCategory[]> {
    const categories: ProblemCategory[] = []

    for (const [categoryName, _tags] of Object.entries(this.DSA_CATEGORIES)) {
      const problems = await this.fetchProblems(categoryName.toLowerCase(), 20)
      categories.push({
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
        count: problems.length,
        problems
      })
    }

    return categories
  }

  // Generate realistic mock data based on actual LeetCode problems
  private generateMockProblems(category?: string, limit: number = 50): LeetCodeProblem[] {
    const problemTemplates = [
      // Array Problems
      { title: 'Two Sum', difficulty: 'Easy' as const, tags: ['array', 'hash-table'], acRate: 49.1, isPaidOnly: false },
      { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' as const, tags: ['array', 'dynamic-programming'], acRate: 54.2, isPaidOnly: false },
      { title: 'Contains Duplicate', difficulty: 'Easy' as const, tags: ['array', 'hash-table', 'sorting'], acRate: 60.8, isPaidOnly: false },
      { title: 'Product of Array Except Self', difficulty: 'Medium' as const, tags: ['array', 'prefix-sum'], acRate: 64.9, isPaidOnly: false },
      { title: 'Maximum Subarray', difficulty: 'Medium' as const, tags: ['array', 'dynamic-programming'], acRate: 50.1, isPaidOnly: false },
      { title: '3Sum', difficulty: 'Medium' as const, tags: ['array', 'two-pointers', 'sorting'], acRate: 32.6, isPaidOnly: false },
      { title: 'Container With Most Water', difficulty: 'Medium' as const, tags: ['array', 'two-pointers', 'greedy'], acRate: 54.6, isPaidOnly: false },

      // String Problems
      { title: 'Valid Anagram', difficulty: 'Easy' as const, tags: ['string', 'hash-table', 'sorting'], acRate: 63.2, isPaidOnly: false },
      { title: 'Valid Parentheses', difficulty: 'Easy' as const, tags: ['string', 'stack'], acRate: 40.7, isPaidOnly: false },
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' as const, tags: ['string', 'hash-table', 'sliding-window'], acRate: 33.8, isPaidOnly: false },
      { title: 'Longest Palindromic Substring', difficulty: 'Medium' as const, tags: ['string', 'dynamic-programming'], acRate: 32.7, isPaidOnly: false },
      { title: 'Group Anagrams', difficulty: 'Medium' as const, tags: ['string', 'hash-table', 'sorting'], acRate: 67.3, isPaidOnly: false },

      // Tree Problems
      { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy' as const, tags: ['tree', 'depth-first-search', 'breadth-first-search'], acRate: 73.8, isPaidOnly: false },
      { title: 'Same Tree', difficulty: 'Easy' as const, tags: ['tree', 'depth-first-search', 'breadth-first-search'], acRate: 57.5, isPaidOnly: false },
      { title: 'Invert Binary Tree', difficulty: 'Easy' as const, tags: ['tree', 'depth-first-search', 'breadth-first-search'], acRate: 74.9, isPaidOnly: false },
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium' as const, tags: ['tree', 'breadth-first-search'], acRate: 64.3, isPaidOnly: false },
      { title: 'Validate Binary Search Tree', difficulty: 'Medium' as const, tags: ['tree', 'depth-first-search', 'binary-search-tree'], acRate: 31.5, isPaidOnly: false },
      { title: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Medium' as const, tags: ['tree', 'depth-first-search', 'binary-search-tree'], acRate: 59.7, isPaidOnly: false },

      // Graph Problems
      { title: 'Number of Islands', difficulty: 'Medium' as const, tags: ['graph', 'depth-first-search', 'breadth-first-search'], acRate: 57.1, isPaidOnly: false },
      { title: 'Clone Graph', difficulty: 'Medium' as const, tags: ['graph', 'depth-first-search', 'breadth-first-search'], acRate: 50.8, isPaidOnly: false },
      { title: 'Course Schedule', difficulty: 'Medium' as const, tags: ['graph', 'depth-first-search', 'breadth-first-search', 'topological-sort'], acRate: 46.5, isPaidOnly: false },

      // Dynamic Programming
      { title: 'Climbing Stairs', difficulty: 'Easy' as const, tags: ['dynamic-programming', 'math', 'memoization'], acRate: 51.5, isPaidOnly: false },
      { title: 'House Robber', difficulty: 'Medium' as const, tags: ['dynamic-programming', 'array'], acRate: 49.0, isPaidOnly: false },
      { title: 'Coin Change', difficulty: 'Medium' as const, tags: ['dynamic-programming', 'breadth-first-search'], acRate: 40.9, isPaidOnly: false },

      // Linked List
      { title: 'Reverse Linked List', difficulty: 'Easy' as const, tags: ['linked-list', 'recursion'], acRate: 72.7, isPaidOnly: false },
      { title: 'Merge Two Sorted Lists', difficulty: 'Easy' as const, tags: ['linked-list', 'recursion'], acRate: 62.4, isPaidOnly: false },
      { title: 'Linked List Cycle', difficulty: 'Easy' as const, tags: ['linked-list', 'hash-table', 'two-pointers'], acRate: 48.9, isPaidOnly: false },
      { title: 'Remove Nth Node From End of List', difficulty: 'Medium' as const, tags: ['linked-list', 'two-pointers'], acRate: 39.8, isPaidOnly: false },

      // Binary Search
      { title: 'Binary Search', difficulty: 'Easy' as const, tags: ['binary-search', 'array'], acRate: 56.3, isPaidOnly: false },
      { title: 'Search in Rotated Sorted Array', difficulty: 'Medium' as const, tags: ['binary-search', 'array'], acRate: 38.7, isPaidOnly: false },
      { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' as const, tags: ['binary-search', 'array'], acRate: 48.8, isPaidOnly: false },

      // Stack & Queue
      { title: 'Implement Queue using Stacks', difficulty: 'Easy' as const, tags: ['stack', 'queue', 'design'], acRate: 63.7, isPaidOnly: false },
      { title: 'Min Stack', difficulty: 'Medium' as const, tags: ['stack', 'design'], acRate: 51.6, isPaidOnly: false },

      // Heap
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium' as const, tags: ['heap-priority-queue', 'divide-and-conquer', 'sorting'], acRate: 66.3, isPaidOnly: false },
      { title: 'Top K Frequent Elements', difficulty: 'Medium' as const, tags: ['heap-priority-queue', 'hash-table', 'sorting'], acRate: 63.8, isPaidOnly: false }
    ]

    // Filter by category if specified
    let filteredTemplates = problemTemplates
    if (category && category !== 'all') {
      const categoryTags = this.DSA_CATEGORIES[category as keyof typeof this.DSA_CATEGORIES] || [category.toLowerCase()]
      filteredTemplates = problemTemplates.filter(template => 
        template.tags.some(tag => categoryTags.includes(tag))
      )
    }

    // Generate problems from templates
    const problems: LeetCodeProblem[] = filteredTemplates.slice(0, limit).map((template, index) => {
      const id = (index + 1).toString()
      const titleSlug = template.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      return {
        id,
        title: template.title,
        titleSlug,
        difficulty: template.difficulty,
        topicTags: template.tags.map(tag => ({
          name: tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          slug: tag
        })),
        status: this.getRandomStatus(),
        acRate: template.acRate,
        questionFrontendId: id,
        isPaidOnly: template.isPaidOnly,
        url: `https://leetcode.com/problems/${titleSlug}/`
      }
    })

    return problems
  }

  private getRandomStatus(): 'NotStarted' | 'Solved' | 'Attempted' {
    const rand = Math.random()
    if (rand < 0.3) return 'Solved'
    if (rand < 0.5) return 'Attempted'
    return 'NotStarted'
  }

  // Get user's solved problems (simulated)
  async getUserSolvedProblems(_username: string): Promise<string[]> {
    // In production, this would fetch from LeetCode API
    // For now, return random solved problems
    const allProblems = await this.fetchProblems('all', 100)
    const solvedCount = Math.floor(allProblems.length * 0.3) // 30% solved
    
    return allProblems
      .filter(() => Math.random() < 0.3)
      .slice(0, solvedCount)
      .map(p => p.titleSlug)
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }
}

export const leetCodeProblemsService = LeetCodeProblemsService.getInstance()
