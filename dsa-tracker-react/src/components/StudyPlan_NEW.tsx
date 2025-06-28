import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Clock, Target, TrendingUp, ChevronLeft, ChevronRight, FileText, BookOpen } from 'lucide-react'
import { progressService, type StudyProgress } from '../services/ProgressService'
import { useNavigate } from 'react-router-dom'

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
}

const StudyPlan = () => {
  const [selectedIteration, setSelectedIteration] = useState<number>(7)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const navigate = useNavigate()

  // Load progress data
  useEffect(() => {
    const progress = progressService.getProgress()
    setStudyProgress(progress)
  }, [])

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
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md']
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
      files: ['THEORY_COMPLETE.md']
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
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'PRACTICE_SCHEDULE.md']
    },
    { 
      id: 4, 
      title: 'Stack & Queue', 
      description: 'LIFO/FIFO data structure mastery', 
      duration: '4 hours', 
      problems: 12, 
      status: 'completed', 
      progress: 100, 
      emoji: '📚',
      folder: '09_Stack_Queue',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_WITH_SOLUTIONS.md']
    },
    { 
      id: 5, 
      title: 'Heap/Priority Queue', 
      description: 'Efficient min/max operations', 
      duration: '5 hours', 
      problems: 10, 
      status: 'completed', 
      progress: 100, 
      emoji: '⛰️',
      folder: '10_Heap_Priority_Queue',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_WITH_SOLUTIONS.md']
    },
    { 
      id: 6, 
      title: 'Dynamic Programming', 
      description: 'Sequential decision optimization', 
      duration: '6 hours', 
      problems: 15, 
      status: 'completed', 
      progress: 100, 
      emoji: '🧮',
      folder: '04_Dynamic_Programming',
      files: ['THEORY_COMPLETE.md']
    },
    { 
      id: 7, 
      title: 'Tree Algorithms', 
      description: 'Binary trees, BST, and traversals', 
      duration: '4 hours', 
      problems: 12, 
      status: 'current', 
      progress: 33, 
      emoji: '🌳',
      folder: '08_Tree_Algorithms',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'PRACTICE_SCHEDULE.md', 'ITERATION_7_COMPLETE_THEORY.md']
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
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'PRACTICE_SCHEDULE.md']
    },
    { 
      id: 9, 
      title: 'Backtracking', 
      description: 'Recursive solution exploration', 
      duration: '5 hours', 
      problems: 12, 
      status: 'upcoming', 
      progress: 0, 
      emoji: '🔄',
      folder: '06_Backtracking',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'TEMPLATE_LIBRARY.md', 'PRACTICE_SCHEDULE.md']
    },
    { 
      id: 10, 
      title: 'Greedy Algorithms', 
      description: 'Optimal local choices', 
      duration: '4 hours', 
      problems: 10, 
      status: 'upcoming', 
      progress: 0, 
      emoji: '💡',
      folder: '05_Greedy_Algorithms',
      files: ['THEORY_COMPLETE.md', 'PROBLEMS_SOLUTIONS.md', 'PRACTICE_SCHEDULE.md']
    },
  ]

  const currentIteration = iterations.find(iter => iter.status === 'current')
  const completedIterations = iterations.filter(iter => iter.status === 'completed').length
  const totalIterations = iterations.length
  const overallProgress = (completedIterations / totalIterations) * 100

  // Check if a file is completed based on progress service
  const isFileCompleted = (folder: string, filename: string): boolean => {
    const materialId = `${folder.toLowerCase().replace(/\s+/g, '_')}_${filename.replace('.md', '').toLowerCase()}`
    const progress = studyProgress.find(p => p.id === materialId)
    return progress?.isCompleted || false
  }

  // Navigate to theory viewer with specific file
  const openFile = (folder: string, filename: string) => {
    navigate('/theory', { 
      state: { 
        openFile: `${folder}/${filename}`,
        folder: folder 
      } 
    })
  }

  // Toggle file completion
  const toggleFileCompletion = (folder: string, filename: string) => {
    const materialId = `${folder.toLowerCase().replace(/\s+/g, '_')}_${filename.replace('.md', '').toLowerCase()}`
    const progress = studyProgress.find(p => p.id === materialId)
    
    if (progress?.isCompleted) {
      progressService.markAsIncomplete(materialId)
    } else {
      progressService.markAsCompleted(materialId)
    }
    
    // Refresh progress data
    const updatedProgress = progressService.getProgress()
    setStudyProgress(updatedProgress)
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const hasStudyActivity = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split('T')[0]
    const sessions = progressService.getRecentActivity(30)
    return sessions.some(session => session.date === dateStr)
  }

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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasActivity = hasStudyActivity(day)
      const todayClass = isToday(day) ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30' : ''
      const activityClass = hasActivity ? 'bg-green-100 dark:bg-green-900/30' : ''
      
      days.push(
        <div
          key={day}
          className={`h-10 w-10 flex items-center justify-center text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${todayClass} ${activityClass}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <span className={`${hasActivity ? 'font-bold' : ''}`}>{day}</span>
          {hasActivity && <div className="absolute mt-6 w-1 h-1 bg-green-500 rounded-full"></div>}
        </div>
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white p-6">
        <h1 className="text-3xl font-bold mb-2">DSA Study Plan</h1>
        <p className="text-purple-100 mb-4">
          Structured learning path with real progress tracking
        </p>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Iteration {completedIterations + 1} of {totalIterations}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{overallProgress.toFixed(0)}% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Real-time tracking</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Calendar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Calendar</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium px-2">{getMonthName(currentDate)}</span>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Study day</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded ring-2 ring-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Study Iterations */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Study Iterations</h3>
            
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                        {iteration.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <span className="text-lg">{iteration.emoji}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
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
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {iteration.description}
                        </p>

                        {/* Files list */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Materials:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {iteration.files.map((file, fileIndex) => {
                              const isCompleted = isFileCompleted(iteration.folder, file)
                              return (
                                <div key={fileIndex} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFileCompletion(iteration.folder, file)
                                    }}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                                    }`}
                                  >
                                    {isCompleted && <CheckCircle className="w-3 h-3" />}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openFile(iteration.folder, file)
                                    }}
                                    className="flex items-center space-x-2 flex-1 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm">{file.replace('.md', '').replace(/_/g, ' ')}</span>
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>⏱️ {iteration.duration}</span>
                          <span>📝 {iteration.problems} problems</span>
                          <span>📊 {iteration.progress}% complete</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      {iteration.status === 'current' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/theory')
                          }}
                          className="btn-primary text-sm"
                        >
                          Continue Study
                        </button>
                      )}
                      {iteration.status === 'upcoming' && (
                        <button className="btn-secondary text-sm">
                          Preview
                        </button>
                      )}
                      {iteration.status === 'completed' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/theory')
                          }}
                          className="btn-secondary text-sm"
                        >
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
        </div>
      </div>
    </div>
  )
}

export default StudyPlan
