import { useState, useEffect } from 'react'
import { Search, Filter, ExternalLink, CheckCircle, Circle, Clock, RefreshCw, TrendingUp, Loader2 } from 'lucide-react'
import { LeetCodeService, type LeetCodeProblem, type LeetCodeStats } from '../services/LeetCodeService'

interface Problem {
  id: string
  title: string
  titleSlug?: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'easy' | 'medium' | 'hard'
  category: string
  status: 'not-started' | 'in-progress' | 'completed' | 'attempted' | 'ac' | 'notac'
  platform: 'leetcode' | 'neetcode' | 'striver' | 'other'
  tags: string[]
  timeSpent?: number
  attempts?: number
  lastAttempt?: Date
  language?: string
  runtime?: string
  memory?: string
  leetcodeUrl?: string
}

type ProblemCategory = 
  'Array' | 'String' | 'Hash Table' | 'Dynamic Programming' | 
  'Math' | 'Sorting' | 'Greedy' | 'Depth-First Search' | 
  'Binary Search' | 'Database' | 'Breadth-First Search' | 
  'Tree' | 'Matrix' | 'Two Pointers' | 'Bit Manipulation' |
  'Stack' | 'Heap' | 'Graph' | 'Other';

const getProblemCategory = (tags: string[]): string => {
  const mainCategories: ProblemCategory[] = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 
    'Math', 'Sorting', 'Greedy', 'Depth-First Search', 
    'Binary Search', 'Database', 'Breadth-First Search', 
    'Tree', 'Matrix', 'Two Pointers', 'Bit Manipulation',
    'Stack', 'Heap', 'Graph'
  ];
  
  for (const category of mainCategories) {
    if (tags.some(tag => tag.includes(category))) {
      return category;
    }
  }
  return 'Other';
};

const mapLeetCodeProblem = (leetcodeProblem: LeetCodeProblem): Problem => {
  const tags = leetcodeProblem.topicTags.map(tag => tag.name);
  const category = getProblemCategory(tags);
  
  return {
    id: leetcodeProblem.id,
    title: leetcodeProblem.title,
    titleSlug: leetcodeProblem.titleSlug,
    difficulty: leetcodeProblem.difficulty,
    category,
    status: leetcodeProblem.status || 'not-started',
    platform: 'leetcode',
    tags,
    leetcodeUrl: `https://leetcode.com/problems/${leetcodeProblem.titleSlug}/`
  };
};

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
  const [leetcodeUsername, setLeetcodeUsername] = useState<string>('')
  const [categories, setCategories] = useState<string[]>(['all'])
  const [loadingStage, setLoadingStage] = useState<string>('')

  // Load settings and check for LeetCode integration
  useEffect(() => {
    const settings = localStorage.getItem('dsa-tracker-settings')
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        if (parsed.leetcodeUsername) {
          setLeetcodeUsername(parsed.leetcodeUsername)
          setShowLeetCodeSync(true)
          loadLeetCodeStats(parsed.leetcodeUsername)
          loadProblems(parsed.leetcodeUsername)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    } else {
      loadDefaultProblems()
    }
  }, [])

  const loadLeetCodeStats = async (username: string) => {
    try {
      setIsLoading(true)
      setLoadingStage('Loading LeetCode stats...')
      
      const stats = await LeetCodeService.getUserStats(username)
      if (stats) {
        setLeetcodeStats(stats)
        localStorage.setItem('leetcode-stats', JSON.stringify(stats))
      }
    } catch (error) {
      console.error('Error loading LeetCode stats:', error)
    } finally {
      setLoadingStage('')
    }
  }

  const loadProblems = async (username: string) => {
    try {
      setIsLoading(true)
      setLoadingStage('Loading LeetCode problems...')
      
      // Get all problems
      const leetcodeProblems = await LeetCodeService.getAllProblems(100)
      
      if (leetcodeProblems.length === 0) {
        loadDefaultProblems()
        return
      }

      setLoadingStage('Processing problem data...')
      
      // Convert LeetCode problems to our format
      const mappedProblems = leetcodeProblems.map(mapLeetCodeProblem)
      
      // Extract all unique categories
      const uniqueCategories = ['all', ...Array.from(new Set(mappedProblems.map(p => p.category)))];
      setCategories(uniqueCategories)
      
      setProblems(mappedProblems)
      setFilteredProblems(mappedProblems)
      
      // Sync with user progress if username is available
      if (username) {
        setLoadingStage('Syncing your progress...')
        const problemSlugs = mappedProblems.map(p => p.titleSlug || '').filter(Boolean)
        const progressMap = await LeetCodeService.getUserProgress(username, problemSlugs)
        
        if (progressMap.size > 0) {
          const updatedProblems = mappedProblems.map(problem => {
            if (problem.titleSlug && progressMap.has(problem.titleSlug)) {
              const status = progressMap.get(problem.titleSlug);
              // Ensure we cast the status to a valid value in our type
              const validStatus = (status === 'completed' || status === 'attempted' || 
                                 status === 'in-progress' || status === 'not-started' || 
                                 status === 'ac' || status === 'notac') 
                                 ? status as Problem['status'] 
                                 : problem.status;
              
              return {
                ...problem,
                status: validStatus
              }
            }
            return problem
          })
          
          setProblems(updatedProblems)
          setFilteredProblems(updatedProblems)
        }
      }
    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setIsLoading(false)
      setLoadingStage('')
    }
  }

  const loadDefaultProblems = () => {
    // In case LeetCode API fails or no username, load mock data
    const mockProblems: Problem[] = [
      {
        id: '1',
        title: 'Two Sum',
        titleSlug: 'two-sum',
        difficulty: 'Easy',
        category: 'Array',
        status: 'not-started',
        platform: 'leetcode',
        tags: ['Array', 'Hash Table'],
        timeSpent: 15,
        attempts: 2,
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
      },
      {
        id: '2',
        title: 'Binary Tree Maximum Path Sum',
        titleSlug: 'binary-tree-maximum-path-sum',
        difficulty: 'Hard',
        category: 'Tree',
        status: 'attempted',
        platform: 'leetcode',
        tags: ['Tree', 'Depth-First Search'],
        timeSpent: 45,
        attempts: 3,
        leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
      },
      {
        id: '3',
        title: 'Valid Parentheses',
        titleSlug: 'valid-parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        status: 'completed',
        platform: 'leetcode',
        tags: ['Stack', 'String'],
        timeSpent: 12,
        attempts: 1,
        leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/'
      },
      {
        id: '4',
        title: 'Merge k Sorted Lists',
        titleSlug: 'merge-k-sorted-lists',
        difficulty: 'Hard',
        category: 'Heap',
        status: 'not-started',
        platform: 'leetcode',
        tags: ['Linked List', 'Heap', 'Divide and Conquer'],
        timeSpent: 0,
        attempts: 0,
        leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/'
      },
      {
        id: '5',
        title: 'Longest Palindromic Substring',
        titleSlug: 'longest-palindromic-substring',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        status: 'in-progress',
        platform: 'leetcode',
        tags: ['String', 'Dynamic Programming'],
        timeSpent: 30,
        attempts: 2,
        leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/'
      }
    ]
    setProblems(mockProblems)
    setFilteredProblems(mockProblems)
    setCategories(['all', ...Array.from(new Set(mockProblems.map(p => p.category)))])
    setIsLoading(false)
  }

  const syncWithLeetCode = async () => {
    if (!leetcodeUsername) return

    try {
      setIsLoading(true)
      setLoadingStage('Refreshing LeetCode data...')
      
      await loadLeetCodeStats(leetcodeUsername)
      await loadProblems(leetcodeUsername)
      
      localStorage.setItem('last-leetcode-sync', new Date().toISOString())
    } catch (error) {
      console.error('Error syncing with LeetCode:', error)
    } finally {
      setIsLoading(false)
      setLoadingStage('')
    }
  }

  // Filter and sort problems
  useEffect(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDifficulty = selectedDifficulty === 'all' || 
                              problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || mapStatus(problem.status) === selectedStatus
      const matchesPlatform = selectedPlatform === 'all' || problem.platform === selectedPlatform

      return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus && matchesPlatform
    })

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder: { [key: string]: number } = { 
            easy: 1, medium: 2, hard: 3,
            Easy: 1, Medium: 2, Hard: 3 
          }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'status':
          const statusOrder: { [key: string]: number } = { 
            'not-started': 1, 'notac': 1,
            'in-progress': 2, 'attempted': 3, 
            'completed': 4, 'ac': 4
          }
          return (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1)
        case 'id':
          return Number(a.id) - Number(b.id)
        default:
          return a.title.localeCompare(b.title)
      }
    })

    setFilteredProblems(filtered)
  }, [problems, searchTerm, selectedDifficulty, selectedCategory, selectedStatus, selectedPlatform, sortBy])

  const mapStatus = (status: string): string => {
    if (status === 'ac') return 'completed'
    if (status === 'notac') return 'attempted'
    return status
  }

  const getStatusIcon = (status: string) => {
    const mappedStatus = mapStatus(status)
    
    switch (mappedStatus) {
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
    switch (difficulty.toLowerCase()) {
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

  // Loading skeleton for the problem browser
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problem Browser</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">{loadingStage || 'Loading problems...'}</p>
            </div>
          </div>
        </div>

        {/* Skeleton for filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Skeleton for problems */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
              </div>
              <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-3"></div>
              <div className="flex flex-wrap gap-1 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
              <span>Completed ({problems.filter(p => ['completed', 'ac'].includes(p.status)).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>In Progress ({problems.filter(p => p.status === 'in-progress').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Attempted ({problems.filter(p => ['attempted', 'notac'].includes(p.status)).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Not Started ({problems.filter(p => ['not-started', null].includes(p.status as any)).length})</span>
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
            <option value="id">Sort by Problem ID</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="status">Sort by Status</option>
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
                  {problem.id}. {problem.title}
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
              {problem.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {problem.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                  +{problem.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => problem.leetcodeUrl && window.open(problem.leetcodeUrl, '_blank')}
                className="btn-primary flex-1 text-sm py-2"
              >
                {['completed', 'ac'].includes(problem.status) ? 'Review' : 'Solve'}
              </button>
              <button 
                onClick={() => problem.leetcodeUrl && window.open(problem.leetcodeUrl, '_blank')}
                className="btn-secondary text-sm py-2 px-4"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && !isLoading && (
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
