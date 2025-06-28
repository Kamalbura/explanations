# 🎯 GREEDY ALGORITHMS: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: OPTIMAL LOCAL CHOICES**

Greedy Algorithms make **locally optimal choices** at each step, hoping to find a **globally optimal solution**. The key insight is that for certain problems, local optimality leads to global optimality.

### **The Greedy Mindset:**
```
At each step: Make the best choice available RIGHT NOW
→ Never reconsider previous choices
→ Build solution incrementally
→ Key: Prove that local optimal → global optimal
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Greedy Choice Property:**
```
A problem has greedy choice property if:
1. A globally optimal solution can be reached by making locally optimal choices
2. The choice made by greedy algorithm is safe (part of some optimal solution)
3. After making the greedy choice, the remaining subproblem has the same structure

Mathematical Proof Pattern:
1. Greedy stays ahead: Prove greedy is never worse than optimal
2. Exchange argument: Transform any optimal solution to greedy solution
```

### **When Greedy Works vs Fails:**
```
✅ WORKS: When problem has optimal substructure + greedy choice property
❌ FAILS: When local optimal ≠ global optimal (like 0/1 Knapsack)

Classic Example:
Making change with coins [1, 5, 10, 25]
Greedy: Always pick largest coin ≤ remaining amount
Result: Optimal for this coin system
```

---

## 🎨 **PATTERN TYPES & TEMPLATES**

### **Pattern 1: Activity Selection/Interval Scheduling**
**Use Case**: Non-overlapping intervals, meeting rooms, job scheduling
```cpp
// Template: Maximum Non-overlapping Intervals
struct Interval {
    int start, end;
    bool operator<(const Interval& other) const {
        return end < other.end; // Sort by end time
    }
};

int maxNonOverlapping(vector<Interval>& intervals) {
    sort(intervals.begin(), intervals.end());
    
    int count = 0;
    int lastEnd = INT_MIN;
    
    for (const auto& interval : intervals) {
        if (interval.start >= lastEnd) {
            count++;
            lastEnd = interval.end;
        }
    }
    
    return count;
}
```
**Key Insight**: Choose activity that finishes earliest

### **Pattern 2: Huffman Coding/Minimum Cost**
**Use Case**: Optimal merging, minimum cost problems
```cpp
// Template: Minimum Cost to Connect Sticks
int connectSticks(vector<int>& sticks) {
    priority_queue<int, vector<int>, greater<int>> minHeap(sticks.begin(), sticks.end());
    
    int totalCost = 0;
    
    while (minHeap.size() > 1) {
        int first = minHeap.top(); minHeap.pop();
        int second = minHeap.top(); minHeap.pop();
        
        int cost = first + second;
        totalCost += cost;
        
        minHeap.push(cost);
    }
    
    return totalCost;
}
```
**Key Insight**: Always merge smallest elements first

### **Pattern 3: Fractional Knapsack**
**Use Case**: Maximize value/weight ratio problems
```cpp
// Template: Fractional Knapsack
struct Item {
    int value, weight;
    double ratio;
    
    Item(int v, int w) : value(v), weight(w), ratio((double)v/w) {}
    
    bool operator<(const Item& other) const {
        return ratio > other.ratio; // Sort by ratio descending
    }
};

double fractionalKnapsack(int W, vector<Item>& items) {
    sort(items.begin(), items.end());
    
    double totalValue = 0.0;
    int remainingWeight = W;
    
    for (const auto& item : items) {
        if (remainingWeight >= item.weight) {
            totalValue += item.value;
            remainingWeight -= item.weight;
        } else {
            totalValue += item.value * ((double)remainingWeight / item.weight);
            break;
        }
    }
    
    return totalValue;
}
```
**Key Insight**: Pick highest value-to-weight ratio first

---

## 🔍 **PROBLEM RECOGNITION PATTERNS**

### **Pattern Recognition Table:**
| **Problem Statement** | **Greedy Strategy** | **Sorting Key** |
|----------------------|-------------------|-----------------|
| "Maximum non-overlapping intervals" | Pick earliest ending | End time |
| "Minimum cost to merge/connect" | Always merge smallest | Min heap |
| "Maximize value within weight limit" | Highest value/weight ratio | Ratio descending |
| "Gas station circuit" | Start from station with surplus | None (single pass) |
| "Jump game" | Maximize reach at each step | None (track max reach) |
| "Meeting rooms" | Earliest ending time | End time |

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Meeting Rooms II (Minimum Rooms)**
```cpp
// Problem: Minimum number of meeting rooms required
int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    // Separate start and end times
    vector<int> starts, ends;
    for (const auto& interval : intervals) {
        starts.push_back(interval[0]);
        ends.push_back(interval[1]);
    }
    
    // Sort both arrays
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    
    int rooms = 0, endPtr = 0;
    
    for (int start : starts) {
        if (start >= ends[endPtr]) {
            endPtr++; // A meeting ended, can reuse room
        } else {
            rooms++; // Need new room
        }
    }
    
    return rooms;
}

// Time: O(n log n), Space: O(n)
// Greedy Insight: Use room as soon as any meeting ends
```

### **Example 2: Gas Station Circuit**
```cpp
// Problem: Can complete circuit starting from some gas station
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalTank = 0, currentTank = 0, startingStation = 0;
    
    for (int i = 0; i < gas.size(); i++) {
        int netGas = gas[i] - cost[i];
        
        totalTank += netGas;
        currentTank += netGas;
        
        // If current tank becomes negative, start from next station
        if (currentTank < 0) {
            startingStation = i + 1;
            currentTank = 0;
        }
    }
    
    return totalTank >= 0 ? startingStation : -1;
}

// Time: O(n), Space: O(1)
// Greedy Insight: If we can't reach station i from start, 
// then we can't reach station i from any station before i
```

### **Example 3: Jump Game II (Minimum Jumps)**
```cpp
// Problem: Minimum jumps to reach end of array
int jump(vector<int>& nums) {
    if (nums.size() <= 1) return 0;
    
    int jumps = 0;
    int currentEnd = 0;    // Farthest we can reach with current jumps
    int farthest = 0;      // Farthest we can reach with one more jump
    
    for (int i = 0; i < nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        
        // If we've reached the end of current jump range
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            // Early termination
            if (currentEnd >= nums.size() - 1) break;
        }
    }
    
    return jumps;
}

// Time: O(n), Space: O(1)
// Greedy Insight: Always jump to position that maximizes future reach
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Greedy with Sorting**
```cpp
// Problem: Assign Cookies (maximize satisfied children)
int findContentChildren(vector<int>& children, vector<int>& cookies) {
    sort(children.begin(), children.end());
    sort(cookies.begin(), cookies.end());
    
    int childPtr = 0, cookiePtr = 0;
    
    while (childPtr < children.size() && cookiePtr < cookies.size()) {
        if (cookies[cookiePtr] >= children[childPtr]) {
            childPtr++; // Child satisfied
        }
        cookiePtr++; // Move to next cookie
    }
    
    return childPtr;
}

// Greedy Strategy: Give smallest satisfying cookie to each child
```

### **Technique 2: Greedy with Heap**
```cpp
// Problem: Task Scheduler (minimize idle time)
int leastInterval(vector<char>& tasks, int n) {
    unordered_map<char, int> freq;
    for (char task : tasks) freq[task]++;
    
    // Max heap by frequency
    priority_queue<int> maxHeap;
    for (auto& p : freq) maxHeap.push(p.second);
    
    int time = 0;
    
    while (!maxHeap.empty()) {
        vector<int> temp;
        int cycle = 0;
        
        // Process up to n+1 tasks in current cycle
        for (int i = 0; i < n + 1 && (!maxHeap.empty() || !temp.empty()); i++) {
            if (!maxHeap.empty()) {
                int taskCount = maxHeap.top();
                maxHeap.pop();
                
                if (taskCount > 1) {
                    temp.push_back(taskCount - 1);
                }
            }
            cycle++;
        }
        
        // Add remaining tasks back to heap
        for (int count : temp) {
            maxHeap.push(count);
        }
        
        time += cycle;
    }
    
    return time;
}

// Greedy Strategy: Always schedule most frequent task first
```

### **Technique 3: Greedy Proof by Exchange**
```cpp
// Problem: Minimum number of platforms needed
int findPlatform(vector<int>& arr, vector<int>& dep) {
    sort(arr.begin(), arr.end());
    sort(dep.begin(), dep.end());
    
    int platforms = 1, result = 1;
    int i = 1, j = 0; // i for arrivals, j for departures
    
    while (i < arr.size() && j < dep.size()) {
        if (arr[i] <= dep[j]) {
            platforms++;
            i++;
        } else {
            platforms--;
            j++;
        }
        
        result = max(result, platforms);
    }
    
    return result;
}

// Proof: At any time, we need platforms = arrivals - departures so far
// Greedy gives optimal because we allocate exactly when needed
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Early Termination**
```cpp
// In interval problems, stop when no more intervals can fit
if (currentEnd >= maxPossibleEnd) break;

// In jumping problems, stop when target is reachable
if (farthest >= target) break;
```

### **Strategy 2: Preprocessing for Optimal Greedy Choice**
```cpp
// Sort by appropriate key before applying greedy
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    return a.end < b.end; // Sort by end time for interval scheduling
});
```

### **Strategy 3: State Compression**
```cpp
// Instead of storing complex states, track only essential information
int currentEnd = 0;    // Only need current boundary
int farthest = 0;      // Only need maximum reachable position
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Identify Greedy Nature (1 minute)**
- Can local optimal lead to global optimal?
- Is there an obvious "best choice" at each step?
- Does problem involve optimization (min/max)?

### **Step 2: Find Greedy Strategy (2 minutes)**
```cpp
// Common greedy strategies:
if (problem_involves_intervals) 
    strategy = "sort by end time, pick earliest ending";

if (problem_involves_weights_values)
    strategy = "sort by value/weight ratio";

if (problem_involves_merging_costs)
    strategy = "always merge smallest elements";

if (problem_involves_scheduling)
    strategy = "sort by deadline or duration";
```

### **Step 3: Prove Correctness (Optional in interview)**
1. **Greedy Choice Property**: Show local optimal is safe
2. **Optimal Substructure**: Show subproblem remains optimal
3. **Exchange Argument**: Transform any optimal to greedy

### **Step 4: Implementation (10-12 minutes)**
1. Sort input if needed
2. Apply greedy choice iteratively
3. Track necessary state
4. Handle edge cases

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong Sorting Key**
```cpp
// ❌ Wrong: Sort by start time for interval scheduling
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    return a.start < b.start; // This doesn't work!
});

// ✅ Correct: Sort by end time
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    return a.end < b.end; // This ensures optimality
});
```

### **Pitfall 2: Greedy Doesn't Work for This Problem**
```cpp
// ❌ Wrong: Using greedy for 0/1 Knapsack
// Greedy (by value/weight ratio) doesn't give optimal solution

// ✅ Correct: Recognize when DP is needed
// Use greedy only for fractional knapsack
```

### **Pitfall 3: Not Handling Edge Cases**
```cpp
// ❌ Wrong: No empty input check
int minRooms(vector<vector<int>>& intervals) {
    // What if intervals is empty?
    sort(intervals.begin(), intervals.end());
    // ...
}

// ✅ Correct: Always check edge cases
int minRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    if (intervals.size() == 1) return 1;
    // Now safe to proceed
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **With Sorting**: O(n log n) - dominated by sorting step
- **With Heap**: O(n log k) - where k is heap size
- **Simple Greedy**: O(n) - single pass through data
- **Multiple Passes**: O(kn) - where k is number of passes

### **Space Complexity:**
- **In-place Sorting**: O(1) auxiliary space
- **With Heap**: O(k) - heap size
- **With Extra Arrays**: O(n) - for preprocessing

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Greedy Algorithms when you can:

- [ ] **Identify greedy nature** from problem description quickly
- [ ] **Choose correct sorting strategy** based on problem type
- [ ] **Prove greedy choice property** (at least informally)
- [ ] **Implement efficiently** with optimal time complexity
- [ ] **Handle edge cases** without bugs
- [ ] **Recognize when greedy fails** and switch to DP
- [ ] **Combine with other techniques** (heap, sorting, two pointers)

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **State the Greedy Strategy**: "I'll use greedy by always choosing..."
2. **Justify Why It Works**: "This works because local optimal leads to global optimal"
3. **Consider Counterexamples**: "Let me verify this works for edge cases"
4. **Implement Cleanly**: Use clear variable names and modular code
5. **Analyze Complexity**: State time/space complexity clearly
6. **Test Edge Cases**: Empty input, single element, no solution cases

---

## 🧮 **COMMON GREEDY PROBLEMS BY CATEGORY**

### **Interval Scheduling:**
- Meeting Rooms I & II
- Non-overlapping Intervals
- Minimum Number of Arrows to Burst Balloons

### **Optimization:**
- Gas Station
- Jump Game I & II
- Task Scheduler
- Fractional Knapsack

### **Greedy Construction:**
- Huffman Coding
- Minimum Cost to Connect Sticks
- Reorganize String

---

**🎯 Master Greedy Algorithms and you'll solve optimization problems with mathematical elegance!**
