import { useState } from 'react'
import { Download, Upload, RotateCcw, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { progressService } from '../services/ProgressService'

interface ProgressManagerProps {
  onClose: () => void
  onProgressReset: () => void
}

const ProgressManager = ({ onClose, onProgressReset }: ProgressManagerProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      progressService.exportToExcel()
      // Show success message
      setTimeout(() => setIsExporting(false), 1000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return
    
    setIsImporting(true)
    try {
      await progressService.importFromExcel(importFile)
      setImportFile(null)
      onProgressReset() // Refresh the UI
      setTimeout(() => setIsImporting(false), 1000)
    } catch (error) {
      console.error('Import failed:', error)
      setIsImporting(false)
    }
  }

  const handleReset = () => {
    progressService.resetProgress()
    setShowResetConfirm(false)
    onProgressReset() // Refresh the UI
  }

  const stats = progressService.getStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Progress Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stats */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Progress</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Materials:</span>
              <span className="font-medium">{stats.totalMaterials}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed:</span>
              <span className="font-medium text-green-600">
                {stats.completedMaterials} ({((stats.completedMaterials / stats.totalMaterials) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
              <span className="font-medium">{(stats.totalTimeSpent / 60).toFixed(1)} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
              <span className="font-medium text-blue-600">{stats.currentStreak} days</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Export to Excel */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export to Excel'}</span>
          </button>

          {/* Import from Excel */}
          <div className="space-y-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleImport}
              disabled={!importFile || isImporting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isImporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isImporting ? 'Importing...' : 'Import from Excel'}</span>
            </button>
          </div>

          {/* Reset Progress */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Progress</span>
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-300">
                  Are you sure?
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                This will permanently delete all your study progress, time tracking, and notes. This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Export includes:</p>
              <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-400">
                <li>• Complete progress tracking data</li>
                <li>• Study session history with timestamps</li>
                <li>• Time spent per material</li>
                <li>• Notes and completion status</li>
                <li>• Summary statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressManager
