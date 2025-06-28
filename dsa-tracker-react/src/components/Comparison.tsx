import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, Award, Clock, Users, BookOpen, Code, BarChart3, Star, UserPlus, Trophy, Zap, RefreshCw, X } from 'lucide-react'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'

interface LeetCodeSubmission {
  timestamp: number
  statusDisplay: string
  lang: string
  runtime: string
  title: string
  titleSlug: string
  isPaidOnly: boolean
}

interface LeetCodeProgress {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  easyTotal: number
  mediumSolved: number
  mediumTotal: number
  hardSolved: number
  hardTotal: number
  acceptanceRate: number
  ranking: number
}

interface RealTimeStats {
  period: 'week' | 'month' | 'quarter' | 'year'
  currentPeriod: {
    submissions: LeetCodeSubmission[]
    problemsSolved: number
    totalSubmissions: number
    acceptanceRate: number
    streakDays: number
    averageRuntime: string
    languageBreakdown: Record<string, number>
    difficultyBreakdown: { easy: number; medium: number; hard: number }
  }
  previousPeriod: {
    submissions: LeetCodeSubmission[]
    problemsSolved: number
    totalSubmissions: number
    acceptanceRate: number
    streakDays: number
    averageRuntime: string
    languageBreakdown: Record<string, number>
    difficultyBreakdown: { easy: number; medium: number; hard: number }
  }
}

interface LeetCodeFriend {
  username: string
  realName?: string
  avatar?: string
  progress: LeetCodeProgress
  recentSubmissions: LeetCodeSubmission[]
  isLoading: boolean
  error?: string
  lastFetched?: Date
}

// Real LeetCode API service - no more dummy data!
const leetcodeAPIService = {
  async fetchUserProfile(username: string): Promise<LeetCodeProgress | null> {
    try {
      // Using LeetCode's GraphQL endpoint through a CORS proxy
      const query = `
        query getUserProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              userAvatar
              realName
            }
          }
        }
      `
      
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      })

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        throw new Error('User not found or API error')
      }

      const userData = data.data.matchedUser
      const allQuestions = data.data.allQuestionsCount
      
      if (!userData) {
        throw new Error('User not found')
      }

      // Calculate acceptance rate from submission stats
      const totalAccepted = userData.submitStats.acSubmissionNum.reduce((sum: number, item: any) => sum + item.count, 0)
      const totalSubmissions = userData.submitStats.totalSubmissionNum.reduce((sum: number, item: any) => sum + item.count, 0)
      
      return {
        totalSolved: totalAccepted,
        totalQuestions: allQuestions.reduce((sum: any, item: any) => sum + item.count, 0),
        easySolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Easy')?.count || 0,
        easyTotal: allQuestions.find((item: any) => item.difficulty === 'Easy')?.count || 0,
        mediumSolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Medium')?.count || 0,
        mediumTotal: allQuestions.find((item: any) => item.difficulty === 'Medium')?.count || 0,
        hardSolved: userData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === 'Hard')?.count || 0,
        hardTotal: allQuestions.find((item: any) => item.difficulty === 'Hard')?.count || 0,
        acceptanceRate: totalSubmissions > 0 ? (totalAccepted / totalSubmissions) * 100 : 0,
        ranking: userData.profile.ranking || 0
      }
    } catch (error) {
      console.error(`Failed to fetch LeetCode data for ${username}:`, error)
      return null
    }
  },

  async fetchRecentSubmissions(username: string, limit: number = 20): Promise<LeetCodeSubmission[]> {
    try {
      const query = `
        query getRecentSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
            statusDisplay
            lang
            runtime
            url
            isPaidOnly
          }
        }
      `
      
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables: { username, limit }
        })
      })

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors || !data.data.recentAcSubmissionList) {
        return []
      }

      return data.data.recentAcSubmissionList.map((submission: any) => ({
        timestamp: parseInt(submission.timestamp),
        statusDisplay: submission.statusDisplay,
        lang: submission.lang,
        runtime: submission.runtime,
        title: submission.title,
        titleSlug: submission.titleSlug,
        isPaidOnly: submission.isPaidOnly
      }))
    } catch (error) {
      console.error(`Failed to fetch recent submissions for ${username}:`, error)
      return []
    }
  },

  // Calculate real stats from submissions within time period
  calculatePeriodStats(submissions: LeetCodeSubmission[], startDate: Date, endDate: Date): any {
    const periodSubmissions = submissions.filter(sub => {
      const subDate = new Date(sub.timestamp * 1000)
      return subDate >= startDate && subDate <= endDate
    })

    const uniqueProblems = new Set(periodSubmissions.map(sub => sub.titleSlug))
    const languageBreakdown: Record<string, number> = {}
    
    periodSubmissions.forEach(sub => {
      languageBreakdown[sub.lang] = (languageBreakdown[sub.lang] || 0) + 1
    })

    // Calculate streak days
    const submissionDates = [...new Set(periodSubmissions.map(sub => 
      new Date(sub.timestamp * 1000).toDateString()
    ))].sort()
    
    let streakDays = 0
    let currentDate = new Date()
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(currentDate)
      checkDate.setDate(checkDate.getDate() - i)
      
      if (submissionDates.includes(checkDate.toDateString())) {
        streakDays++
      } else if (streakDays > 0) {
        break
      }
    }

    return {
      submissions: periodSubmissions,
      problemsSolved: uniqueProblems.size,
      totalSubmissions: periodSubmissions.length,
      acceptanceRate: periodSubmissions.length > 0 ? 100 : 0, // All fetched submissions are accepted
      streakDays,
      languageBreakdown,
      averageRuntime: this.calculateAverageRuntime(periodSubmissions)
    }
  },

  calculateAverageRuntime(submissions: LeetCodeSubmission[]): string {
    if (submissions.length === 0) return '0ms'
    
    const runtimes = submissions
      .map(sub => parseInt(sub.runtime.replace(/[^\d]/g, '')) || 0)
      .filter(runtime => runtime > 0)
    
    if (runtimes.length === 0) return '0ms'
    
    const avgRuntime = runtimes.reduce((sum, runtime) => sum + runtime, 0) / runtimes.length
    return `${Math.round(avgRuntime)}ms`
  }
}

// Friends Comparison Sub-component with real LeetCode data
const FriendsComparison = () => {
  const [friends, setFriends] = useState<LeetCodeFriend[]>([])
  const [newUsername, setNewUsername] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userData: currentUserData, isAuthenticated } = useLeetCodeAuth()

  // Current user data from authenticated LeetCode context
  const currentUser: LeetCodeFriend | null = currentUserData ? {
    username: currentUserData.profile.username,
    realName: currentUserData.profile.realName || currentUserData.profile.username,
    avatar: currentUserData.profile.userAvatar || `https://ui-avatars.com/api/?name=${currentUserData.profile.username}&background=4f46e5`,
    progress: currentUserData.progress,
    recentSubmissions: currentUserData.recentAcSubmissions || [],
    isLoading: false,
    lastFetched: new Date()
  } : null

  const addFriend = async () => {
    if (!newUsername.trim() || friends.length >= 4) return
    
    // Add friend with loading state
    const newFriend: LeetCodeFriend = {
      username: newUsername,
      realName: newUsername,
      avatar: `https://ui-avatars.com/api/?name=${newUsername}&background=random`,
      progress: {
        totalSolved: 0,
        totalQuestions: 0,
        easySolved: 0,
        easyTotal: 0,
        mediumSolved: 0,
        mediumTotal: 0,
        hardSolved: 0,
        hardTotal: 0,
        acceptanceRate: 0,
        ranking: 0
      },
      recentSubmissions: [],
      isLoading: true
    }

    setFriends(prev => [...prev, newFriend])
    setNewUsername('')
    setIsModalOpen(false)

    // Fetch real LeetCode data
    const [progress, submissions] = await Promise.all([
      leetcodeAPIService.fetchUserProfile(newUsername),
      leetcodeAPIService.fetchRecentSubmissions(newUsername, 20)
    ])

    setFriends(prev => prev.map(f => 
      f.username === newUsername ? {
        ...f,
        progress: progress || f.progress,
        recentSubmissions: submissions,
        isLoading: false,
        error: progress ? undefined : 'Failed to fetch user data',
        lastFetched: new Date()
      } : f
    ))
  }

  const removeFriend = (username: string) => {
    setFriends(prev => prev.filter(f => f.username !== username))
  }

  const refreshFriend = async (username: string) => {
    setFriends(prev => prev.map(f => 
      f.username === username ? { ...f, isLoading: true, error: undefined } : f
    ))

    const [progress, submissions] = await Promise.all([
      leetcodeAPIService.fetchUserProfile(username),
      leetcodeAPIService.fetchRecentSubmissions(username, 20)
    ])

    setFriends(prev => prev.map(f => 
      f.username === username ? {
        ...f,
        progress: progress || f.progress,
        recentSubmissions: submissions,
        isLoading: false,
        error: progress ? undefined : 'Failed to refresh data',
        lastFetched: new Date()
      } : f
    ))
  }

  const allUsers = currentUser ? [currentUser, ...friends] : friends

  if (!isAuthenticated) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Connect LeetCode First
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your LeetCode account to compare with friends
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Friends Leaderboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time LeetCode comparison with friends
          </p>
        </div>
        
        {friends.length < 4 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </button>
        )}
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        {allUsers
          .sort((a, b) => b.progress.totalSolved - a.progress.totalSolved)
          .map((user, index) => (
            <div
              key={user.username}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                user.username === currentUser?.username
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.realName}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user.realName || user.username}
                    </h4>
                    {user.username === currentUser?.username && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                  {user.error && (
                    <p className="text-xs text-red-500 mt-1">{user.error}</p>
                  )}
                  {user.lastFetched && (
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {user.lastFetched.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total</span>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {user.isLoading ? (
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          user.progress.totalSolved
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Easy</span>
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {user.isLoading ? (
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          user.progress.easySolved
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Medium</span>
                      <div className="font-bold text-yellow-600 dark:text-yellow-400">
                        {user.isLoading ? (
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          user.progress.mediumSolved
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Hard</span>
                      <div className="font-bold text-red-600 dark:text-red-400">
                        {user.isLoading ? (
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          user.progress.hardSolved
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Acceptance</span>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {user.isLoading ? (
                          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          `${user.progress.acceptanceRate.toFixed(1)}%`
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {user.username !== currentUser?.username && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => refreshFriend(user.username)}
                      disabled={user.isLoading}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 ${user.isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => removeFriend(user.username)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove friend"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {friends.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No friends added yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add up to 4 friends to compare your real LeetCode progress
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Friend
          </button>
        </div>
      )}

      {/* Add Friend Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Friend
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter your friend's LeetCode username to fetch their real progress data.
            </p>
            
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="LeetCode username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && addFriend()}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFriend}
                disabled={!newUsername.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Comparison = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null)
  const [showFriendsComparison, setShowFriendsComparison] = useState(false)
  const { userData, isAuthenticated, isLoading, refreshData } = useLeetCodeAuth()
  const [isLoadingComparison, setIsLoadingComparison] = useState(false)

  useEffect(() => {
    if (isAuthenticated && userData) {
      loadRealTimeComparison()
    }
  }, [selectedPeriod, isAuthenticated, userData])

  const loadRealTimeComparison = async () => {
    if (!userData || !userData.recentAcSubmissions) return
    
    setIsLoadingComparison(true)
    
    try {
      // Calculate date ranges based on selected period
      const now = new Date()
      const periodDays = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      }[selectedPeriod]

      const currentPeriodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000))
      const previousPeriodStart = new Date(currentPeriodStart.getTime() - (periodDays * 24 * 60 * 60 * 1000))

      // Fetch extended submission history if needed
      const extendedSubmissions = await leetcodeAPIService.fetchRecentSubmissions(
        userData.profile.username, 
        Math.max(200, periodDays * 3) // Fetch enough data for comparison
      )

      // Calculate current period stats
      const currentStats = leetcodeAPIService.calculatePeriodStats(
        extendedSubmissions,
        currentPeriodStart,
        now
      )

      // Calculate previous period stats
      const previousStats = leetcodeAPIService.calculatePeriodStats(
        extendedSubmissions,
        previousPeriodStart,
        currentPeriodStart
      )

      const realTimeData: RealTimeStats = {
        period: selectedPeriod,
        currentPeriod: currentStats,
        previousPeriod: previousStats
      }

      setRealTimeStats(realTimeData)
    } catch (error) {
      console.error('Failed to load real-time comparison:', error)
    } finally {
      setIsLoadingComparison(false)
    }
  }

  const getPercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendColor = (change: number): string => {
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case 'week': return 'This Week vs Last Week'
      case 'month': return 'This Month vs Last Month' 
      case 'quarter': return 'This Quarter vs Last Quarter'
      case 'year': return 'This Year vs Last Year'
      default: return 'Comparison'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Connect LeetCode for Real Insights
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get real performance comparison based on your actual submissions and progress
          </p>
          <button 
            onClick={() => window.location.href = '/leetcode/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect LeetCode Account
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || isLoadingComparison || !realTimeStats) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Analyzing Real LeetCode Data...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Processing your submissions and calculating trends
          </p>
        </div>
      </div>
    )
  }

  // Real metrics based on actual LeetCode data
  const realMetrics = [
    {
      title: 'Problems Solved',
      icon: Code,
      currentValue: realTimeStats.currentPeriod.problemsSolved,
      previousValue: realTimeStats.previousPeriod.problemsSolved,
      unit: '',
      colorClass: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Submissions',
      icon: Target,
      currentValue: realTimeStats.currentPeriod.totalSubmissions,
      previousValue: realTimeStats.previousPeriod.totalSubmissions,
      unit: '',
      colorClass: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Success Rate',
      icon: Award,
      currentValue: realTimeStats.currentPeriod.acceptanceRate,
      previousValue: realTimeStats.previousPeriod.acceptanceRate,
      unit: '%',
      colorClass: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Active Days',
      icon: Clock,
      currentValue: realTimeStats.currentPeriod.streakDays,
      previousValue: realTimeStats.previousPeriod.streakDays,
      unit: 'days',
      colorClass: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Easy Problems',
      icon: BookOpen,
      currentValue: realTimeStats.currentPeriod.difficultyBreakdown?.easy || 0,
      previousValue: realTimeStats.previousPeriod.difficultyBreakdown?.easy || 0,
      unit: '',
      colorClass: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Medium Problems',
      icon: Star,
      currentValue: realTimeStats.currentPeriod.difficultyBreakdown?.medium || 0,
      previousValue: realTimeStats.previousPeriod.difficultyBreakdown?.medium || 0,
      unit: '',
      colorClass: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Hard Problems',
      icon: Trophy,
      currentValue: realTimeStats.currentPeriod.difficultyBreakdown?.hard || 0,
      previousValue: realTimeStats.previousPeriod.difficultyBreakdown?.hard || 0,
      unit: '',
      colorClass: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Languages Used',
      icon: BarChart3,
      currentValue: Object.keys(realTimeStats.currentPeriod.languageBreakdown || {}).length,
      previousValue: Object.keys(realTimeStats.previousPeriod.languageBreakdown || {}).length,
      unit: '',
      colorClass: 'text-indigo-600 dark:text-indigo-400'
    }
  ]

  const getOverallTrend = () => {
    let positive = 0, negative = 0, neutral = 0
    
    realMetrics.forEach(metric => {
      const change = getPercentageChange(metric.currentValue, metric.previousValue)
      if (change > 0) positive++
      else if (change < 0) negative++
      else neutral++
    })
    
    return { positive, negative, neutral }
  }

  const overallTrend = getOverallTrend()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Real-Time Performance Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {getPeriodLabel(selectedPeriod)} • Based on your actual LeetCode submissions
            <span className="inline-flex items-center gap-1 ml-2">
              <Zap className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">Live Data</span>
            </span>
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowFriendsComparison(!showFriendsComparison)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showFriendsComparison
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            {showFriendsComparison ? 'Hide' : 'Show'} Friends
          </button>
          
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh LeetCode data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* Friends Comparison Component */}
      {showFriendsComparison && (
        <div className="animate-in slide-in-from-top-4 duration-300">
          <FriendsComparison />
        </div>
      )}

      {/* Overall Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{overallTrend.positive}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Metrics Improved</p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-6 h-6 text-red-500 mr-2" />
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{overallTrend.negative}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Metrics Declined</p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Minus className="w-6 h-6 text-gray-500 mr-2" />
            <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">{overallTrend.neutral}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Metrics Unchanged</p>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {realMetrics.map((metric, index) => {
          const change = getPercentageChange(metric.currentValue, metric.previousValue)
          const Icon = metric.icon
          
          return (
            <div key={index} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${metric.colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {metric.title}
                    </h3>
                  </div>
                </div>
                {getTrendIcon(change)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Current</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metric.currentValue}
                    {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
                  </span>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Previous</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.previousValue}
                    {metric.unit && <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Change</span>
                    <span className={`text-sm font-medium ${getTrendColor(change)}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Language Breakdown */}
      {realTimeStats.currentPeriod.languageBreakdown && Object.keys(realTimeStats.currentPeriod.languageBreakdown).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Programming Languages Used
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(realTimeStats.currentPeriod.languageBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([lang, count]) => (
                <div key={lang} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{lang}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Activity Timeline */}
      {realTimeStats.currentPeriod.submissions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Submissions Timeline
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {realTimeStats.currentPeriod.submissions
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10)
              .map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{submission.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(submission.timestamp * 1000).toLocaleDateString()} • {submission.lang}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                      Solved
                    </span>
                    {submission.runtime && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{submission.runtime}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Real Progress Insights */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🚀 Real Progress Insights
          </h3>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400">
              Live from LeetCode API
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">💪 Strengths</h4>
            <div className="space-y-2">
              {realMetrics
                .filter(metric => getPercentageChange(metric.currentValue, metric.previousValue) > 10)
                .map((metric, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {metric.title} improved by {getPercentageChange(metric.currentValue, metric.previousValue).toFixed(1)}%
                    </span>
                  </div>
                ))}
              {realMetrics.filter(metric => getPercentageChange(metric.currentValue, metric.previousValue) > 10).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Maintaining steady performance this period.</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🎯 Focus Areas</h4>
            <div className="space-y-2">
              {realMetrics
                .filter(metric => getPercentageChange(metric.currentValue, metric.previousValue) < -5)
                .map((metric, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {metric.title} declined by {Math.abs(getPercentageChange(metric.currentValue, metric.previousValue)).toFixed(1)}%
                    </span>
                  </div>
                ))}
              {realMetrics.filter(metric => getPercentageChange(metric.currentValue, metric.previousValue) < -5).length === 0 && (
                <p className="text-green-600 dark:text-green-400 text-sm">✅ All metrics maintained or improved!</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>🔥 Real-Time Analysis:</strong> {overallTrend.positive > overallTrend.negative 
                  ? `Great momentum! You solved ${realTimeStats.currentPeriod.problemsSolved} problems this ${selectedPeriod} (${realTimeStats.currentPeriod.problemsSolved > realTimeStats.previousPeriod.problemsSolved ? 'up from' : 'compared to'} ${realTimeStats.previousPeriod.problemsSolved} last ${selectedPeriod}).`
                  : realTimeStats.currentPeriod.problemsSolved === 0
                  ? `Time to get back on track! Challenge yourself with some problems to build momentum.`
                  : `Steady progress! Focus on consistency and gradually increase your problem-solving frequency.`}
              </p>
              
              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                <span className="font-medium">Connected:</span> {userData?.profile.username} • 
                <span className="font-medium"> Total Solved:</span> {userData?.progress.totalSolved} • 
                <span className="font-medium"> Last Updated:</span> {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comparison
