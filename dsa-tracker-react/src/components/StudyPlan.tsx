import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Clock, Target, TrendingUp, FileText, BookOpen, Award, BarChart3, Star } from 'lucide-react'
import { progressService, type StudyProgress, type ProgressStats } from '../services/ProgressService'
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
  const [selectedIteration, setSelectedIteration] = useState<number | null>(null)
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([])
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)
  const [animatedStats, setAnimatedStats] = useState<ProgressStats | null>(null)
  const navigate = useNavigate()
  const rafRef = useRef<number | null>(null)

  // Define iterations array first so it can be used in useEffect
  const iterations: StudyIteration[] = [
    {
      id: 1,
      title: "Two Pointers Fundamentals",
      description: "Master the two pointers technique for array and string problems",
      duration: "1-2 weeks",
      problems: 15,
      status: "completed",
      progress: 100,
      emoji: "👆",
      folder: "01_Two_Pointers",
      files: ["THEORY_COMPLETE.md", "PROBLEMS_SOLUTIONS.md"]
    },
    {
      id: 2,
      title: "Sliding Window Mastery", 
      description: "Learn sliding window patterns for substring and subarray problems",
      duration: "1-2 weeks",
      problems: 20,
      status: "completed",
      progress: 100,
      emoji: "🪟",
      folder: "02_Sliding_Window",
      files: ["THEORY_COMPLETE.md"]
    },
    {
      id: 3,
      title: "Binary Search Deep Dive",
      description: "Master binary search and its variations",
      duration: "2-3 weeks",
      problems: 25,
      status: "completed",
      progress: 100,
      emoji: "🔍",
      folder: "03_Binary_Search",
      files: ["THEORY_COMPLETE.md", "TEMPLATE_LIBRARY.md", "PROBLEMS_SOLUTIONS.md", "PRACTICE_SCHEDULE.md"]
    },
    {
      id: 4,
      title: "Dynamic Programming Foundation",
      description: "Build strong DP fundamentals and problem-solving patterns",
      duration: "3-4 weeks",
      problems: 30,
      status: "completed",
      progress: 85,
      emoji: "🧮",
      folder: "04_Dynamic_Programming",
      files: ["THEORY_COMPLETE.md"]
    },
    {
      id: 5,
      title: "Greedy Algorithms",
      description: "Learn greedy approach and optimization techniques",
      duration: "2-3 weeks",
      problems: 20,
      status: "completed",
      progress: 100,
      emoji: "💰",
      folder: "05_Greedy_Algorithms",
      files: ["THEORY_COMPLETE.md", "PROBLEMS_SOLUTIONS.md", "PRACTICE_SCHEDULE.md"]
    },
    {
      id: 6,
      title: "Backtracking Adventures",
      description: "Master backtracking for combinatorial problems",
      duration: "2-3 weeks",
      problems: 18,
      status: "completed",
      progress: 100,
      emoji: "🔄",
      folder: "06_Backtracking",
      files: ["THEORY_COMPLETE.md", "TEMPLATE_LIBRARY.md", "PROBLEMS_SOLUTIONS.md", "PRACTICE_SCHEDULE.md"]
    },
    {
      id: 7,
      title: "Graph Algorithms",
      description: "Comprehensive graph theory and algorithms",
      duration: "3-4 weeks",
      problems: 35,
      status: "completed",
      progress: 100,
      emoji: "🕸️",
      folder: "07_Graph_Algorithms",
      files: ["THEORY_COMPLETE.md", "TEMPLATE_LIBRARY.md", "PROBLEMS_SOLUTIONS.md", "PRACTICE_SCHEDULE.md"]
    },
    {
      id: 8,
      title: "Tree Algorithms",
      description: "Binary trees, BST, and advanced tree structures",
      duration: "3-4 weeks",
      problems: 40,
      status: "current",
      progress: 75,
      emoji: "🌳",
      folder: "08_Tree_Algorithms",
      files: ["THEORY_COMPLETE.md", "TEMPLATE_LIBRARY.md", "PROBLEMS_SOLUTIONS.md", "PRACTICE_SCHEDULE.md", "ITERATION_7_COMPLETE_THEORY.md"]
    },
    {
      id: 9,
      title: "Stack & Queue Mastery",
      description: "Master stack and queue data structures and applications",
      duration: "2-3 weeks",
      problems: 25,
      status: "completed",
      progress: 100,
      emoji: "📚",
      folder: "09_Stack_Queue",
      files: ["THEORY_COMPLETE.md", "PROBLEMS_WITH_SOLUTIONS.md"]
    },
    {
      id: 10,
      title: "Heap & Priority Queue",
      description: "Advanced heap operations and priority queue applications",
      duration: "2-3 weeks",
      problems: 22,
      status: "completed",
      progress: 100,
      emoji: "⛰️",
      folder: "10_Heap_Priority_Queue",
      files: ["THEORY_COMPLETE.md", "PROBLEMS_WITH_SOLUTIONS.md"]
    }
  ]

  // Animate progress stats (robust, prevents memleak on fast route changes)
  useEffect(() => {
    if (!progressStats) return
    if (
      !animatedStats ||
      animatedStats.completedMaterials !== progressStats.completedMaterials ||
      animatedStats.totalMaterials !== progressStats.totalMaterials ||
      animatedStats.totalTimeSpent !== progressStats.totalTimeSpent ||
      animatedStats.currentStreak !== progressStats.currentStreak
    ) {
      const duration = 500
      const start = { ...animatedStats ?? progressStats }
      const end = { ...progressStats }
      const startTime = performance.now()

      function animate(now: number) {
        const t = Math.min(1, (now - startTime) / duration)
        setAnimatedStats({
          completedMaterials: Math.round(start.completedMaterials + t * (end.completedMaterials - start.completedMaterials)),
          totalMaterials: end.totalMaterials,
          totalTimeSpent: start.totalTimeSpent + t * (end.totalTimeSpent - start.totalTimeSpent),
          currentStreak: Math.round(start.currentStreak + t * (end.currentStreak - start.currentStreak)),
        })
        if (t < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }
    // eslint-disable-next-line
  }, [progressStats])

  useEffect(() => {
    loadProgressData()
    
    // Auto-select the current iteration
    const currentIteration = iterations.find(iter => iter.status === 'current')
    if (currentIteration) {
      setSelectedIteration(currentIteration.id)
    } else {
      // If no current iteration, select the first upcoming or the last one
      const upcomingIteration = iterations.find(iter => iter.status === 'upcoming')
      setSelectedIteration(upcomingIteration?.id || iterations[iterations.length - 1]?.id || null)
    }
    // eslint-disable-next-line
  }, [])

  const loadProgressData = () => {
    const progress = progressService.getProgress()
    const stats = progressService.getStats()
    setStudyProgress(progress)
    setProgressStats(stats)
    setAnimatedStats(stats)
  }



  const completedIterations = iterations.filter(iter => iter.status === 'completed').length
  const totalIterations = iterations.length
  const overallProgress = (completedIterations / totalIterations) * 100

  const isFileCompleted = (folder: string, filename: string): boolean => {
    const materialId = `${folder.toLowerCase().replace(/\s+/g, '_')}_${filename.replace('.md', '').toLowerCase()}`
    const progress = studyProgress.find(p => p.id === materialId)
    return progress?.isCompleted || false
  }

  const openFile = (folder: string, filename: string) => {
    navigate('/theory', {
      state: { openFile: `${folder}/${filename}`, folder }
    })
  }

  const toggleFileCompletion = (folder: string, filename: string) => {
    const materialId = `${folder.toLowerCase().replace(/\s+/g, '_')}_${filename.replace('.md', '').toLowerCase()}`
    const progress = studyProgress.find(p => p.id === materialId)
    if (progress?.isCompleted) {
      progressService.markAsIncomplete(materialId)
    } else {
      progressService.markAsCompleted(materialId, `Completed reading ${filename}`)
    }
    loadProgressData()
  }

  const markAsRead = (folder: string, filename: string) => {
    const materialId = `${folder.toLowerCase().replace(/\s+/g, '_')}_${filename.replace('.md', '').toLowerCase()}`
    const sessionId = progressService.startStudySession(materialId)
    setTimeout(() => {
      progressService.endStudySession(sessionId)
      progressService.markAsCompleted(materialId, `Read and completed ${filename}`)
      loadProgressData()
    }, 1000)
    loadProgressData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
      case 'current':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 animate-pulse'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 rounded-xl text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Star className="w-7 h-7 text-yellow-300 animate-bounce" />
          DSA Study Plan
        </h1>
        <p className="text-purple-50 mb-4 text-lg font-medium">
          🚀 Structured learning path with <b>real progress tracking</b>
        </p>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Iteration {completedIterations + 1} of {totalIterations}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>{overallProgress.toFixed(0)}% Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Real-time tracking</span>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      {animatedStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Materials Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-200">
                  {animatedStats.completedMaterials}/{animatedStats.totalMaterials}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-200">
                  {(animatedStats.totalTimeSpent / 60).toFixed(1)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-all duration-200">
                  {animatedStats.currentStreak} days
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-all duration-200">
                  {((animatedStats.completedMaterials / animatedStats.totalMaterials) * 100).toFixed(0)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Study Iterations */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Study Iterations</h3>
          <div className="space-y-4">
            {iterations.map((iteration) => (
              <div
                key={iteration.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 relative overflow-hidden
                  ${selectedIteration === iteration.id
                    ? 'ring-2 ring-primary-500 border-primary-200 dark:border-primary-800'
                    : getStatusColor(iteration.status)
                  }`}
                onClick={() => setSelectedIteration(iteration.id)}
                tabIndex={0}
                aria-label={`${iteration.title} - ${iteration.status}`}
              >
                {/* Current iteration glow */}
                {iteration.status === 'current' && (
                  <span className="absolute inset-0 pointer-events-none z-0 rounded-lg animate-pulse bg-blue-100/40 dark:bg-blue-900/20" />
                )}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow">
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
                        <span className={`px-2 py-1 text-xs rounded-full font-medium 
                          ${
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
                              <div key={fileIndex} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group focus-within:ring-2 focus-within:ring-blue-400">
                                <button
                                  onClick={e => { e.stopPropagation(); toggleFileCompletion(iteration.folder, file) }}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors focus:ring-2 focus:ring-green-400
                                    ${isCompleted
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                                    }`}
                                  title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                  aria-label={isCompleted ? `Mark ${file} as incomplete` : `Mark ${file} as complete`}
                                >
                                  {isCompleted && <CheckCircle className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={e => { e.stopPropagation(); openFile(iteration.folder, file) }}
                                  className="flex items-center space-x-2 flex-1 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:underline"
                                  aria-label={`Open file ${file}`}
                                >
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm">{file.replace('.md', '').replace(/_/g, ' ')}</span>
                                  {!isCompleted && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-200 text-pink-800 text-xs font-bold animate-pulse">
                                      NEW
                                    </span>
                                  )}
                                </button>
                                {!isCompleted && (
                                  <button
                                    onClick={e => { e.stopPropagation(); markAsRead(iteration.folder, file) }}
                                    className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors focus:ring-2 focus:ring-blue-400"
                                    title="Mark as read"
                                    aria-label={`Mark ${file} as read`}
                                  >
                                    Mark as Read
                                  </button>
                                )}
                                {isCompleted && (
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium" aria-label="Completed">
                                    ✓ Completed
                                  </span>
                                )}
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
                        onClick={e => { e.stopPropagation(); navigate('/theory') }}
                        className="btn-primary text-sm focus:underline"
                        aria-label="Continue Study"
                      >
                        Continue Study
                      </button>
                    )}
                    {iteration.status === 'upcoming' && (
                      <button className="btn-secondary text-sm" aria-label="Preview Iteration">
                        Preview
                      </button>
                    )}
                    {iteration.status === 'completed' && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/theory') }}
                        className="btn-secondary text-sm focus:underline"
                        aria-label="Review Iteration"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
                {/* Animated Progress Bar */}
                {iteration.progress > 0 && (
                  <div className="mt-3 w-full">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-700
                          ${iteration.progress === 100 ? 'bg-green-500' : iteration.status === 'current' ? 'bg-blue-500' : 'bg-pink-400'}`}
                        style={{ width: `${iteration.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPlan