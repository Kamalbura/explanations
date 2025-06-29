import { useState, useEffect } from 'react';
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import type { LeetCodeUserData } from '../services/leetcode/leetcode-api';

// Define interface for component props
interface UserInfoProps {
  userData: LeetCodeUserData;
  username: string;
  refreshData: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabContentProps {
  userData: LeetCodeUserData;
}

// Define type for submission
interface Submission {
  titleSlug: string;
  title: string;
  timestamp: number;
  difficulty?: string;
  lang?: string;
}

// Color palette
const COLORS = {
  easy: '#00B8A3',
  medium: '#FFA116',
  hard: '#FF375F',
  solved: '#3E8EF7',
  unsolved: '#CBD5E0',
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'progress', label: 'Progress' },
  { key: 'activity', label: 'Activity' },
  { key: 'recent', label: 'Recent' }
];

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

function UserInfo({ userData, username, refreshData, logout, isLoading }: UserInfoProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4 md:mb-0">
        {userData.profile.userAvatar && (
          <img
            src={userData.profile.userAvatar}
            alt={userData.profile.username}
            className="h-16 w-16 rounded-full mr-4"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {userData.profile.realName || userData.profile.username}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">@{username}</p>
          {userData.progress.ranking && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              Rank: {userData.progress.ranking.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          type="button"
        >
          Refresh
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          type="button"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="flex space-x-8">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab.key)}
            aria-current={activeTab === tab.key ? "page" : undefined}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function OverviewTab({ userData }: TabContentProps) {
  const difficultyData = [
    { 
      name: 'Easy', 
      solved: userData.progress.easySolved, 
      total: userData.progress.easyTotal,
      percentage: ((userData.progress.easySolved / userData.progress.easyTotal) * 100).toFixed(1)
    },
    { 
      name: 'Medium', 
      solved: userData.progress.mediumSolved, 
      total: userData.progress.mediumTotal,
      percentage: ((userData.progress.mediumSolved / userData.progress.mediumTotal) * 100).toFixed(1)
    },
    { 
      name: 'Hard', 
      solved: userData.progress.hardSolved, 
      total: userData.progress.hardTotal,
      percentage: ((userData.progress.hardSolved / userData.progress.hardTotal) * 100).toFixed(1)
    },
  ];
  const totalProgress = Math.round((userData.progress.totalSolved / userData.progress.totalQuestions) * 100);
  const pieData = [
    { name: 'Solved', value: userData.progress.totalSolved, color: COLORS.solved },
    { name: 'Unsolved', value: userData.progress.totalQuestions - userData.progress.totalSolved, color: COLORS.unsolved },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problems Solved */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Problems Solved</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              {userData.progress.totalSolved}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mb-1">
              / {userData.progress.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {totalProgress}% complete
          </p>
        </div>
        {/* Acceptance Rate */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Acceptance Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              {userData.progress.acceptanceRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Based on your submission history
          </p>
        </div>
        {/* Difficulty Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Difficulty Distribution</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: `${COLORS.easy}20`, color: COLORS.easy }}
            >
              Easy: {userData.progress.easySolved} / {userData.progress.easyTotal}
            </span>
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: `${COLORS.medium}20`, color: COLORS.medium }}
            >
              Medium: {userData.progress.mediumSolved} / {userData.progress.mediumTotal}
            </span>
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: `${COLORS.hard}20`, color: COLORS.hard }}
            >
              Hard: {userData.progress.hardSolved} / {userData.progress.hardTotal}
            </span>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">Problem Difficulty Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={difficultyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 'dataMax']} tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip
                  formatter={(value, name) => [`${value} problems`, name === 'solved' ? 'Solved' : 'Total Available']}
                  labelFormatter={(label) => `${label} Problems`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend wrapperStyle={{ color: '#6B7280' }} formatter={(value) => value === 'solved' ? 'Solved' : 'Total Available'} />
                <Bar dataKey="total" name="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="solved" name="solved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            {difficultyData.map((item, index) => (
              <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {item.solved}/{item.total}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {item.percentage}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Pie Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">Overall Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTab({ userData }: TabContentProps) {
  const easyProgress = Math.round((userData.progress.easySolved / userData.progress.easyTotal) * 100);
  const mediumProgress = Math.round((userData.progress.mediumSolved / userData.progress.mediumTotal) * 100);
  const hardProgress = Math.round((userData.progress.hardSolved / userData.progress.hardTotal) * 100);
  const totalProgress = Math.round((userData.progress.totalSolved / userData.progress.totalQuestions) * 100);

  const strongAreas = [
    easyProgress > 50 ? 'Easy problems' : '',
    mediumProgress > 40 ? 'Medium problems' : '',
    hardProgress > 30 ? 'Hard problems' : ''
  ].filter(Boolean).join(', ') || 'Keep practicing!';

  const areasToImprove = [
    easyProgress < 80 ? 'Easy problems' : '',
    mediumProgress < 50 ? 'Medium problems' : '',
    hardProgress < 30 ? 'Hard problems' : ''
  ].filter(Boolean).join(', ') || "You're doing great across all difficulties!";

  let suggestedFocus = 'Easy problems';
  if (hardProgress < mediumProgress && hardProgress < easyProgress) suggestedFocus = 'Hard problems';
  else if (mediumProgress < easyProgress) suggestedFocus = 'Medium problems';

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 dark:text-white">Detailed Progress</h3>
      <div className="space-y-4">
        {/* Easy */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Easy</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userData.progress.easySolved} / {userData.progress.easyTotal}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full">
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${easyProgress}%`, backgroundColor: COLORS.easy }}
            ></div>
          </div>
        </div>
        {/* Medium */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userData.progress.mediumSolved} / {userData.progress.mediumTotal}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full">
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${mediumProgress}%`, backgroundColor: COLORS.medium }}
            ></div>
          </div>
        </div>
        {/* Hard */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hard</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userData.progress.hardSolved} / {userData.progress.hardTotal}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full">
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${hardProgress}%`, backgroundColor: COLORS.hard }}
            ></div>
          </div>
        </div>
        {/* Total */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userData.progress.totalSolved} / {userData.progress.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Analysis */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Analysis</h4>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Strong areas:</span> {strongAreas}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Areas to improve:</span> {areasToImprove}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Suggested focus:</span> {suggestedFocus}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ userData }: TabContentProps) {
  const submissionCalendarData = Object.entries(userData.submissionCalendar || {}).map(
    ([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000).toLocaleDateString(),
      submissions: count
    })
  ).slice(-30);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 dark:text-white">Recent Activity</h3>
      {submissionCalendarData.length > 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Submission History (Last 30 days)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={submissionCalendarData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            No recent activity data available.
          </p>
        </div>
      )}
    </div>
  );
}

function RecentTab({ userData }: TabContentProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 dark:text-white">Recently Solved</h3>
      {userData.recentAcSubmissions && userData.recentAcSubmissions.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {userData.recentAcSubmissions.map((submission: Submission, index: number) => (
            <li key={index} className="py-3">
              <a
                href={`https://leetcode.com/problems/${submission.titleSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">{submission.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Solved on {new Date(submission.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="mt-1 md:mt-0">
                  <span
                    className="px-2 py-1 text-xs rounded-full capitalize"
                    style={{
                      backgroundColor: `${COLORS[submission.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' || 'easy']}20`,
                      color: COLORS[submission.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' || 'easy']
                    }}
                  >
                    {submission.difficulty}
                  </span>
                  <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {submission.lang}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            No recent submissions available.
          </p>
        </div>
      )}
    </div>
  );
}

const LeetCodeDashboard = () => {
  const { userData, username: usernameFromContext, refreshData: refreshLeetCodeData, isLoading: isGlobalLoading, logout } = useLeetCodeAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Ensure username is never null for our components
  const username = usernameFromContext || "";

  // Custom refresh function that uses local loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLeetCodeData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    if (username && !userData) {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const initialLoading = isGlobalLoading && !userData;
  
  if (initialLoading) return <LoadingSpinner />;
  if (!userData) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">No LeetCode data available</p>
        <button
          onClick={() => window.location.href = '/leetcode/login'}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          type="button"
        >
          Connect LeetCode Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <UserInfo userData={userData} username={username} refreshData={handleRefresh} logout={logout} isLoading={isRefreshing} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        <div className={isRefreshing ? 'opacity-50 pointer-events-none' : ''}>
          {activeTab === 'overview' && <OverviewTab userData={userData} />}
          {activeTab === 'progress' && <ProgressTab userData={userData} />}
          {activeTab === 'activity' && <ActivityTab userData={userData} />}
          {activeTab === 'recent' && <RecentTab userData={userData} />}
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDashboard;