# 🧠 DSA Mastery Hub

A modern React application for tracking your Data Structures and Algorithms learning journey, now with LeetCode integration!

## 🚀 Features

### 📊 Dashboard
- **Real-time LeetCode Progress**: Connect your LeetCode account to track your actual problem-solving stats
- **Study Streaks**: Track consecutive study days  
- **Time Management**: Log study hours and time spent per problem
- **Current Focus**: See your current study iteration (Tree Algorithms, etc.)

### 🔍 Problem Browser
- **LeetCode API Integration**: Browse your solved LeetCode problems with real-time stats
- **Smart Filtering**: Filter by difficulty, category, status, platform
- **Progress Tracking**: See your actual LeetCode completion rates
- **Search Functionality**: Find problems by title, tags, or category

### 📚 Theory & Concepts Viewer
- **Markdown Rendering**: Read theory explanations from your existing `.md` files
- **Category Organization**: Browse by Arrays, Trees, Graphs, DP, etc.
- **Reading Progress**: Mark topics as read
- **Interactive Navigation**: Jump between related concepts

### 📈 Analytics Dashboard
- **LeetCode Performance**: See your actual solve rate and difficulty distribution
- **Visual Charts**: Bar charts, pie charts, trend lines
- **Weekly/Monthly Views**: Track progress over time
- **Personalized Insights**: Based on your actual LeetCode stats

### 💻 Code Editor
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, Go
- **Monaco Editor**: VS Code-like editing experience
- **Theme Options**: Dark, light, high contrast themes
- **Code Saving**: Export solutions to files

## 🛠️ Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Monaco Editor** for code editing
- **React Markdown** for rendering theory content
- **Recharts** for analytics visualization
- **LeetCode API** for real progress tracking
- **Express** for content and proxy server

## 🚀 Getting Started

### Using VS Code Tasks (Recommended)

The easiest way to get started is by using the VS Code tasks:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Run Task" and select "Tasks: Run Task"
3. Select "Start DSA Tracker (Both Servers)"

This will start both the React app and the content/proxy server in parallel. You can also run each service individually by selecting either "Start Vite Dev Server" or "Start Content Server" tasks.

### Manual Start

1. **Install Dependencies**:
   ```bash
   cd dsa-tracker-react
   npm install
   ```

2. **Start Both Servers at Once**:
   ```bash
   cd dsa-tracker-react
   npm run start
   ```
   This will start both the React app and the content/proxy server in parallel.

3. **Or Start Servers Individually**:
   
   **Start Development Server** (in one terminal):
   ```bash
   cd dsa-tracker-react
   npm run dev
   ```

   **Start Content & Proxy Server** (in a separate terminal):
   ```bash
   cd dsa-tracker-react
   npm run server
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:5173`

## 🔄 LeetCode Integration

This application now features LeetCode integration through their GraphQL API:

1. **Connect Your Account**: Click "Connect LeetCode Account" in the sidebar or navigate to `/leetcode/login`

2. **Enter Your LeetCode Username**: Type your LeetCode username (no password needed, only public data is accessed)

3. **View Your Data**: Once connected, your real LeetCode stats will be displayed on the Dashboard and LeetCode page

4. **Problem Browser**: Browse all LeetCode problems and see which ones you've completed

5. **Code Editor**: Practice problems directly in the integrated Monaco editor

6. **Analytics**: View detailed statistics about your LeetCode performance

## 📦 Performance Optimizations

The app includes several optimizations to improve performance:

1. **Local Proxy Server**: A proxy server to bypass CORS issues and add caching
2. **Response Caching**: LeetCode API responses are cached for 5 minutes
3. **Loading States**: Visual feedback during data fetching
4. **Lazy Loading**: Components load only when needed
5. **Data Prefetching**: Key data is loaded in the background

## 🎯 Integration with Your DSA Collections

This app works with your existing folder structure:

```
prep/
├── DSA_Approaches/
│   └── explanations/         # Theory markdown files
├── leetcode/                 # LeetCode solutions
├── neetcode-patterns/        # NeetCode problems
├── neetcode150/             # NeetCode 150 collection
├── striver-a2z-dsa-cpp/     # Striver's A2Z DSA
└── LeetCode-Blind-75/       # Blind 75 problems
```

## ⚙️ How the LeetCode Integration Works

The app uses the unofficial LeetCode GraphQL API to fetch:

- Your profile information
- Problem-solving statistics
- Recent submissions
- Daily activity data

The proxy server helps bypass CORS restrictions and provides caching to speed up requests. This enables a smooth experience even with the 10-second API response times.

**Data Privacy Note**: Only public LeetCode profile data is accessed. No passwords or private information are stored.

## 📊 Next Steps

🚧 **Planned Features:**
- Code submission directly to LeetCode
- Integration with more online judges (CodeForces, HackerRank, etc.)
- Customizable study plans based on your performance
- Advanced analytics and recommendation algorithms
- Social features for sharing progress with study groups

---

**Happy Coding!** 🚀 Master those algorithms and ace your interviews!
