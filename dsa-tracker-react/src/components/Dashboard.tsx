import { useState, useEffect } from 'react'
import { Calendar, Clock, Target, TrendingUp, Trophy, Flame } from 'lucide-react'

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: 'Problems Solved Today',
      value: '12',
      change: '+3 from yesterday',
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Study Time Today',
      value: '2h 15m',
      change: '15min remaining',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Current Streak',
      value: '7 days',
      change: 'Personal best!',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Weekly Goal',
      value: '85%',
      change: '17/20 problems',
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  const recentActivity = [
    { problem: 'Binary Tree Maximum Path Sum', difficulty: 'hard', timeAgo: '2 hours ago', status: 'completed' },
    { problem: 'Valid Parentheses', difficulty: 'easy', timeAgo: '3 hours ago', status: 'completed' },
    { problem: 'Merge k Sorted Lists', difficulty: 'hard', timeAgo: '5 hours ago', status: 'in-progress' },
    { problem: 'Two Sum', difficulty: 'easy', timeAgo: '1 day ago', status: 'completed' },
  ]

  const upcomingTasks = [
    { task: 'Complete Tree Algorithms section', priority: 'high', dueDate: 'Today' },
    { task: 'Review Dynamic Programming patterns', priority: 'medium', dueDate: 'Tomorrow' },
    { task: 'Practice Graph BFS/DFS problems', priority: 'low', dueDate: 'This week' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
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
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.problem}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : activity.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {activity.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timeAgo}
                    </span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'completed' 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {task.task}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {task.dueDate}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
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
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '33%' }} />
          </div>
          
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Started 2 days ago</span>
            <span className="text-gray-600 dark:text-gray-400">Est. completion: Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
