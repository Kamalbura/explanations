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
  // Use our proxy server to avoid CORS issues
  private static readonly API_BASE = 'http://localhost:3030/api/leetcode'
  
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
      const query = `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              websites
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              postViewCountDiff
              reputation
              reputationDiff
              solutionCount
              solutionCountDiff
              categoryDiscussCount
              categoryDiscussCountDiff
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }
      `

      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.errors || !result.data?.matchedUser) {
        console.error('LeetCode API errors:', result.errors)
        return null
      }

      const userData = result.data.matchedUser
      const allQuestions = result.data.allQuestionsCount

      // Process the data into our format
      const submitStats = userData.submitStats.acSubmissionNum
      const easyStats = submitStats.find((s: any) => s.difficulty === 'Easy') || { count: 0, submissions: 0 }
      const mediumStats = submitStats.find((s: any) => s.difficulty === 'Medium') || { count: 0, submissions: 0 }
      const hardStats = submitStats.find((s: any) => s.difficulty === 'Hard') || { count: 0, submissions: 0 }

      const easyTotal = allQuestions.find((q: any) => q.difficulty === 'Easy')?.count || 0
      const mediumTotal = allQuestions.find((q: any) => q.difficulty === 'Medium')?.count || 0
      const hardTotal = allQuestions.find((q: any) => q.difficulty === 'Hard')?.count || 0

      const stats: LeetCodeStats = {
        totalSolved: easyStats.count + mediumStats.count + hardStats.count,
        totalQuestions: easyTotal + mediumTotal + hardTotal,
        easySolved: easyStats.count,
        easyTotal,
        mediumSolved: mediumStats.count,
        mediumTotal,
        hardSolved: hardStats.count,
        hardTotal,
        ranking: userData.profile.ranking || 0,
        acceptanceRate: 0, // Calculate if needed
        acSubmissionNum: submitStats
      }

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
      const query = `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `

      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username, limit }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.errors || !result.data?.recentAcSubmissionList) {
        console.error('LeetCode API errors:', result.errors)
        return []
      }

      const submissions: LeetCodeSubmission[] = result.data.recentAcSubmissionList.map((sub: any) => ({
        id: sub.id,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: parseInt(sub.timestamp),
        statusDisplay: 'Accepted',
        lang: 'Unknown', // Not available in this query
        runtime: 'Unknown',
        memory: 'Unknown'
      }))

      this.setCache(cacheKey, submissions)
      return submissions
    } catch (error) {
      console.error('Error fetching recent submissions:', error)
      return []
    }
  }

  /**
   * Get problems by pattern/tag (simplified implementation)
   */
  static async getProblemsByTag(tag: string, _limit: number = 50): Promise<LeetCodeProblem[]> {
    // This would require a more complex query, for now return empty array
    // In a real implementation, you'd need to query the problems database
    console.log(`Getting problems by tag ${tag} is not implemented yet`)
    return []
  }

  /**
   * Get daily challenge (simplified implementation)
   */
  static async getDailyChallenge(): Promise<LeetCodeProblem | null> {
    // This would require querying the daily challenge
    // For now, return null as it's not critical for basic functionality
    console.log('Daily challenge query not implemented yet')
    return null
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
      console.log('Username validation error:', error)
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
