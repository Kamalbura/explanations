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
  private static readonly USE_PROXY = true
  private static readonly LEETCODE_API_BASE = 'https://leetcode.com'
  private static readonly GRAPHQL_ENDPOINT = `${this.LEETCODE_API_BASE}/graphql`
  private static readonly PROXY_ENDPOINT = 'http://localhost:3001/api/leetcode/graphql'
  
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

      const data = await this.fetchFromLeetCode(query, { username })
      
      if (!data || data.errors) {
        console.error('LeetCode API errors:', data?.errors)
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

      const data = await this.fetchFromLeetCode(query, { username, limit })
      
      if (!data || data.errors) {
        console.error('LeetCode API errors:', data?.errors)
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

      const variables = {
        categorySlug: "",
        limit,
        skip: 0,
        filters: {
          tags: [tag]
        }
      }

      const data = await this.fetchFromLeetCode(query, variables)
      
      if (!data || data.errors) {
        console.error('LeetCode API errors:', data?.errors)
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
   */
  static async getUserProgress(username: string, problemSlugs: string[]): Promise<Map<string, string>> {
    const progressMap = new Map<string, string>()

    if (!username || !problemSlugs.length) {
      return progressMap
    }

    try {
      // Get recent submissions to map problem status
      const recentSubmissions = await this.getRecentSubmissions(username, 200)
      
      // Create a map of problem slug to its status
      for (const sub of recentSubmissions) {
        if (problemSlugs.includes(sub.titleSlug)) {
          progressMap.set(sub.titleSlug, sub.statusDisplay === 'Accepted' ? 'completed' : 'attempted')
        }
      }
      
      return progressMap
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return progressMap
    }
  }

  /**
   * Get all problems from LeetCode
   */
  static async getAllProblems(limit: number = 100): Promise<LeetCodeProblem[]> {
    const cacheKey = `all_problems_${limit}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
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

      const variables = {
        categorySlug: "",
        limit,
        skip: 0
      }

      const data = await this.fetchFromLeetCode(query, variables)
      
      if (!data || data.errors) {
        console.error('LeetCode API errors:', data?.errors)
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
      console.error('Error fetching all problems:', error)
      return []
    }
  }

  /**
   * Get problem details by slug
   */
  static async getProblemDetailsBySlug(titleSlug: string): Promise<any> {
    const cacheKey = `problem_detail_${titleSlug}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            codeSnippets {
              lang
              langSlug
              code
            }
            exampleTestcases
            categoryTitle
            topicTags {
              name
              slug
            }
          }
        }
      `

      const data = await this.fetchFromLeetCode(query, { titleSlug })
      
      if (!data || data.errors) {
        console.error('LeetCode API errors:', data?.errors)
        return null
      }

      this.setCache(cacheKey, data.data.question)
      return data.data.question
    } catch (error) {
      console.error('Error fetching problem details:', error)
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

  /**
   * Fetch from LeetCode with proxy support
   */
  private static async fetchFromLeetCode(query: string, variables: any): Promise<any> {
    const endpoint = this.USE_PROXY ? this.PROXY_ENDPOINT : this.GRAPHQL_ENDPOINT
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DSA-Tracker-App/1.0'
        },
        body: JSON.stringify({
          query,
          variables
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching from LeetCode:', error)
      
      // If proxy fails, try direct API as fallback (only if not already using direct)
      if (this.USE_PROXY) {
        console.log('Proxy failed, trying direct API...')
        try {
          const response = await fetch(this.GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'DSA-Tracker-App/1.0'
            },
            body: JSON.stringify({
              query,
              variables
            })
          })
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
    
          return await response.json()
        } catch (fallbackError) {
          console.error('Direct API also failed:', fallbackError)
          throw fallbackError
        }
      } else {
        throw error
      }
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
      // Try the GraphQL API directly since profile page has CORS restrictions
      const stats = await this.getUserStats(username)
      return stats !== null
    } catch (error) {
      console.log('Username validation info:', error)
      // For now, assume valid since LeetCode profile pages are protected by CORS
      // Real validation happens when we try to fetch stats
      return true
    }
  }

  /**
   * Get user profile URL
   */
  static getUserProfileUrl(username: string): string {
    return `https://leetcode.com/u/${username}/`
  }
}
