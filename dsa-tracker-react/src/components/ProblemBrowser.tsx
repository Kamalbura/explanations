import { useState, useEffect } from 'react'
import { Search, Filter, SortAsc, ExternalLink, CheckCircle, Circle, Clock, RefreshCw, TrendingUp } from 'lucide-react'
import { LeetCodeService, type LeetCodeStats, type LeetCodeSubmission } from '../services/LeetCodeService'

interface Problem {
  id: string
  title: string
  titleSlug?: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  status: 'not-started' | 'in-progress' | 'completed' | 'attempted'
  platform: 'leetcode' | 'neetcode' | 'striver' | 'other'
  tags: string[]
  timeSpent: number
  attempts: number
  lastAttempt?: Date
  language?: string
  runtime?: string
  memory?: string
  leetcodeUrl?: string
}

const ProblemBrowser = () => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLeetCodeSync, setShowLeetCodeSync] = useState(false)

  // Load settings and check for LeetCode integration
  useEffect(() => {
    const settings = localStorage.getItem('dsa-tracker-settings')
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        if (parsed.leetcodeUsername) {
          setShowLeetCodeSync(true)
          loadLeetCodeStats()
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const loadLeetCodeStats = () => {
    const stats = localStorage.getItem('leetcode-stats')
    if (stats) {
      try {
        setLeetcodeStats(JSON.parse(stats))
      } catch (error) {
        console.error('Error loading LeetCode stats:', error)
      }
    }
  }

  const syncWithLeetCode = async () => {
    const settings = localStorage.getItem('dsa-tracker-settings')
    if (!settings) return

    try {
      const parsed = JSON.parse(settings)
      if (!parsed.leetcodeUsername) return

      setIsLoading(true)
      const updatedProblems = await LeetCodeService.syncProgress(parsed.leetcodeUsername, problems)
      setProblems(updatedProblems)
      
      const stats = await LeetCodeService.getUserStats(parsed.leetcodeUsername)
      if (stats) {
        setLeetcodeStats(stats)
        localStorage.setItem('leetcode-stats', JSON.stringify(stats))
        localStorage.setItem('last-leetcode-sync', new Date().toISOString())
      }
    } catch (error) {
      console.error('Error syncing with LeetCode:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data - in real app, this would come from your DSA collections
  useEffect(() => {
    const mockProblems: Problem[] = [
      {
        id: '1',
        title: 'Two Sum',
        titleSlug: 'two-sum',
        difficulty: 'easy',
        category: 'Arrays',
        status: 'completed',
        platform: 'leetcode',
        tags: ['hash-table', 'array'],
        timeSpent: 15,
        attempts: 2,
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
      },
      {
        id: '2',
        title: 'Binary Tree Maximum Path Sum',
        titleSlug: 'binary-tree-maximum-path-sum',
        difficulty: 'hard',
        category: 'Trees',
        status: 'attempted',
        platform: 'neetcode',
        tags: ['tree', 'dfs', 'recursion'],
        timeSpent: 45,
        attempts: 3,
        leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
      },
      {
        id: '3',
        title: 'Valid Parentheses',
        titleSlug: 'valid-parentheses',
        difficulty: 'easy',
        category: 'Stack',
        status: 'completed',
        platform: 'leetcode',
        tags: ['stack', 'string'],
        timeSpent: 12,
        attempts: 1,
        leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/'
      },
      {
        id: '4',
        title: 'Merge k Sorted Lists',
        titleSlug: 'merge-k-sorted-lists',
        difficulty: 'hard',
        category: 'Linked Lists',
        status: 'not-started',
        platform: 'striver',
        tags: ['linked-list', 'heap', 'divide-conquer'],
        timeSpent: 0,
        attempts: 0,
        leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/'
      },
      {
        id: '5',
        title: 'Longest Palindromic Substring',
        titleSlug: 'longest-palindromic-substring',
        difficulty: 'medium',
        category: 'Dynamic Programming',
        status: 'in-progress',
        platform: 'leetcode',
        tags: ['string', 'dynamic-programming'],
        timeSpent: 30,
        attempts: 2,
        leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/'
      }
    ]
    setProblems(mockProblems)
    setFilteredProblems(mockProblems)
  }, [])

  // Filter and sort problems
  useEffect(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || problem.status === selectedStatus
      const matchesPlatform = selectedPlatform === 'all' || problem.platform === selectedPlatform

      return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus && matchesPlatform
    })

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'status':
          const statusOrder: { [key: string]: number } = { 'not-started': 1, 'in-progress': 2, 'attempted': 3, completed: 4 }
          return statusOrder[a.status] - statusOrder[b.status]
        case 'timeSpent':
          return b.timeSpent - a.timeSpent
        default:
          return a.title.localeCompare(b.title)
      }
    })

    setFilteredProblems(filtered)
  }, [problems, searchTerm, selectedDifficulty, selectedCategory, selectedStatus, selectedPlatform, sortBy])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'attempted':
        return <Circle className="w-5 h-5 text-blue-500 fill-current" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'hard':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const categories = ['all', ...Array.from(new Set(problems.map(p => p.category)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problem Browser</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore and track your progress across {problems.length} problems
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 space-y-4">
          {/* LeetCode Sync Button */}
          {showLeetCodeSync && (
            <div className="flex justify-end">
              <button
                onClick={syncWithLeetCode}
                disabled={isLoading}
                className="btn-primary px-4 py-2 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Syncing...' : 'Sync with LeetCode'}</span>
              </button>
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Completed ({problems.filter(p => p.status === 'completed').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>In Progress ({problems.filter(p => p.status === 'in-progress').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Attempted ({problems.filter(p => p.status === 'attempted').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Not Started ({problems.filter(p => p.status === 'not-started').length})</span>
            </div>
          </div>
          
          {/* LeetCode Stats */}
          {leetcodeStats && (
            <div className="text-sm text-gray-600 dark:text-gray-400 border-t pt-2">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">LeetCode Stats:</span>
              </div>
              <div className="flex space-x-4">
                <span>Total: {leetcodeStats.totalSolved}/{leetcodeStats.totalQuestions}</span>
                <span className="text-green-600">Easy: {leetcodeStats.easySolved}</span>
                <span className="text-yellow-600">Medium: {leetcodeStats.mediumSolved}</span>
                <span className="text-red-600">Hard: {leetcodeStats.hardSolved}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="attempted">Attempted</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="title">Sort by Title</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="status">Sort by Status</option>
            <option value="timeSpent">Sort by Time Spent</option>
          </select>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(problem.status)}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {problem.title}
                </h3>
              </div>
              <ExternalLink 
                className="w-4 h-4 text-gray-400 hover:text-primary-500 cursor-pointer" 
                onClick={() => problem.leetcodeUrl && window.open(problem.leetcodeUrl, '_blank')}
              />
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                {problem.platform}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Category: {problem.category}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Time: {problem.timeSpent}m</span>
              <span>Attempts: {problem.attempts}</span>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="btn-primary flex-1 text-sm py-2">
                {problem.status === 'completed' ? 'Review' : 'Solve'}
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No problems found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProblemBrowser
