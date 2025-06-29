import { useState, useEffect } from 'react'
import { Clock, Target, Trophy, Flame } from 'lucide-react'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'
import { Link } from 'react-router-dom'

// UI Components
import StatCard from './ui/StatCard'
import SubmissionRow from './ui/SubmissionRow'
import ProgressBar from './ui/ProgressBar'
import ConnectionStatus from './ui/ConnectionStatus'

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { isAuthenticated, userData, error, refreshData: globalRefreshData } = useLeetCodeAuth()
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Custom refresh function with local loading state
  const refreshData = async () => {
    setLocalLoading(true)
    try {
      await globalRefreshData()
    } finally {
      // Add a slight delay for better UX
      setTimeout(() => setLocalLoading(false), 300)
    }
  }

  useEffect(() => {
    if (isAuthenticated && !userData) {
      refreshData()
    }
  }, [isAuthenticated])

  function timeAgo(timestamp: number) {
    const now = Date.now() / 1000
    const diff = now - timestamp
    if (diff < 60) return `${Math.floor(diff)}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  function truncateWords(str: string, numWords: number): string {
    if (!str) return '';
    const words = str.split(' ');
    if (words.length <= numWords) return str;
    return words.slice(0, numWords).join(' ') + '...';
  }

  const stats = userData ? [
    {
      title: 'Total Solved',
      value: `${userData.progress.totalSolved} / ${userData.progress.totalQuestions}`,
      change: `Acceptance Rate: ${userData.progress.acceptanceRate?.toFixed(2)}%`,
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Easy',
      value: `${userData.progress.easySolved} / ${userData.progress.easyTotal}`,
      change: `${((userData.progress.easySolved / userData.progress.easyTotal) * 100).toFixed(1)}% complete`,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Medium',
      value: `${userData.progress.mediumSolved} / ${userData.progress.mediumTotal}`,
      change: `${((userData.progress.mediumSolved / userData.progress.mediumTotal) * 100).toFixed(1)}% complete`,
      icon: Flame,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Hard',
      value: `${userData.progress.hardSolved} / ${userData.progress.hardTotal}`,
      change: `${((userData.progress.hardSolved / userData.progress.hardTotal) * 100).toFixed(1)}% complete`,
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ] : [];

  const recentSubmissions = userData?.recentAcSubmissions || [];

  return (
    <div className="w-full relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 md:px-10 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* LeetCode Connection Status */}
        <ConnectionStatus isAuthenticated={isAuthenticated} />

        {/* Welcome Header */}
        <section className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight" title={`Welcome back${userData ? `, ${userData.profile.realName || userData.profile.username}` : ''}! 👋`}>
                Welcome back{userData ? `, ${userData.profile.realName || userData.profile.username}` : ''}! 👋
              </h1>
              <p className="text-primary-100 text-sm sm:text-base opacity-90">
                Ready to tackle some algorithms? You're doing great!
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-primary-200 text-xs sm:text-sm opacity-80">
                {currentTime.toLocaleDateString([], { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </section>

        {/* LeetCode Progress Section */}
        <section className="card py-4 sm:py-6 px-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              LeetCode Progress
            </h3>
            
            {userData && (
              <button 
                onClick={refreshData}
                disabled={localLoading}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center transition-colors"
              >
                <svg className={`w-4 h-4 mr-1 ${localLoading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {localLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
          </div>
          
          <div className="relative">
            {/* Overlay loading state */}
            {localLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center z-10 backdrop-blur-sm rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
            
            <div className={localLoading ? 'opacity-50' : ''}>
              {error ? (
                <div className="py-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  {isAuthenticated && userData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {stats.map((stat, index) => (
                        <StatCard
                          key={index}
                          title={stat.title}
                          value={stat.value}
                          change={stat.change}
                          icon={stat.icon}
                          color={stat.color}
                          bgColor={stat.bgColor}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Link 
                        to="/leetcode/login" 
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        Connect LeetCode Account
                      </Link>
                    </div>
                  )}

                  {/* Recent LeetCode Submissions */}
                  {isAuthenticated && userData && recentSubmissions.length > 0 && (
                    <section>
                      <h4 className="font-semibold mb-3">Recent Solved Problems</h4>
                      <div className="space-y-2">
                        {recentSubmissions.slice(0, 3).map((sub: any, idx: number) => (
                          <SubmissionRow
                            key={idx}
                            submission={sub}
                            timeAgo={timeAgo}
                            truncateWords={truncateWords}
                          />
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Link 
                          to="/leetcode" 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-medium"
                        >
                          View all activity →
                        </Link>
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="card py-4 sm:py-6 px-4 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4">Current Study Iteration</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1" title="🌳 Tree Algorithms">
                  🌳 Tree Algorithms
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400" title="Iteration 7 of 20 • 35% Complete">
                  Iteration 7 of 20 • 35% Complete
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  4/12
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Problems solved
                </p>
              </div>
            </div>
            
            <ProgressBar percentage={33} className="mb-4" />
            
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Started 2 days ago</span>
              <span>Est. completion: Today</span>
            </div>
          </div>
        </section>

        {/* Theory Progress */}
        <section className="card py-4 sm:py-6 px-4 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4">Theory Progress</h3>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Theory progress tracking coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard