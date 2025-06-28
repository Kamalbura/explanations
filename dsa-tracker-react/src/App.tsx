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
import Navigation from './components/Navigation'
import LeetCodeLogin from './components/LeetCodeLogin'
import LeetCodeDashboard from './components/LeetCodeDashboard'

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

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark')
  }

  return (
    <LeetCodeAuthProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-2xl font-bold text-gradient">
                  🧠 DSA Mastery Hub
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar Navigation */}
            <Navigation isOpen={isSidebarOpen} />
            
            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/problems" element={<ProblemBrowser />} />
                  <Route path="/theory" element={<TheoryViewer />} />
                  <Route path="/theory/:category" element={<TheoryViewer />} />
                  <Route path="/study-plan" element={<StudyPlan />} />
                  <Route path="/analytics" element={<Analytics />} />
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
