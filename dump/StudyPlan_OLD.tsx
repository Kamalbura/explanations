import { useState } from 'react'
import { Calendar, CheckCircle, Clock, Target, TrendingUp, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StudyIteration {
  id: number
  title: string
  description: string
  duration: string
  problems: number
  status: 'completed' | 'current' | 'upcoming'
  progress: number
  emoji: string
  folder: string
  files: string[]
  completedFiles: string[]
  scheduledDate?: Date
}

const StudyPlan = () => {
  const [selectedIteration, setSelectedIteration] = useState<number>(7)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')

  const iterations: StudyIteration[] = [
    { 
      id: 1, 
      title: 'Two Pointers', 
      description: 'Master efficient array traversal techniques', 
      duration: '4 hours', 
      problems: 8, 
      status: 'completed', 
      progress: 100, 
      emoji: '👆',
      folder: '01_Two_Pointers',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md'],
      scheduledDate: new Date('2025-06-15')
    },
    { 
      id: 2, 
      title: 'Sliding Window', 
      description: 'Optimize substring and subarray problems', 
      duration: '4 hours', 
      problems: 10, 
      status: 'completed', 
      progress: 100, 
      emoji: '🪟',
      folder: '02_Sliding_Window',
      files: ['THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md'],
      scheduledDate: new Date('2025-06-16')
    },
    { 
      id: 3, 
      title: 'Binary Search', 
      description: 'Divide and conquer sorted arrays', 
      duration: '3 hours', 
      problems: 8, 
      status: 'completed', 
      progress: 100, 
      emoji: '🔍',
      folder: '03_Binary_Search',
      files: ['PRACTICE_SCHEDULE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md'],
      scheduledDate: new Date('2025-06-17')
    },
    { 
      id: 4, 
      title: 'Dynamic Programming', 
      description: 'Sequential decision optimization', 
      duration: '6 hours', 
      problems: 15, 
      status: 'completed', 
      progress: 100, 
      emoji: '🧮',
      folder: '04_Dynamic_Programming',
      files: ['THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md'],
      scheduledDate: new Date('2025-06-18')
    },
    { 
      id: 5, 
      title: 'Greedy Algorithms', 
      description: 'Optimal local choices', 
      duration: '4 hours', 
      problems: 10, 
      status: 'completed', 
      progress: 100, 
      emoji: '💡',
      folder: '05_Greedy_Algorithms',
      files: ['PRACTICE_SCHEDULE.md', 'PROBLEMS_SOLUTIONS.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md'],
      scheduledDate: new Date('2025-06-19')
    },
    { 
      id: 6, 
      title: 'Backtracking', 
      description: 'Recursive solution exploration', 
      duration: '5 hours', 
      problems: 12, 
      status: 'completed', 
      progress: 100, 
      emoji: '🔄',
      folder: '06_Backtracking',
      files: ['PRACTICE_SCHEDULE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md'],
      scheduledDate: new Date('2025-06-20')
    },
    { 
      id: 7, 
      title: 'Tree Algorithms', 
      description: 'Binary trees, BST, and traversals', 
      duration: '4 hours', 
      problems: 12, 
      status: 'current', 
      progress: 60, 
      emoji: '🌳',
      folder: '08_Tree_Algorithms',
      files: ['ITERATION_7_COMPLETE_THEORY.md', 'PRACTICE_SCHEDULE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'ITERATION_7_COMPLETE_THEORY.md', 'TEMPLATE_LIBRARY.md'],
      scheduledDate: new Date('2025-06-25')
    },
    { 
      id: 8, 
      title: 'Graph Algorithms', 
      description: 'BFS, DFS, and graph traversal', 
      duration: '6 hours', 
      problems: 14, 
      status: 'upcoming', 
      progress: 0, 
      emoji: '📈',
      folder: '07_Graph_Algorithms',
      files: ['PRACTICE_SCHEDULE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'THEORY_COMPLETE.md'],
      completedFiles: [],
      scheduledDate: new Date('2025-06-28')
    },
    { 
      id: 9, 
      title: 'Stack & Queue', 
      description: 'LIFO/FIFO data structure mastery', 
      duration: '4 hours', 
      problems: 12, 
      status: 'completed', 
      progress: 100, 
      emoji: '📚',
      folder: '09_Stack_Queue',
      files: ['PROBLEMS_WITH_SOLUTIONS.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_WITH_SOLUTIONS.md'],
      scheduledDate: new Date('2025-06-21')
    },
    { 
      id: 10, 
      title: 'Heap/Priority Queue', 
      description: 'Efficient min/max operations', 
      duration: '5 hours', 
      problems: 10, 
      status: 'completed', 
      progress: 100, 
      emoji: '⛰️',
      folder: '10_Heap_Priority_Queue',
      files: ['PROBLEMS_WITH_SOLUTIONS.md', 'THEORY_COMPLETE.md'],
      completedFiles: ['THEORY_COMPLETE.md', 'PROBLEMS_WITH_SOLUTIONS.md'],
      scheduledDate: new Date('2025-06-22')
    },
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

  const toggleFileCompletion = (iterationId: number, fileName: string) => {
    // In a real app, this would update the backend
    console.log(`Toggling completion for ${fileName} in iteration ${iterationId}`)
  }

  // Calendar functionality
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getIterationForDate = (date: Date) => {
    return iterations.find(iter => 
      iter.scheduledDate && 
      iter.scheduledDate.toDateString() === date.toDateString()
    )
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-200 dark:border-gray-700"></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const iteration = getIterationForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-200 dark:border-gray-700 p-1 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-900 dark:text-white'}`}>
            {day}
          </div>
          {iteration && (
            <div className={`mt-1 p-1 rounded text-xs truncate ${
              iteration.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : iteration.status === 'current'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            }`}>
              <div className="flex items-center space-x-1">
                <span>{iteration.emoji}</span>
                {iteration.status === 'completed' && <CheckCircle className="w-3 h-3" />}
              </div>
              <div className="truncate">{iteration.title}</div>
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Study Plan & Schedule</h1>
        <p className="text-purple-100 mb-4">
          Structured learning path with real calendar planning and progress tracking
        </p>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Day {completedIterations + 1} of {totalIterations}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{overallProgress.toFixed(0)}% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>~60 hours total</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Timeline View</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {renderCalendar()}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Study Timeline</h3>
          
          <div className="space-y-4">
            {iterations.map((iteration) => (
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
                          {iteration.title}
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
                        <span>📂 {iteration.folder}</span>
                        {iteration.scheduledDate && (
                          <span>📅 {iteration.scheduledDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link
                      to={`/theory`}
                      state={{ folder: iteration.folder }}
                      className="btn-primary text-sm"
                    >
                      Study Now
                    </Link>
                  </div>
                </div>

                {/* File Progress */}
                {selectedIteration === iteration.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">Study Materials</h5>
                    <div className="space-y-2">
                      {iteration.files.map((fileName, fileIndex) => {
                        const isCompleted = iteration.completedFiles.includes(fileName)
                        return (
                          <div key={fileIndex} className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleFileCompletion(iteration.id, fileName)}
                              className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                            <div className="flex-1 flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <Link
                                to="/theory"
                                state={{ folder: iteration.folder, file: fileName }}
                                className={`text-sm hover:underline ${
                                  isCompleted
                                    ? 'text-gray-500 dark:text-gray-400 line-through'
                                    : 'text-blue-600 dark:text-blue-400'
                                }`}
                              >
                                {fileName}
                              </Link>
                            </div>
                            {isCompleted && (
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                ✓ Complete
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {iteration.completedFiles.length}/{iteration.files.length}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(iteration.completedFiles.length / iteration.files.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
            <h3 className="font-semibold text-gray-900 dark:text-white">Next Deadline</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-900 dark:text-white">
              {currentIteration?.title || 'All Done!'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentIteration?.scheduledDate 
                ? `Due ${currentIteration.scheduledDate.toLocaleDateString()}`
                : 'No upcoming deadlines'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPlan
