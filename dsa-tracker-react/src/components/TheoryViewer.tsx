import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { ContentService } from '../services/ContentService'
import type { TheoryContent } from '../App'

const TheoryViewer = () => {
  const { category } = useParams()
  const [theoryFiles, setTheoryFiles] = useState<TheoryContent[]>([])
  const [selectedFile, setSelectedFile] = useState<TheoryContent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Load theory files using ContentService
  useEffect(() => {
    const loadContent = async () => {
      try {
        const files = await ContentService.loadTheoryContent()
        setTheoryFiles(files)
        
        // If category is specified, find and select the first file in that category
        if (category) {
          const categoryFile = files.find(file => 
            file.category.toLowerCase() === category.toLowerCase()
          )
          if (categoryFile) {
            setSelectedFile(categoryFile)
          }
        } else if (files.length > 0) {
          setSelectedFile(files[0])
        }
      } catch (error) {
        console.error('Failed to load theory content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [category])

  const filteredFiles = theoryFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = Array.from(new Set(theoryFiles.map(file => file.category)))

  const markAsRead = (fileId: string) => {
    setTheoryFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isRead: true } : file
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] space-x-6">
      {/* Sidebar */}
      <div className="w-80 card h-fit max-h-full overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Theory & Concepts
          </h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Link
              to="/theory"
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !category 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Topics
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/theory/${cat.toLowerCase()}`}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.toLowerCase()
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="mt-4 space-y-2">
          {filteredFiles.map(file => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedFile?.id === file.id
                  ? 'bg-primary-50 border-l-4 border-primary-500 dark:bg-primary-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {file.title}
                </h3>
                {file.isRead && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{file.category}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{file.readingTime}m</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 card">
        {selectedFile ? (
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFile.title}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{selectedFile.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedFile.readingTime} min read</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!selectedFile.isRead && (
                    <button
                      onClick={() => markAsRead(selectedFile.id)}
                      className="btn-secondary text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button className="btn-primary text-sm">
                    Practice Problems
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ children, className }) => {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 rounded">
                          {children}
                        </code>
                      )
                    }
                    return (
                      <pre className="code-block">
                        <code>{children}</code>
                      </pre>
                    )
                  },
                }}
              >
                {selectedFile.content}
              </ReactMarkdown>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Topic</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <span>Next Topic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a topic to get started
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from the topics on the left to begin learning.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TheoryViewer
