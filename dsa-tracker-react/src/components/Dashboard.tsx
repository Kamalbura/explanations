import { useState, useEffect } from 'react'
import { Clock, Target, Trophy, Flame } from 'lucide-react'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { isAuthenticated, userData, isLoading, error, refreshData } = useLeetCodeAuth()
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
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

  // Use real LeetCode stats for dashboard analytics
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

  // Recent submissions from LeetCode if available
  const recentSubmissions = userData?.recentAcSubmissions || [];

  return (
    <div className="space-y-6">
      {/* LeetCode Connection Status */}
      {!isAuthenticated ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect your LeetCode account to see real progress data.
                <Link to="/leetcode/login" className="ml-2 font-medium underline">Connect now</Link>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{userData ? `, ${userData.profile.realName || userData.profile.username}` : ''}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to tackle some algorithms? You're doing great!
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-primary-200">
              {currentTime.toLocaleDateString([], { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode Progress Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          LeetCode Progress
        </h3>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            {isAuthenticated && userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <Link to="/leetcode/login" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Connect LeetCode Account
                </Link>
              </div>
            )}
            
            {/* Recent LeetCode Submissions */}
            {isAuthenticated && userData && recentSubmissions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recent Solved Problems</h4>
                <div className="space-y-2">
                  {recentSubmissions.slice(0, 5).map((sub: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <a 
                        href={`https://leetcode.com/problems/${sub.titleSlug}/`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-blue-700 dark:text-blue-300 hover:underline"
                      >
                        {sub.title}
                      </a>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(sub.timestamp)}</span>
                      <span className="text-xs font-semibold text-green-600">Solved</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{sub.lang}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Link to="/leetcode" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all activity →
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Study Iteration</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                🌳 Tree Algorithms
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Iteration 7 of 20 • 35% Complete
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                4/12
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Problems solved
              </p>
            </div>
          </div>
          
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" 
              style={{ width: '33%' }}
            ></div>
          </div>
          
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Started 2 days ago</span>
            <span className="text-gray-600 dark:text-gray-400">Est. completion: Today</span>
          </div>
        </div>
      </div>

      {/* Theory Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Theory Progress</h3>
        <div className="space-y-4">
          {/*
            { name: 'Binary Search', progress: 100, category: '03_Binary_Search' },
            { name: 'Tree Algorithms', progress: 65, category: '08_Tree_Algorithms' },
            { name: 'Graph Algorithms', progress: 40, category: '07_Graph_Algorithms' },
            { name: 'Dynamic Programming', progress: 25, category: '04_Dynamic_Programming' },
          */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
