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
  private static readonly LEETCODE_API_BASE = 'https://leetcode.com'
  private static readonly GRAPHQL_ENDPOINT = `${this.LEETCODE_API_BASE}/graphql`
  
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
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }
      `

      const response = await fetch(this.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DSA-Tracker-App/1.0'
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        console.error('LeetCode API errors:', data.errors)
        return null
      }

      const userData = data.data.matchedUser
      const allQuestions = data.data.allQuestionsCount

      if (!userData) {
        throw new Error('User not found')
      }

      const stats: LeetCodeStats = {
        totalSolved: userData.submitStats.acSubmissionNum.reduce((sum: number, item: any) => sum + item.count, 0),
        totalQuestions: allQuestions.reduce((sum: number, item: any) => sum + item.count, 0),
        easySolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Easy')?.count || 0,
        easyTotal: allQuestions.find((item: any) => item.difficulty === 'Easy')?.count || 0,
        mediumSolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Medium')?.count || 0,
        mediumTotal: allQuestions.find((item: any) => item.difficulty === 'Medium')?.count || 0,
        hardSolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Hard')?.count || 0,
        hardTotal: allQuestions.find((item: any) => item.difficulty === 'Hard')?.count || 0,
        ranking: userData.profile?.ranking || 0,
        acceptanceRate: this.calculateAcceptanceRate(userData.submitStats.acSubmissionNum),
        acSubmissionNum: userData.submitStats.acSubmissionNum
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
        query getRecentSubmissions($username: String!, $limit: Int!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            recentSubmissionList(limit: $limit) {
              title
              titleSlug
              timestamp
              statusDisplay
              lang
              runtime
              memory
            }
          }
        }
      `

      const response = await fetch(this.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DSA-Tracker-App/1.0'
        },
        body: JSON.stringify({
          query,
          variables: { username, limit }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        console.error('LeetCode API errors:', data.errors)
        return []
      }

      const userData = data.data.matchedUser
      if (!userData || !userData.recentSubmissionList) {
        return []
      }

      const submissions: LeetCodeSubmission[] = userData.recentSubmissionList.map((sub: any, index: number) => ({
        id: `${sub.titleSlug}_${sub.timestamp}_${index}`,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: parseInt(sub.timestamp),
        statusDisplay: sub.statusDisplay,
        lang: sub.lang,
        runtime: sub.runtime,
        memory: sub.memory
      }))

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
      `

      const response = await fetch(this.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DSA-Tracker-App/1.0'
        },
        body: JSON.stringify({
          query,
          variables: {
            categorySlug: "",
            limit,
            skip: 0,
            filters: {
              tags: [tag]
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        console.error('LeetCode API errors:', data.errors)
        return []
      }

      const questions = data.data.problemsetQuestionList.questions || []
      
      const problems: LeetCodeProblem[] = questions.map((q: any) => ({
        id: q.frontendQuestionId,
        title: q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty,
        isPaidOnly: q.paidOnly,
        acRate: q.acRate,
        status: q.status,
        tags: q.topicTags.map((tag: any) => tag.name),
        topicTags: q.topicTags
      }))

      this.setCache(cacheKey, problems)
      return problems
    } catch (error) {
      console.error('Error fetching problems by tag:', error)
      return []
    }
  }

  /**
   * Get user's progress on specific problems
   * Note: LeetCode's public API doesn't provide individual problem status
   * This would require authentication to get detailed progress
   */
  static async getUserProgress(_username: string, _problemSlugs: string[]): Promise<Map<string, string>> {
    const progressMap = new Map<string, string>()

    try {
      // Note: LeetCode's public API doesn't provide individual problem status
      // This is a limitation - you'd need to be logged in to get this data
      // For now, we'll return empty progress and suggest using LeetCode's public profile data
      
      return progressMap
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return progressMap
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
  private static calculateAcceptanceRate(submissions: any[]): number {
    const totalAccepted = submissions.reduce((sum, item) => sum + item.count, 0)
    const totalSubmissions = submissions.reduce((sum, item) => sum + item.submissions, 0)
    return totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0
  }

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
      return false
    }
  }
}
