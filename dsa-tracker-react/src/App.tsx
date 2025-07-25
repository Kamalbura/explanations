import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { LeetCodeAuthProvider } from './contexts/LeetCodeAuthContext'

// Components
import Dashboard from './components/Dashboard.tsx'
import ProblemBrowser from './components/ProblemBrowser.tsx'
import TheoryViewer from './components/TheoryViewer.tsx'
import StudyPlan from './components/StudyPlan.tsx'
import Analytics from './components/Analytics.tsx'
import CodeEditor from './components/CodeEditor.tsx'
import Settings from './components/Settings.tsx'
import Calendar from './components/Calendar.tsx'
import Comparison from './components/Comparison.tsx'
import Navigation from './components/Navigation'
import LeetCodeLogin from './components/LeetCodeLogin'
import LeetCodeDashboard from './components/LeetCodeDashboard'
import UserProfile from './components/UserProfile'

// Types
export interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  status: 'not-started' | 'in-progress' | 'completed'
  timeSpent: number
  attempts: number
  lastAttempt?: Date
  tags: string[]
  platform: 'leetcode' | 'neetcode' | 'striver' | 'other'
}

export interface TheoryContent {
  id: string
  title: string
  category: string
  filePath: string
  content: string
  readingTime: number
  isRead: boolean
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true) // Start collapsed on mobile

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    // Set initial collapsed state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setIsSidebarCollapsed(true)
      }
    }

    handleResize() // Call on mount
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark')
  }

  return (
    <LeetCodeAuthProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col`}>
          {/* Header - Responsive */}
          <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle navigation"
                >
                  {isSidebarOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
                </button>
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gradient">
                  🧠 <span className="hidden sm:inline">DSA Mastery Hub</span>
                  <span className="sm:hidden">DSA Hub</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                <UserProfile />
                <button
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 relative">
            {/* Sidebar Navigation */}
            <Navigation 
              isOpen={isSidebarOpen} 
              isCollapsed={isSidebarCollapsed}
              onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />
            
            {/* Main Content - Responsive */}
            <main className={`flex-1 transition-all duration-300 overflow-y-auto pt-2 ${
              isSidebarOpen 
                ? isSidebarCollapsed 
                  ? 'ml-12 sm:ml-16' 
                  : 'ml-56 sm:ml-64'
                : 'ml-0'
            }`}>
              <div className="p-3 sm:p-4 lg:p-6 relative min-h-full mt-2">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/problems" element={<ProblemBrowser />} />
                  <Route path="/theory" element={<TheoryViewer />} />
                  <Route path="/theory/:category" element={<TheoryViewer />} />
                  <Route path="/study-plan" element={<StudyPlan />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/comparison" element={<Comparison />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/code-editor" element={<CodeEditor />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/leetcode" element={<LeetCodeDashboard />} />
                  <Route path="/leetcode/login" element={<LeetCodeLogin />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </LeetCodeAuthProvider>
  )
}

export default App
