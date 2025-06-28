import { Link } from 'react-router-dom'

interface SubmissionRowProps {
  submission: {
    title: string
    titleSlug: string
    timestamp: number
    lang: string
  }
  timeAgo: (timestamp: number) => string
  truncateWords: (str: string, numWords: number) => string
}

const SubmissionRow = ({ submission, timeAgo, truncateWords }: SubmissionRowProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
      {/* Problem Name */}
      <div className="flex-1 min-w-0">
        <Link
          to={`https://leetcode.com/problems/${submission.titleSlug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-700 dark:text-blue-300 hover:underline block truncate text-sm sm:text-base"
          title={submission.title}
        >
          {truncateWords(submission.title, window.innerWidth < 640 ? 4 : 6)}
        </Link>
      </div>
      
      {/* Status Badge */}
      <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40 rounded-full border border-green-200 dark:border-green-800">
        ✓ AC
      </span>
      
      {/* Time & Language */}
      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
        <span className="whitespace-nowrap hidden sm:inline" title={timeAgo(submission.timestamp)}>
          {timeAgo(submission.timestamp)}
        </span>
        <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-200 dark:bg-gray-600 rounded text-center min-w-[32px] sm:min-w-[40px]" title={submission.lang}>
          {submission.lang}
        </span>
      </div>
    </div>
  )
}

export default SubmissionRow
