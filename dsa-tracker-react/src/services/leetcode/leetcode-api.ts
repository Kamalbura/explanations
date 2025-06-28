/**
 * LeetCode API Service
 * Uses the unofficial GraphQL endpoint to fetch user statistics and problem data
 */

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_PROXY_ENDPOINT = 'http://localhost:3030/api/leetcode';

interface LeetCodeUserProfile {
  username: string;
  realName: string;
  aboutMe: string;
  userAvatar: string;
  ranking: number;
  reputation: number;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteUrl: string;
}

interface LeetCodeUserProgress {
  totalSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  acceptanceRate: number;
  ranking: number;
}

interface LeetCodeSubmissionCalendar {
  [timestamp: string]: number;
}

interface LeetCodeProblem {
  id: string;
  frontendId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'ac' | 'notac' | null;
  isPaidOnly: boolean;
  topicTags: string[];
  acRate: number;
  totalSubmissionCount: number;
  totalAcceptedCount: number;
}

export interface LeetCodeUserData {
  profile: LeetCodeUserProfile;
  progress: LeetCodeUserProgress;
  submissionCalendar: LeetCodeSubmissionCalendar;
  recentSubmissions: any[];
  recentAcSubmissions: any[];
}

// GraphQL queries
const USER_PROFILE_QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      aboutMe
      userAvatar
      ranking
      reputation
      websites
      countryName
      company
      school
      starRating
      skillTags
      location
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    badges {
      id
      name
      shortName
      displayName
      icon 
      hoverText
      medal {
        slug
        config {
          iconGif
          iconGifBackground
        }
      }
      creationDate
      category
    }
    upcomingBadges {
      name
      icon
      progress
    }
    activeBadge {
      id
    }
  }
}
`;

// Uncomment if using contest data in the future
/*
const USER_CONTEST_QUERY = `
query getUserContestInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
`;
*/

const USER_CALENDAR_QUERY = `
query getUserCalendar($username: String!) {
  matchedUser(username: $username) {
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}
`;

const USER_SOLVED_PROBLEMS_QUERY = `
query getUserSolvedProblems($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
  recentAcSubmissionList(username: $username, limit: 15) {
    id
    title
    titleSlug
    timestamp
    statusDisplay
    lang
  }
}
`;

const PROBLEM_LIST_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      questionId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      topicTags {
        name
        id
        slug
      }
      hasSolution
      hasVideoSolution
    }
  }
}
`;

/**
 * Fetch user profile and progress data from LeetCode
 * @param username LeetCode username
 * @returns User profile, progress data, and recent submissions
 */
export const fetchLeetCodeUserData = async (username: string): Promise<LeetCodeUserData> => {
  try {
    console.log("Fetching LeetCode data for username:", username);
    
    // Fetch user profile
    const profileResponse = await fetchFromLeetCode(USER_PROFILE_QUERY, { username });
    console.log("Profile response:", profileResponse);
    
    if (!profileResponse.data || !profileResponse.data.matchedUser) {
      console.error("No user data returned from LeetCode API");
      throw new Error(`Username '${username}' not found on LeetCode. Please check your username again.`);
    }
    
    const calendarResponse = await fetchFromLeetCode(USER_CALENDAR_QUERY, { username });
    const solvedProblemsResponse = await fetchFromLeetCode(USER_SOLVED_PROBLEMS_QUERY, { username });
    
    // Parse submission calendar (convert string to object)
    const submissionCalendarStr = calendarResponse.data?.matchedUser?.userCalendar?.submissionCalendar;
    const submissionCalendar = submissionCalendarStr ? JSON.parse(submissionCalendarStr) : {};
    
    // Extract profile data
    const userData = profileResponse.data.matchedUser;
    const submitStats = userData.submitStats;
    
    // Calculate progress stats
    const acSubmissionNums = submitStats.acSubmissionNum;
    const totalSubmissionNums = submitStats.totalSubmissionNum;
    
    const totalSolved = acSubmissionNums.reduce((sum: number, item: any) => 
      sum + (item.difficulty !== 'All' ? item.count : 0), 0);
    
    const totalQuestions = solvedProblemsResponse.data.allQuestionsCount.reduce(
      (sum: number, item: any) => sum + (item.difficulty !== 'All' ? item.count : 0), 0
    );
    
    // Find submission stats by difficulty
    const findByDifficulty = (arr: any[], diff: string) => 
      arr.find((item: any) => item.difficulty === diff) || { count: 0 };
      
    const easySolved = findByDifficulty(acSubmissionNums, 'Easy').count;
    const easyTotal = solvedProblemsResponse.data.allQuestionsCount.find(
      (item: any) => item.difficulty === 'Easy'
    ).count;
    
    const mediumSolved = findByDifficulty(acSubmissionNums, 'Medium').count;
    const mediumTotal = solvedProblemsResponse.data.allQuestionsCount.find(
      (item: any) => item.difficulty === 'Medium'
    ).count;
    
    const hardSolved = findByDifficulty(acSubmissionNums, 'Hard').count;
    const hardTotal = solvedProblemsResponse.data.allQuestionsCount.find(
      (item: any) => item.difficulty === 'Hard'
    ).count;
    
    // Calculate acceptance rate
    const totalSubmissions = totalSubmissionNums.find(
      (item: any) => item.difficulty === 'All'
    ).submissions;
    
    const totalAccepted = acSubmissionNums.find(
      (item: any) => item.difficulty === 'All'
    ).submissions;
    
    const acceptanceRate = totalSubmissions > 0 
      ? (totalAccepted / totalSubmissions) * 100 
      : 0;
    
    // Extract recent submissions
    const recentAcSubmissions = solvedProblemsResponse.data.recentAcSubmissionList;
    
    return {
      profile: {
        username: userData.username,
        realName: userData.profile.realName,
        aboutMe: userData.profile.aboutMe,
        userAvatar: userData.profile.userAvatar,
        ranking: userData.profile.ranking,
        reputation: userData.profile.reputation,
        githubUrl: '', // Social URLs no longer available in API
        linkedinUrl: '',
        twitterUrl: '',
        websiteUrl: userData.profile.websites?.[0] || '',
      },
      progress: {
        totalSolved,
        totalQuestions,
        totalEasy: easyTotal,
        totalMedium: mediumTotal,
        totalHard: hardTotal,
        easySolved,
        easyTotal,
        mediumSolved,
        mediumTotal,
        hardSolved,
        hardTotal,
        acceptanceRate,
        ranking: userData.profile.ranking,
      },
      submissionCalendar,
      recentSubmissions: [],
      recentAcSubmissions,
    };
  } catch (error) {
    console.error('Error fetching LeetCode user data:', error);
    throw new Error('Failed to fetch LeetCode user data');
  }
};

/**
 * Fetch problem list from LeetCode
 * @param filters Filter criteria
 * @param limit Number of problems to fetch
 * @param skip Number of problems to skip
 * @returns List of problems matching the criteria
 */
export const fetchLeetCodeProblems = async (
  filters: { 
    difficulty?: string; 
    status?: string; 
    tags?: string[]; 
    searchQuery?: string;
  } = {},
  limit = 50,
  skip = 0
): Promise<{ total: number; problems: LeetCodeProblem[] }> => {
  try {
    const filterParams: any = {};
    
    if (filters.difficulty) {
      filterParams.difficulty = filters.difficulty;
    }
    
    if (filters.status) {
      filterParams.status = filters.status;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filterParams.tags = filters.tags;
    }
    
    if (filters.searchQuery) {
      filterParams.searchQuery = filters.searchQuery;
    }
    
    const response = await fetchFromLeetCode(PROBLEM_LIST_QUERY, {
      categorySlug: '',
      limit,
      skip,
      filters: filterParams,
    });
    
    const { total, questions } = response.data.problemsetQuestionList;
    
    return {
      total,
      problems: questions.map((q: any) => ({
        id: q.questionId,
        frontendId: q.frontendQuestionId,
        title: q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty,
        status: q.status,
        isPaidOnly: q.paidOnly,
        topicTags: q.topicTags.map((tag: any) => tag.name),
        acRate: q.acRate,
        totalSubmissionCount: 0, // Not available in this query
        totalAcceptedCount: 0, // Not available in this query
      })),
    };
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error);
    throw new Error('Failed to fetch LeetCode problems');
  }
};

/**
 * NOTE: Social media URLs are no longer available in the LeetCode API
 * This function is kept for reference but is no longer used
 */
// const extractSocialUrl = (socialAccounts: any[] | null, provider: string): string => {
//   if (!socialAccounts) return '';
//   const account = socialAccounts.find((acc: any) => acc.provider === provider);
//   return account ? account.profileUrl : '';
// };

/**
 * Helper function to make GraphQL requests to LeetCode
 */
const fetchFromLeetCode = async (query: string, variables: any) => {
  try {
    console.log(`Fetching LeetCode API for user: ${variables.username || "unknown"}`);
    
    // Add a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    // Create the fetch headers and body based on our successful curl test
    const headers = {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'Origin': 'https://leetcode.com',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    };
    
    const body = JSON.stringify({
      query,
      variables,
    });
    
    // Try using the proxy server first, which is more reliable
    let response;
    try {
      console.log("Using local proxy server for LeetCode API...");
      response = await fetch(LEETCODE_PROXY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });
    } catch (proxyError) {
      // Fallback to direct API only if proxy fails
      console.log("Proxy server failed, trying direct LeetCode API access...");
      response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers,
        body,
        mode: 'cors',
        signal: controller.signal,
      });
    }
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`LeetCode API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for errors in the GraphQL response
    if (data.errors) {
      // Some common LeetCode GraphQL errors
      if (data.errors.some((e: { message?: string }) => e.message?.includes('not found'))) {
        throw new Error(`Username ${variables.username} not found on LeetCode. Please check spelling.`);
      }
      
      throw new Error(data.errors.map((e: { message?: string }) => e.message).join(', '));
    }
    
    // Validate that we got actual user data
    if (query.includes('matchedUser') && !data.data.matchedUser) {
      throw new Error(`Could not find user ${variables.username} on LeetCode.`);
    }
    
    return data;
  } catch (error: any) {
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request to LeetCode timed out. Please try again later.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to LeetCode API. Please check your internet connection.');
    }
    
    // Pass through our custom errors
    console.error('Error in LeetCode API request:', error);
    throw error;
  }
};

export default {
  fetchLeetCodeUserData,
  fetchLeetCodeProblems
};
