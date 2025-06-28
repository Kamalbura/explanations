import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, Target, Award, Calendar, BarChart3 } from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const dailyProgress = [
    { date: 'Mon', problems: 5, timeSpent: 120 },
    { date: 'Tue', problems: 8, timeSpent: 180 },
    { date: 'Wed', problems: 6, timeSpent: 150 },
    { date: 'Thu', problems: 12, timeSpent: 200 },
    { date: 'Fri', problems: 9, timeSpent: 165 },
    { date: 'Sat', problems: 7, timeSpent: 140 },
    { date: 'Sun', problems: 10, timeSpent: 190 },
  ]

  const difficultyDistribution = [
    { name: 'Easy', value: 45, color: '#10B981' },
    { name: 'Medium', value: 35, color: '#F59E0B' },
    { name: 'Hard', value: 20, color: '#EF4444' },
  ]

  const categoryProgress = [
    { category: 'Arrays', solved: 25, total: 30, percentage: 83 },
    { category: 'Trees', solved: 8, total: 15, percentage: 53 },
    { category: 'Graphs', solved: 5, total: 20, percentage: 25 },
    { category: 'DP', solved: 12, total: 25, percentage: 48 },
    { category: 'Strings', solved: 18, total: 20, percentage: 90 },
  ]

  const weeklyStreaks = [
    { week: 'Week 1', streak: 7 },
    { week: 'Week 2', streak: 6 },
    { week: 'Week 3', streak: 7 },
    { week: 'Week 4', streak: 5 },
    { week: 'Week 5', streak: 7 },
  ]

  const stats = [
    {
      title: 'Total Problems Solved',
      value: '142',
      change: '+12 this week',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Average Time Per Problem',
      value: '18m',
      change: '-2m from last week',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Current Streak',
      value: '7 days',
      change: 'Personal best!',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Study Time This Week',
      value: '12.5h',
      change: '25% of weekly goal',
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and identify areas for improvement
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
        {/* Daily Progress Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Daily Progress
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
              <Bar dataKey="problems" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            Difficulty Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {difficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {category.solved}/{category.total}
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

        {/* Weekly Streaks */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-500" />
            Weekly Streaks
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyStreaks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="streak" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          📊 Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
              🎯 Strong Performance
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              You're excelling at Arrays and Strings! Your solve rate is above average.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              ⚠️ Focus Area
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Consider spending more time on Graph algorithms. Only 25% completed.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              💡 Suggestion
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Your 7-day streak is impressive! Try to maintain this consistency.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
