import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react'
import { GitHubContentService } from '../services/GitHubContentService'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  lastModified?: string
  extension?: string | null
}

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void
  selectedFile?: string
}

const FileExplorer = ({ onFileSelect, selectedFile }: FileExplorerProps) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['']))
  const [fileTree, setFileTree] = useState<{ [path: string]: FileItem[] }>({})
  const [loading, setLoading] = useState(true)

  // Load root directory on mount
  useEffect(() => {
    loadDirectory('')
  }, [])

  const loadDirectory = async (dirPath: string) => {
    try {
      // Load directory contents from GitHub
      const githubFiles = await GitHubContentService.getDirectoryStructure(dirPath)
      
      // Convert GitHub file format to our FileItem format
      const files: FileItem[] = githubFiles.map(file => ({
        name: file.name,
        path: dirPath ? `${dirPath}/${file.name}` : file.name,
        isDirectory: file.type === 'dir',
        size: file.type === 'file' ? undefined : undefined, // GitHub API doesn't provide size in directory listing
        extension: file.type === 'file' ? file.name.split('.').pop() || null : null
      }))
      
      setFileTree(prev => ({
        ...prev,
        [dirPath]: files
      }))
    } catch (error) {
      console.error('Error loading directory from GitHub:', error)
      // Set empty array for failed directory loads
      setFileTree(prev => ({
        ...prev,
        [dirPath]: []
      }))
    } finally {
      setLoading(false)
    }
  }

  const toggleDirectory = async (dirPath: string) => {
    const newExpanded = new Set(expandedDirs)
    
    if (expandedDirs.has(dirPath)) {
      newExpanded.delete(dirPath)
    } else {
      newExpanded.add(dirPath)
      // Load directory contents if not already loaded
      if (!fileTree[dirPath]) {
        await loadDirectory(dirPath)
      }
    }
    
    setExpandedDirs(newExpanded)
  }

  const handleFileClick = (filePath: string) => {
    onFileSelect(filePath)
  }

  const renderFileItem = (file: FileItem, level: number = 0) => {
    const isExpanded = expandedDirs.has(file.path)
    const isSelected = selectedFile === file.path
    const paddingLeft = level * 16

    if (file.isDirectory) {
      return (
        <div key={file.path}>
          <div
            className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm ${
              isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
            }`}
            style={{ paddingLeft: `${paddingLeft + 8}px` }}
            onClick={() => toggleDirectory(file.path)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 text-gray-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            )}
            <span className="text-gray-900 dark:text-white">{file.name}</span>
          </div>
          
          {isExpanded && fileTree[file.path] && (
            <div>
              {fileTree[file.path].map(childFile => 
                renderFileItem(childFile, level + 1)
              )}
            </div>
          )}
        </div>
      )
    } else {
      // Only show .md files
      if (!file.name.endsWith('.md')) return null
      
      return (
        <div
          key={file.path}
          className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm ${
            isSelected ? 'bg-primary-100 border-l-4 border-primary-500 dark:bg-primary-900/30' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => handleFileClick(file.path)}
        >
          <File className="w-4 h-4 mr-2 text-gray-500" />
          <span className={`text-gray-900 dark:text-white ${isSelected ? 'font-medium' : ''}`}>
            {file.name}
          </span>
          {file.size && (
            <span className="ml-auto text-xs text-gray-400">
              {(file.size / 1024).toFixed(1)}KB
            </span>
          )}
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="file-explorer">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          📁 File Explorer
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Navigate through your DSA explanations and select any .md file to read
        </div>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
        {fileTree[''] && fileTree[''].map(file => renderFileItem(file))}
      </div>
    </div>
  )
}

export default FileExplorer
