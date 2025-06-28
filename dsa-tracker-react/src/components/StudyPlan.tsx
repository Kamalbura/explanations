import { useState } from 'react'
import { Calendar, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'

interface StudyIteration {
  id: number
  title: string
  description: string
  duration: string
  problems: number
  status: 'completed' | 'current' | 'upcoming'
  progress: number
  emoji: string
}

const StudyPlan = () => {
  const [selectedIteration, setSelectedIteration] = useState<number>(7)

  const iterations: StudyIteration[] = [
    { id: 1, title: 'Two Pointers', description: 'Master efficient array traversal techniques', duration: '4 hours', problems: 8, status: 'completed', progress: 100, emoji: '👆' },
    { id: 2, title: 'Sliding Window', description: 'Optimize substring and subarray problems', duration: '4 hours', problems: 10, status: 'completed', progress: 100, emoji: '🪟' },
    { id: 3, title: 'Binary Search', description: 'Divide and conquer sorted arrays', duration: '3 hours', problems: 8, status: 'completed', progress: 100, emoji: '🔍' },
    { id: 4, title: 'Stack & Queue', description: 'LIFO/FIFO data structure mastery', duration: '4 hours', problems: 12, status: 'completed', progress: 100, emoji: '📚' },
    { id: 5, title: 'Heap/Priority Queue', description: 'Efficient min/max operations', duration: '5 hours', problems: 10, status: 'completed', progress: 100, emoji: '⛰️' },
    { id: 6, title: 'Dynamic Programming 1D', description: 'Sequential decision optimization', duration: '6 hours', problems: 15, status: 'completed', progress: 100, emoji: '🧮' },
    { id: 7, title: 'Tree Algorithms', description: 'Binary trees, BST, and traversals', duration: '4 hours', problems: 12, status: 'current', progress: 33, emoji: '🌳' },
    { id: 8, title: 'Graph Algorithms', description: 'BFS, DFS, and graph traversal', duration: '6 hours', problems: 14, status: 'upcoming', progress: 0, emoji: '📈' },
    { id: 9, title: 'Backtracking', description: 'Recursive solution exploration', duration: '5 hours', problems: 12, status: 'upcoming', progress: 0, emoji: '🔄' },
    { id: 10, title: 'Greedy Algorithms', description: 'Optimal local choices', duration: '4 hours', problems: 10, status: 'upcoming', progress: 0, emoji: '💡' },
    { id: 11, title: 'Union Find & Trie', description: 'Disjoint sets and prefix trees', duration: '4 hours', problems: 8, status: 'upcoming', progress: 0, emoji: '🔗' },
    { id: 12, title: 'Advanced Graphs', description: 'Shortest paths, MST, topology', duration: '6 hours', problems: 12, status: 'upcoming', progress: 0, emoji: '🗺️' },
    { id: 13, title: 'Dynamic Programming 2D', description: 'Matrix and grid optimization', duration: '6 hours', problems: 15, status: 'upcoming', progress: 0, emoji: '🎯' },
    { id: 14, title: 'Advanced Trees', description: 'Segment trees, Fenwick trees', duration: '5 hours', problems: 10, status: 'upcoming', progress: 0, emoji: '🌲' },
    { id: 15, title: 'System Design DS', description: 'LRU, LFU, and design patterns', duration: '4 hours', problems: 8, status: 'upcoming', progress: 0, emoji: '🏗️' },
    { id: 16, title: 'FAANG Problems', description: 'Company-specific interview prep', duration: '8 hours', problems: 20, status: 'upcoming', progress: 0, emoji: '🏢' },
    { id: 17, title: 'Hard Patterns', description: 'Complex algorithmic challenges', duration: '6 hours', problems: 12, status: 'upcoming', progress: 0, emoji: '🧠' },
    { id: 18, title: 'Mock Interview 1', description: 'Timed problem-solving practice', duration: '2 hours', problems: 4, status: 'upcoming', progress: 0, emoji: '🎭' },
    { id: 19, title: 'Mock Interview 2', description: 'Advanced interview simulation', duration: '2 hours', problems: 4, status: 'upcoming', progress: 0, emoji: '🎪' },
    { id: 20, title: 'Final Review', description: 'Comprehensive preparation', duration: '4 hours', problems: 10, status: 'upcoming', progress: 0, emoji: '🏆' },
  ]

  const currentIteration = iterations.find(iter => iter.status === 'current')
  const completedIterations = iterations.filter(iter => iter.status === 'completed').length
  const totalIterations = iterations.length
  const overallProgress = (completedIterations / totalIterations) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
      case 'current':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white p-6">
        <h1 className="text-3xl font-bold mb-2">20-Day DSA Bootcamp</h1>
        <p className="text-purple-100 mb-4">
          Structured learning path to master data structures and algorithms
        </p>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Day {completedIterations + 1} of 20</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{overallProgress.toFixed(0)}% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>~80 hours total</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="font-medium">{completedIterations}/{totalIterations}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Current Focus</h3>
            <span className="text-2xl">{currentIteration?.emoji}</span>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-900 dark:text-white">
              {currentIteration?.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentIteration?.description}
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${currentIteration?.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Time Investment</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Time spent</span>
              <span className="font-medium">24h 30m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Remaining</span>
              <span className="font-medium">55h 30m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Daily target</span>
              <span className="font-medium">4h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Study Plan Timeline */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Study Timeline</h3>
        
        <div className="space-y-4">
          {iterations.map((iteration, index) => (
            <div
              key={iteration.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedIteration === iteration.id
                  ? 'ring-2 ring-primary-500 border-primary-200 dark:border-primary-800'
                  : getStatusColor(iteration.status)
              }`}
              onClick={() => setSelectedIteration(iteration.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                    {iteration.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-lg">{iteration.emoji}</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Day {iteration.id}: {iteration.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        iteration.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : iteration.status === 'current'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {iteration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {iteration.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>⏱️ {iteration.duration}</span>
                      <span>📝 {iteration.problems} problems</span>
                      <span>📊 {iteration.progress}% complete</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {iteration.status === 'current' && (
                    <button className="btn-primary text-sm">
                      Continue Study
                    </button>
                  )}
                  {iteration.status === 'upcoming' && (
                    <button className="btn-secondary text-sm">
                      Preview
                    </button>
                  )}
                  {iteration.status === 'completed' && (
                    <button className="btn-secondary text-sm">
                      Review
                    </button>
                  )}
                </div>
              </div>

              {iteration.progress > 0 && iteration.progress < 100 && (
                <div className="mt-3">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${iteration.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Schedule */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          This Week's Schedule
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {day}
              </div>
              <div className={`p-2 rounded-lg text-sm ${
                index === 2 // Wednesday (current day)
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 ring-2 ring-primary-500'
                  : index < 2
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {index < 2 ? '✅ Tree Algos' : index === 2 ? '🌳 Tree Algos' : '📈 Graphs'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudyPlan
