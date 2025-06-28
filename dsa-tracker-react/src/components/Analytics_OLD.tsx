import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Clock, Target, Award, BarChart3, BookOpen, Code, CheckCircle } from 'lucide-react'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'

interface StudyMaterial {
  id: string
  name: string
  category: string
  isCompleted: boolean
  completedAt?: Date
  timeSpent: number // in minutes
  path: string
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState<'learning' | 'coding'>('learning')
  const { isAuthenticated, userData } = useLeetCodeAuth()
  
  // Mock study materials data (this should come from your actual data)
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([
    { id: '1', name: 'Two Pointers Theory', category: '01_Two_Pointers', isCompleted: true, completedAt: new Date('2025-06-20'), timeSpent: 45, path: '01_Two_Pointers/THEORY_COMPLETE.md' },
    { id: '2', name: 'Two Pointers Problems', category: '01_Two_Pointers', isCompleted: true, completedAt: new Date('2025-06-21'), timeSpent: 120, path: '01_Two_Pointers/PROBLEMS_SOLUTIONS.md' },
    { id: '3', name: 'Sliding Window Theory', category: '02_Sliding_Window', isCompleted: true, completedAt: new Date('2025-06-22'), timeSpent: 60, path: '02_Sliding_Window/THEORY_COMPLETE.md' },
    { id: '4', name: 'Binary Search Theory', category: '03_Binary_Search', isCompleted: true, completedAt: new Date('2025-06-23'), timeSpent: 75, path: '03_Binary_Search/THEORY_COMPLETE.md' },
    { id: '5', name: 'Binary Search Problems', category: '03_Binary_Search', isCompleted: true, completedAt: new Date('2025-06-24'), timeSpent: 180, path: '03_Binary_Search/PROBLEMS_SOLUTIONS.md' },
    { id: '6', name: 'Tree Algorithms Theory', category: '08_Tree_Algorithms', isCompleted: true, completedAt: new Date('2025-06-25'), timeSpent: 90, path: '08_Tree_Algorithms/THEORY_COMPLETE.md' },
    { id: '7', name: 'Tree Algorithms Problems', category: '08_Tree_Algorithms', isCompleted: false, timeSpent: 45, path: '08_Tree_Algorithms/PROBLEMS_SOLUTIONS.md' },
    { id: '8', name: 'Graph Algorithms Theory', category: '07_Graph_Algorithms', isCompleted: false, timeSpent: 0, path: '07_Graph_Algorithms/THEORY_COMPLETE.md' },
    { id: '9', name: 'Dynamic Programming Theory', category: '04_Dynamic_Programming', isCompleted: false, timeSpent: 0, path: '04_Dynamic_Programming/THEORY_COMPLETE.md' },
    { id: '10', name: 'Stack & Queue Theory', category: '09_Stack_Queue', isCompleted: true, completedAt: new Date('2025-06-26'), timeSpent: 85, path: '09_Stack_Queue/THEORY_COMPLETE.md' },
  ])

  // Calculate learning progress statistics
  const completedMaterials = studyMaterials.filter(m => m.isCompleted)
  const totalTimeSpent = studyMaterials.reduce((acc, m) => acc + m.timeSpent, 0)
  const averageTimePerMaterial = totalTimeSpent / studyMaterials.length
  const completionRate = (completedMaterials.length / studyMaterials.length) * 100

  // Daily study progress for the chart
  const dailyStudyProgress = [
    { date: 'Mon', materialsRead: 2, timeSpent: 165 },
    { date: 'Tue', materialsRead: 1, timeSpent: 120 },
    { date: 'Wed', materialsRead: 3, timeSpent: 210 },
    { date: 'Thu', materialsRead: 2, timeSpent: 180 },
    { date: 'Fri', materialsRead: 1, timeSpent: 90 },
    { date: 'Sat', materialsRead: 0, timeSpent: 0 },
    { date: 'Sun', materialsRead: 1, timeSpent: 85 },
  ]

  // Category completion distribution
  const categoryProgress = [
    { category: 'Two Pointers', completed: 2, total: 2, percentage: 100 },
    { category: 'Sliding Window', completed: 1, total: 1, percentage: 100 },
    { category: 'Binary Search', completed: 2, total: 2, percentage: 100 },
    { category: 'Tree Algorithms', completed: 1, total: 2, percentage: 50 },
    { category: 'Graph Algorithms', completed: 0, total: 2, percentage: 0 },
    { category: 'Dynamic Programming', completed: 0, total: 1, percentage: 0 },
    { category: 'Stack & Queue', completed: 1, total: 1, percentage: 100 },
  ]

  // LeetCode stats (if available)
  const leetcodeStats = userData ? [
    {
      title: 'Total Solved',
      value: `${userData.progress.totalSolved}`,
      change: `${userData.progress.acceptanceRate?.toFixed(1)}% acceptance rate`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Easy Problems',
      value: `${userData.progress.easySolved}/${userData.progress.easyTotal}`,
      change: `${((userData.progress.easySolved / userData.progress.easyTotal) * 100).toFixed(1)}% complete`,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Medium Problems',
      value: `${userData.progress.mediumSolved}/${userData.progress.mediumTotal}`,
      change: `${((userData.progress.mediumSolved / userData.progress.mediumTotal) * 100).toFixed(1)}% complete`,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Hard Problems',
      value: `${userData.progress.hardSolved}/${userData.progress.hardTotal}`,
      change: `${((userData.progress.hardSolved / userData.progress.hardTotal) * 100).toFixed(1)}% complete`,
      icon: Award,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ] : []

  // Learning progress stats
  const learningStats = [
    {
      title: 'Materials Completed',
      value: `${completedMaterials.length}/${studyMaterials.length}`,
      change: `${completionRate.toFixed(1)}% completion rate`,
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Study Time',
      value: `${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`,
      change: `${averageTimePerMaterial.toFixed(0)}m avg per material`,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Study Streak',
      value: '7 days',
      change: 'Personal best!',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'This Week',
      value: `${dailyStudyProgress.reduce((acc, day) => acc + day.materialsRead, 0)} materials`,
      change: `${dailyStudyProgress.reduce((acc, day) => acc + day.timeSpent, 0)}m total time`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  const markMaterialAsCompleted = (materialId: string) => {
    setStudyMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { ...material, isCompleted: true, completedAt: new Date() }
        : material
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning journey and coding progress
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          {/* Tab Selection */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'learning'
                  ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learning Progress</span>
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'coding'
                  ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code Progress</span>
            </button>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Learning Progress Tab */}
      {activeTab === 'learning' && (
        <>
          {/* Learning Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningStats.map((stat, index) => {
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Study Progress Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Daily Study Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStudyProgress}>
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
                  <Bar dataKey="materialsRead" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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

          {/* Study Materials Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-500" />
              Study Materials Progress
            </h3>
            <div className="space-y-3">
              {studyMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => markMaterialAsCompleted(material.id)}
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${
                        material.isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      {material.isCompleted && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <div>
                      <h4 className={`font-medium ${material.isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {material.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {material.category} • {material.timeSpent}m
                        {material.completedAt && ` • Completed ${material.completedAt.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {material.isCompleted ? (
                      <span className="text-green-500 text-sm font-medium">✓ Complete</span>
                    ) : (
                      <span className="text-gray-400 text-sm">In Progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Code Progress Tab */}
      {activeTab === 'coding' && (
        <>
          {/* Connection Status */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Connect your LeetCode account to see detailed coding progress and statistics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LeetCode Stats Grid */}
          {isAuthenticated && leetcodeStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leetcodeStats.map((stat, index) => {
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
          )}

          {/* Placeholder when not connected */}
          {!isAuthenticated && (
            <div className="card text-center py-12">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Connect Your LeetCode Account
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get detailed insights into your coding progress, problem-solving patterns, and improvement areas.
              </p>
              <button className="btn-primary">
                Connect LeetCode
              </button>
            </div>
          )}

          {/* Recent Activity */}
          {isAuthenticated && userData?.recentAcSubmissions && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                Recent Submissions
              </h3>
              <div className="space-y-3">
                {userData.recentAcSubmissions.slice(0, 10).map((submission: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {submission.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {submission.lang} • {new Date(submission.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-green-500 text-sm font-medium">✓ Accepted</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Analytics
