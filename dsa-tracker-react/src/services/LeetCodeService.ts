// Service to integrate with LeetCode for progress tracking
export interface LeetCodeProblem {
  id: string
  title: string
  titleSlug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  isPaidOnly: boolean
  acRate: number
  status: 'ac' | 'notac' | null // ac = accepted, notac = not accepted, null = not attempted
  tags: string[]
  topicTags: Array<{
    name: string
    slug: string
  }>
}

export interface LeetCodeStats {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  easyTotal: number
  mediumSolved: number
  mediumTotal: number
  hardSolved: number
  hardTotal: number
  ranking: number
  acceptanceRate: number
  acSubmissionNum: Array<{
    difficulty: string
    count: number
    submissions: number
  }>
}

export interface LeetCodeSubmission {
  id: string
  title: string
  titleSlug: string
  timestamp: number
  statusDisplay: string
  lang: string
  runtime: string
  memory: string
}

export class LeetCodeService {
  // Use our backend API instead of direct LeetCode API to avoid CORS issues
  private static readonly API_BASE = '/api/leetcode'
  
  // Cache for storing fetched data to reduce API calls
  private static cache: Map<string, { data: any; timestamp: number }> = new Map()
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Get user's LeetCode profile statistics
   */
  static async getUserStats(username: string): Promise<LeetCodeStats | null> {
    const cacheKey = `stats_${username}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${this.API_BASE}/stats/${username}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const stats = await response.json()
      this.setCache(cacheKey, stats)
      return stats
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error)
      return null
    }
  }

  /**
   * Get user's recent submissions
   */
  static async getRecentSubmissions(username: string, limit: number = 20): Promise<LeetCodeSubmission[]> {
    const cacheKey = `submissions_${username}_${limit}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${this.API_BASE}/submissions/${username}?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const submissions = await response.json()
      this.setCache(cacheKey, submissions)
      return submissions
    } catch (error) {
      console.error('Error fetching recent submissions:', error)
      return []
    }
  }

  /**
   * Get problems by pattern/tag
   */
  static async getProblemsByTag(tag: string, limit: number = 50): Promise<LeetCodeProblem[]> {
    const cacheKey = `problems_${tag}_${limit}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${this.API_BASE}/problems/${tag}?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const problems = await response.json()
      this.setCache(cacheKey, problems)
      return problems
    } catch (error) {
      console.error('Error fetching problems by tag:', error)
      return []
    }
  }

  /**
   * Get daily challenge
   */
  static async getDailyChallenge(): Promise<LeetCodeProblem | null> {
    const cacheKey = 'daily_challenge'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${this.API_BASE}/daily`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const daily = await response.json()
      this.setCache(cacheKey, daily)
      return daily
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
      return null
    }
  }

  /**
   * Sync local progress with LeetCode data
   */
  static async syncProgress(username: string, localProblems: any[]): Promise<any[]> {
    try {
      const stats = await this.getUserStats(username)
      if (!stats) return localProblems

      // Get recent submissions to update status
      const recentSubmissions = await this.getRecentSubmissions(username, 100)
      const submissionMap = new Map<string, LeetCodeSubmission>()
      
      recentSubmissions.forEach(sub => {
        submissionMap.set(sub.titleSlug, sub)
      })

      // Update local problems with LeetCode data
      const updatedProblems = localProblems.map(problem => {
        const submission = submissionMap.get(problem.titleSlug || problem.title.toLowerCase().replace(/\s+/g, '-'))
        
        if (submission) {
          return {
            ...problem,
            status: submission.statusDisplay === 'Accepted' ? 'completed' : 'attempted',
            lastAttempt: new Date(submission.timestamp * 1000),
            language: submission.lang,
            runtime: submission.runtime,
            memory: submission.memory
          }
        }
        
        return problem
      })

      return updatedProblems
    } catch (error) {
      console.error('Error syncing progress:', error)
      return localProblems
    }
  }

  // Helper methods
  private static getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private static setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Clear cache (useful for forcing fresh data)
   */
  static clearCache(): void {
    this.cache.clear()
  }

  /**
   * Validate username exists on LeetCode
   */
  static async validateUsername(username: string): Promise<boolean> {
    try {
      const stats = await this.getUserStats(username)
      return stats !== null
    } catch (error) {
      console.log('Username validation info:', error)
      return false
    }
  }

  /**
   * Get user profile URL
   */
  static getUserProfileUrl(username: string): string {
    return `https://leetcode.com/u/${username}/`
  }
}
