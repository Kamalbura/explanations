import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, Target, Award, Calendar, BarChart3, Settings, BookOpen, Code, CheckCircle, Trophy } from 'lucide-react'
import { progressService, type StudyProgress, type ProgressStats } from '../services/ProgressService'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'
import ProgressManager from './ProgressManager'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState<'learning' | 'coding'>('learning')
  const [showProgressManager, setShowProgressManager] = useState(false)
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([])
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)
  
  const { isAuthenticated, userData, isLoading, error } = useLeetCodeAuth()

  // Load study progress data
  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = () => {
    const progress = progressService.getProgress()
    const stats = progressService.getStats()
    setStudyProgress(progress)
    setProgressStats(stats)
  }

  // Prepare learning progress charts data
  const prepareLearningData = () => {
    if (!progressStats) return { dailyProgress: [], categoryProgress: [], difficultyProgress: [] }

    // Get recent sessions for daily progress
    const recentSessions = progressService.getRecentActivity(7)
    const dailyProgress = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const sessionsOnDate = recentSessions.filter(s => s.date === dateStr)
      const materialsStudied = new Set(sessionsOnDate.map(s => s.materialId)).size
      const timeSpent = sessionsOnDate.reduce((total, s) => total + s.duration, 0)
      
      dailyProgress.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        materials: materialsStudied,
        timeSpent: Math.round(timeSpent)
      })
    }

    // Category progress
    const categoryProgress = Object.entries(progressStats.categoriesProgress).map(([category, data]) => ({
      category: category.replace(/^\d+_/, '').replace(/_/g, ' '),
      completed: data.completed,
      total: data.total,
      percentage: Math.round((data.completed / data.total) * 100)
    }))

    // Difficulty distribution
    const difficultyProgress = studyProgress.reduce((acc, material) => {
      const difficulty = material.difficulty
      if (!acc[difficulty]) acc[difficulty] = { completed: 0, total: 0 }
      acc[difficulty].total++
      if (material.isCompleted) acc[difficulty].completed++
      return acc
    }, {} as Record<string, { completed: number; total: number }>)

    const difficultyData = Object.entries(difficultyProgress).map(([difficulty, data]) => ({
      name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      value: Math.round((data.completed / data.total) * 100),
      completed: data.completed,
      total: data.total,
      color: difficulty === 'easy' ? '#10B981' : difficulty === 'medium' ? '#F59E0B' : '#EF4444'
    }))

    return { dailyProgress, categoryProgress, difficultyProgress: difficultyData }
  }

  const { dailyProgress, categoryProgress, difficultyProgress } = prepareLearningData()

  // Prepare coding progress data (LeetCode)
  const codingStats = userData ? [
    {
      title: 'Total Solved',
      value: `${userData.progress.totalSolved}`,
      change: `of ${userData.progress.totalQuestions}`,
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Easy Problems',
      value: `${userData.progress.easySolved}`,
      change: `${((userData.progress.easySolved / userData.progress.easyTotal) * 100).toFixed(1)}% complete`,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Medium Problems',
      value: `${userData.progress.mediumSolved}`,
      change: `${((userData.progress.mediumSolved / userData.progress.mediumTotal) * 100).toFixed(1)}% complete`,
      icon: Target,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Hard Problems',
      value: `${userData.progress.hardSolved}`,
      change: `${((userData.progress.hardSolved / userData.progress.hardTotal) * 100).toFixed(1)}% complete`,
      icon: Award,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning progress and coding achievements
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
          
          <button
            onClick={() => setShowProgressManager(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Progress</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('learning')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'learning'
              ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Learning Progress</span>
        </button>
        <button
          onClick={() => setActiveTab('coding')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'coding'
              ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Code className="w-5 h-5" />
          <span>Code Progress</span>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'learning' ? (
        <div className="space-y-6">
          {/* Learning Progress Stats */}
          {progressStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Materials Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progressStats.completedMaterials}/{progressStats.totalMaterials}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {((progressStats.completedMaterials / progressStats.totalMaterials) * 100).toFixed(1)}% complete
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Study Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(progressStats.totalTimeSpent / 60).toFixed(1)}h
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total time invested
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Study Streak
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progressStats.currentStreak}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Days in a row
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Last Study
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progressStats.lastStudyDate 
                        ? new Date(progressStats.lastStudyDate).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Latest activity
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Study Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Daily Study Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="materials" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Difficulty Distribution */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Difficulty Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={difficultyProgress}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {difficultyProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
              Category Progress
            </h3>
            <div className="space-y-4">
              {categoryProgress.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* LeetCode Connection Status */}
          {!isAuthenticated ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Connect your LeetCode account to see coding progress.
                    <a href="/leetcode/login" className="ml-2 font-medium underline">Connect now</a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Coding Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {codingStats.map((stat, index) => {
                  const Icon = stat.icon
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
                  )
                })}
              </div>

              {/* Recent LeetCode Activity */}
              {userData?.recentAcSubmissions && userData.recentAcSubmissions.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Recent Solved Problems</h3>
                  <div className="space-y-3">
                    {userData.recentAcSubmissions.slice(0, 10).map((submission: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <a 
                            href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {submission.title}
                          </a>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {submission.lang} • {new Date(submission.timestamp * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Progress Manager Modal */}
      {showProgressManager && (
        <ProgressManager
          onClose={() => setShowProgressManager(false)}
          onProgressReset={loadProgressData}
        />
      )}
    </div>
  )
}

export default Analytics
