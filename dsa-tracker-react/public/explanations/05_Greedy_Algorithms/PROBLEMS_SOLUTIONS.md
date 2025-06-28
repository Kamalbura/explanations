# 🎯 GREEDY ALGORITHMS: PROBLEMS & SOLUTIONS

## 📋 **PROBLEM CATEGORIES**

### **CATEGORY 1: INTERVAL SCHEDULING**

---

### **Problem 1: Meeting Rooms (LeetCode 252)**
**Difficulty**: Easy  
**Pattern**: Interval Scheduling

```cpp
// Problem: Given intervals, determine if person can attend all meetings
bool canAttendMeetings(vector<vector<int>>& intervals) {
    if (intervals.size() <= 1) return true;
    
    // Sort by start time
    sort(intervals.begin(), intervals.end());
    
    for (int i = 1; i < intervals.size(); i++) {
        // Check if current meeting starts before previous ends
        if (intervals[i][0] < intervals[i-1][1]) {
            return false; // Overlap detected
        }
    }
    
    return true;
}

// Time: O(n log n), Space: O(1)
// Greedy Strategy: Sort by start time, check consecutive overlaps
```

**Key Insights:**
- Sort by start time to check overlaps efficiently
- Only need to check consecutive intervals
- Single pass after sorting gives answer

---

### **Problem 2: Meeting Rooms II (LeetCode 253)**
**Difficulty**: Medium  
**Pattern**: Resource Allocation

```cpp
// Method 1: Two Pointers (Most Intuitive)
int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    vector<int> starts, ends;
    for (const auto& interval : intervals) {
        starts.push_back(interval[0]);
        ends.push_back(interval[1]);
    }
    
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    
    int rooms = 0, endPtr = 0;
    
    for (int start : starts) {
        if (start >= ends[endPtr]) {
            endPtr++; // Meeting ended, reuse room
        } else {
            rooms++; // Need new room
        }
    }
    
    return rooms;
}

// Method 2: Min Heap (Also Good)
int minMeetingRoomsHeap(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> minHeap; // End times
    
    for (const auto& interval : intervals) {
        if (!minHeap.empty() && minHeap.top() <= interval[0]) {
            minHeap.pop(); // Room becomes available
        }
        minHeap.push(interval[1]); // Assign room
    }
    
    return minHeap.size();
}

// Time: O(n log n), Space: O(n)
// Greedy Strategy: Always reuse earliest available room
```

**Key Insights:**
- Track when rooms become available
- Greedy reuse of earliest available room is optimal
- Two methods: sorting start/end separately vs heap

---

### **Problem 3: Non-overlapping Intervals (LeetCode 435)**
**Difficulty**: Medium  
**Pattern**: Maximum Independent Set

```cpp
// Problem: Remove minimum intervals to make rest non-overlapping
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.size() <= 1) return 0;
    
    // Sort by end time (CRITICAL!)
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1];
    });
    
    int count = 0; // Intervals to remove
    int lastEnd = intervals[0][1];
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < lastEnd) {
            // Overlap detected - remove current interval
            count++;
            // Keep the one with earlier end time (already done by sorting)
        } else {
            // No overlap, update lastEnd
            lastEnd = intervals[i][1];
        }
    }
    
    return count;
}

// Time: O(n log n), Space: O(1)
// Greedy Strategy: Always keep interval with earliest end time
```

**Key Insights:**
- Sorting by end time is crucial (not start time!)
- Keep intervals with earliest end time to maximize future choices
- Classic application of activity selection problem

---

### **CATEGORY 2: OPTIMIZATION PROBLEMS**

---

### **Problem 4: Gas Station (LeetCode 134)**
**Difficulty**: Medium  
**Pattern**: Circuit Optimization

```cpp
// Problem: Find starting gas station to complete circuit
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalTank = 0, currentTank = 0;
    int startingStation = 0;
    
    for (int i = 0; i < gas.size(); i++) {
        int netGas = gas[i] - cost[i];
        
        totalTank += netGas;
        currentTank += netGas;
        
        // If we can't reach next station from current path
        if (currentTank < 0) {
            startingStation = i + 1; // Start fresh from next station
            currentTank = 0;
        }
    }
    
    // Circuit possible only if total gas >= total cost
    return totalTank >= 0 ? startingStation : -1;
}

// Time: O(n), Space: O(1)
// Greedy Insight: If we can't reach station i from start, 
// we can't reach it from any station between start and i
```

**Proof of Correctness:**
```
If stations 0 to i-1 can't reach station i:
- Any intermediate station j has even less accumulated gas
- Starting from j would fail even earlier
- Therefore, must start from station i+1 or later
```

---

### **Problem 5: Jump Game II (LeetCode 45)**
**Difficulty**: Medium  
**Pattern**: Greedy BFS

```cpp
// Problem: Minimum jumps to reach end
int jump(vector<int>& nums) {
    if (nums.size() <= 1) return 0;
    
    int jumps = 0;
    int currentEnd = 0;    // Farthest reachable with current jumps
    int farthest = 0;      // Farthest reachable with one more jump
    
    // Don't need to jump from last position
    for (int i = 0; i < nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        
        // Reached end of current jump range
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            // Early termination optimization
            if (currentEnd >= nums.size() - 1) break;
        }
    }
    
    return jumps;
}

// Time: O(n), Space: O(1)
// Greedy Strategy: Use BFS-like approach, jump when current range exhausted
```

**Visual Understanding:**
```
nums = [2,3,1,1,4]
Jump 1: From index 0, can reach [1,2] (farthest = 2)
Jump 2: From range [1,2], can reach up to index 4 (farthest = 4)
Result: 2 jumps
```

---

### **Problem 6: Task Scheduler (LeetCode 621)**
**Difficulty**: Medium  
**Pattern**: Frequency-based Greedy

```cpp
// Problem: Minimum time to execute tasks with cooldown
int leastInterval(vector<char>& tasks, int n) {
    // Count frequencies
    vector<int> freq(26, 0);
    for (char task : tasks) {
        freq[task - 'A']++;
    }
    
    // Find max frequency and count of max frequency tasks
    int maxFreq = *max_element(freq.begin(), freq.end());
    int maxFreqCount = 0;
    for (int f : freq) {
        if (f == maxFreq) maxFreqCount++;
    }
    
    // Calculate minimum time needed
    int partCount = maxFreq - 1;
    int partLength = n - (maxFreqCount - 1);
    int emptySlots = partCount * partLength;
    int availableTasks = tasks.size() - maxFreq * maxFreqCount;
    int idles = max(0, emptySlots - availableTasks);
    
    return tasks.size() + idles;
}

// Alternative: Simulation approach
int leastIntervalSimulation(vector<char>& tasks, int n) {
    unordered_map<char, int> freq;
    for (char task : tasks) freq[task]++;
    
    priority_queue<int> maxHeap;
    for (auto& p : freq) maxHeap.push(p.second);
    
    int time = 0;
    
    while (!maxHeap.empty()) {
        vector<int> temp;
        
        // Execute up to n+1 tasks in current cycle
        for (int i = 0; i < n + 1; i++) {
            if (!maxHeap.empty()) {
                int taskCount = maxHeap.top();
                maxHeap.pop();
                
                if (taskCount > 1) {
                    temp.push_back(taskCount - 1);
                }
                time++;
            } else if (!temp.empty()) {
                time++; // Idle time
            }
        }
        
        // Add remaining tasks back
        for (int count : temp) {
            maxHeap.push(count);
        }
    }
    
    return time;
}

// Time: O(n), Space: O(1) for formula approach
// Greedy Strategy: Schedule most frequent tasks first with proper spacing
```

---

### **CATEGORY 3: CONSTRUCTIVE GREEDY**

---

### **Problem 7: Assign Cookies (LeetCode 455)**
**Difficulty**: Easy  
**Pattern**: Bipartite Matching

```cpp
// Problem: Maximize number of content children
int findContentChildren(vector<int>& children, vector<int>& cookies) {
    sort(children.begin(), children.end());
    sort(cookies.begin(), cookies.end());
    
    int childPtr = 0, cookiePtr = 0;
    
    while (childPtr < children.size() && cookiePtr < cookies.size()) {
        if (cookies[cookiePtr] >= children[childPtr]) {
            childPtr++; // Child is satisfied
        }
        cookiePtr++; // Move to next cookie regardless
    }
    
    return childPtr; // Number of satisfied children
}

// Time: O(n log n + m log m), Space: O(1)
// Greedy Strategy: Give smallest sufficient cookie to each child
```

---

### **Problem 8: Minimum Number of Arrows (LeetCode 452)**
**Difficulty**: Medium  
**Pattern**: Interval Intersection

```cpp
// Problem: Minimum arrows to burst all balloons
int findMinArrowShots(vector<vector<int>>& points) {
    if (points.empty()) return 0;
    
    // Sort by end coordinate
    sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1];
    });
    
    int arrows = 1;
    int arrowPos = points[0][1]; // Shoot at end of first balloon
    
    for (int i = 1; i < points.size(); i++) {
        // If current balloon starts after arrow position
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1]; // Shoot at end of current balloon
        }
    }
    
    return arrows;
}

// Time: O(n log n), Space: O(1)
// Greedy Strategy: Shoot arrow at rightmost position of overlapping balloons
```

---

### **CATEGORY 4: ADVANCED GREEDY**

---

### **Problem 9: Candy (LeetCode 135)**
**Difficulty**: Hard  
**Pattern**: Two-pass Greedy

```cpp
// Problem: Minimum candies to distribute based on ratings
int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> candies(n, 1); // Everyone gets at least 1 candy
    
    // Left to right pass: handle increasing sequences
    for (int i = 1; i < n; i++) {
        if (ratings[i] > ratings[i-1]) {
            candies[i] = candies[i-1] + 1;
        }
    }
    
    // Right to left pass: handle decreasing sequences
    for (int i = n-2; i >= 0; i--) {
        if (ratings[i] > ratings[i+1]) {
            candies[i] = max(candies[i], candies[i+1] + 1);
        }
    }
    
    return accumulate(candies.begin(), candies.end(), 0);
}

// Time: O(n), Space: O(n)
// Greedy Strategy: Two passes to handle both directions of constraints
```

**Why Two Passes Work:**
```
First pass ensures: ratings[i] > ratings[i-1] → candies[i] > candies[i-1]
Second pass ensures: ratings[i] > ratings[i+1] → candies[i] > candies[i+1]
Combined: Both constraints satisfied with minimum candies
```

---

### **Problem 10: Remove K Digits (LeetCode 402)**
**Difficulty**: Medium  
**Pattern**: Monotonic Stack + Greedy

```cpp
// Problem: Remove k digits to make smallest possible number
string removeKdigits(string num, int k) {
    string result = "";
    
    for (char digit : num) {
        // Remove larger digits from end while we can
        while (!result.empty() && result.back() > digit && k > 0) {
            result.pop_back();
            k--;
        }
        result.push_back(digit);
    }
    
    // Remove remaining digits from end if k > 0
    while (k > 0) {
        result.pop_back();
        k--;
    }
    
    // Remove leading zeros
    int start = 0;
    while (start < result.size() && result[start] == '0') {
        start++;
    }
    
    result = result.substr(start);
    return result.empty() ? "0" : result;
}

// Time: O(n), Space: O(n)
// Greedy Strategy: Always remove larger digit when possible
```

---

## 🎯 **PROBLEM SOLVING PATTERNS**

### **Pattern Identification Guide:**

1. **Interval Problems** → Sort by end time, pick non-overlapping
2. **Resource Allocation** → Use heap or two pointers  
3. **Path/Circuit Problems** → Track cumulative sums
4. **Frequency Problems** → Sort by frequency, schedule optimally
5. **Digit/String Problems** → Use monotonic stack approach

### **Common Mistakes to Avoid:**

1. **Wrong Sorting Key** - Always verify which attribute to sort by
2. **Missing Edge Cases** - Empty input, single element, no solution
3. **Greedy Doesn't Apply** - Some problems need DP (0/1 Knapsack)
4. **Off-by-one Errors** - Careful with index boundaries
5. **Not Proving Correctness** - At least convince yourself why greedy works

---

**🎯 Practice these problems in order, understand the greedy strategy for each, and you'll master greedy algorithms!**
