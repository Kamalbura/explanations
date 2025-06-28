# 🎯 SLIDING WINDOW: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: WINDOW OPTIMIZATION**

Sliding Window is about **maintaining a dynamic window** over data to solve subarray/substring problems in optimal time, avoiding nested loops through intelligent window expansion and contraction.

### **The Sliding Window Mindset:**
```
Instead of checking all subarrays O(n³) or O(n²)
→ Maintain a window with desired properties O(n)
→ Expand when beneficial, contract when necessary
→ Track optimal result during the process
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Why Sliding Window Works:**
```
Brute Force All Subarrays: n×(n+1)/2 = O(n²) subarrays
Each subarray validation: O(k) on average
Total: O(n²×k) = O(n³) for string problems

Sliding Window: Each element added once, removed once
Total operations: 2n = O(n)
Speedup: From cubic to linear!

Example with n=1000:
Brute Force: ~1 billion operations
Sliding Window: ~2,000 operations
Speedup: 500,000x faster!
```

---

## 🎨 **PATTERN TYPES & TEMPLATES**

### **Pattern 1: Fixed Size Window**
**Use Case**: Maximum/minimum in window of size k
```cpp
// Template: Fixed Window Size K
int left = 0;
for (int right = 0; right < n; right++) {
    // Add right element to window
    addToWindow(arr[right]);
    
    // Maintain window size k
    if (right - left + 1 == k) {
        // Process window of size k
        updateResult();
        
        // Remove leftmost element
        removeFromWindow(arr[left]);
        left++;
    }
}
```

### **Pattern 2: Variable Size Window (At Most)**
**Use Case**: Longest subarray with at most k distinct elements
```cpp
// Template: At Most K Condition
int left = 0, maxLen = 0;
unordered_map<char, int> count;

for (int right = 0; right < n; right++) {
    // Expand window
    count[s[right]]++;
    
    // Contract while condition violated
    while (count.size() > k) {
        count[s[left]]--;
        if (count[s[left]] == 0) {
            count.erase(s[left]);
        }
        left++;
    }
    
    // Update result
    maxLen = max(maxLen, right - left + 1);
}
```

### **Pattern 3: Variable Size Window (Exactly)**
**Use Case**: Subarrays with exactly k distinct elements
```cpp
// Template: Exactly K = AtMostK - AtMost(K-1)
int exactlyK(string s, int k) {
    return atMostK(s, k) - atMostK(s, k - 1);
}

int atMostK(string s, int k) {
    int left = 0, result = 0;
    unordered_map<char, int> count;
    
    for (int right = 0; right < s.size(); right++) {
        count[s[right]]++;
        
        while (count.size() > k) {
            count[s[left]]--;
            if (count[s[left]] == 0) count.erase(s[left]);
            left++;
        }
        
        result += right - left + 1; // All subarrays ending at right
    }
    
    return result;
}
```

### **Pattern 4: Minimum Window**
**Use Case**: Shortest substring containing all characters
```cpp
// Template: Minimum Window
int left = 0, minLen = INT_MAX, start = 0;
unordered_map<char, int> need, window;
int valid = 0;

for (int right = 0; right < n; right++) {
    // Expand
    char c = s[right];
    if (need.count(c)) {
        window[c]++;
        if (window[c] == need[c]) valid++;
    }
    
    // Contract when valid
    while (valid == need.size()) {
        // Update minimum
        if (right - left + 1 < minLen) {
            start = left;
            minLen = right - left + 1;
        }
        
        // Shrink
        char d = s[left];
        left++;
        if (need.count(d)) {
            if (window[d] == need[d]) valid--;
            window[d]--;
        }
    }
}
```

---

## 🔍 **PROBLEM RECOGNITION PATTERNS**

### **Recognition Keywords:**
| **Keywords** | **Pattern** | **Template** |
|-------------|-------------|--------------|
| "subarray of size k" | Fixed Window | Fixed Size Template |
| "longest substring with..." | Variable Window | At Most Template |
| "shortest window containing..." | Minimum Window | Min Window Template |
| "subarrays with exactly k..." | Exactly K | AtMost(k) - AtMost(k-1) |
| "maximum/minimum in window" | Fixed Window | Sliding Maximum Template |

### **Problem Type Classification:**
```cpp
// Type 1: Fixed Size
"Find maximum sum subarray of size k"
"Sliding window maximum"

// Type 2: Variable Size (Maximize)
"Longest substring without repeating characters"
"Longest subarray with at most k distinct elements"

// Type 3: Variable Size (Minimize)  
"Minimum window substring"
"Smallest subarray with sum >= target"

// Type 4: Count Problems
"Number of subarrays with exactly k distinct elements"
"Count of nice subarrays"
```

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Longest Substring Without Repeating Characters**
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int left = 0, maxLen = 0;
        unordered_set<char> window;
        
        for (int right = 0; right < s.size(); right++) {
            // Contract window while duplicate exists
            while (window.count(s[right])) {
                window.erase(s[left]);
                left++;
            }
            
            // Expand window
            window.insert(s[right]);
            
            // Update maximum length
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};

// Time: O(n), Space: O(min(m,n)) where m is character set size
// Key: Shrink window until no duplicates, then expand
```

### **Example 2: Sliding Window Maximum**
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq; // Store indices, maintain decreasing order
        vector<int> result;
        
        for (int i = 0; i < nums.size(); i++) {
            // Remove indices outside current window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Remove smaller elements from back
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            // Add to result when window is complete
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        
        return result;
    }
};

// Time: O(n), Space: O(k)
// Key: Monotonic deque to maintain maximum in O(1)
```

### **Example 3: Minimum Window Substring**
```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> need, window;
        
        // Count characters needed
        for (char c : t) need[c]++;
        
        int left = 0, valid = 0;
        int start = 0, minLen = INT_MAX;
        
        for (int right = 0; right < s.size(); right++) {
            // Expand window
            char c = s[right];
            if (need.count(c)) {
                window[c]++;
                if (window[c] == need[c]) {
                    valid++;
                }
            }
            
            // Contract window when all characters matched
            while (valid == need.size()) {
                // Update minimum window
                if (right - left + 1 < minLen) {
                    start = left;
                    minLen = right - left + 1;
                }
                
                // Shrink from left
                char d = s[left];
                left++;
                if (need.count(d)) {
                    if (window[d] == need[d]) {
                        valid--;
                    }
                    window[d]--;
                }
            }
        }
        
        return minLen == INT_MAX ? "" : s.substr(start, minLen);
    }
};

// Time: O(|s| + |t|), Space: O(|s| + |t|)
// Key: Expand until valid, contract while maintaining validity
```

### **Example 4: Subarrays with K Different Integers**
```cpp
class Solution {
public:
    int subarraysWithKDistinct(vector<int>& nums, int k) {
        return atMostK(nums, k) - atMostK(nums, k - 1);
    }
    
private:
    int atMostK(vector<int>& nums, int k) {
        int left = 0, result = 0;
        unordered_map<int, int> count;
        
        for (int right = 0; right < nums.size(); right++) {
            // Expand window
            count[nums[right]]++;
            
            // Contract while too many distinct elements
            while (count.size() > k) {
                count[nums[left]]--;
                if (count[nums[left]] == 0) {
                    count.erase(nums[left]);
                }
                left++;
            }
            
            // Add all subarrays ending at right
            result += right - left + 1;
        }
        
        return result;
    }
};

// Time: O(n), Space: O(k)
// Key: Transform "exactly k" to "at most k" - "at most k-1"
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Two-Pointer + Sliding Window**
```cpp
// Problem: Longest substring with at most k distinct chars
int lengthOfLongestSubstringKDistinct(string s, int k) {
    if (k == 0) return 0;
    
    int left = 0, maxLen = 0;
    unordered_map<char, int> count;
    
    for (int right = 0; right < s.size(); right++) {
        count[s[right]]++;
        
        // When window has more than k distinct chars
        while (count.size() > k) {
            count[s[left]]--;
            if (count[s[left]] == 0) {
                count.erase(s[left]);
            }
            left++;
        }
        
        maxLen = max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

### **Technique 2: Sliding Window + Monotonic Deque**
```cpp
// Problem: Sliding window with both maximum and minimum
vector<int> slidingWindowMinMax(vector<int>& nums, int k) {
    deque<int> maxDeque, minDeque; // Store indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove out-of-window indices
        while (!maxDeque.empty() && maxDeque.front() <= i - k) {
            maxDeque.pop_front();
        }
        while (!minDeque.empty() && minDeque.front() <= i - k) {
            minDeque.pop_front();
        }
        
        // Maintain decreasing order for max
        while (!maxDeque.empty() && nums[maxDeque.back()] <= nums[i]) {
            maxDeque.pop_back();
        }
        
        // Maintain increasing order for min
        while (!minDeque.empty() && nums[minDeque.back()] >= nums[i]) {
            minDeque.pop_back();
        }
        
        maxDeque.push_back(i);
        minDeque.push_back(i);
        
        if (i >= k - 1) {
            int windowMax = nums[maxDeque.front()];
            int windowMin = nums[minDeque.front()];
            result.push_back(windowMax - windowMin);
        }
    }
    
    return result;
}
```

### **Technique 3: Multiple Sliding Windows**
```cpp
// Problem: Find all anagrams of pattern in string
vector<int> findAnagrams(string s, string p) {
    vector<int> result;
    if (s.size() < p.size()) return result;
    
    vector<int> pCount(26, 0), windowCount(26, 0);
    
    // Count pattern characters
    for (char c : p) pCount[c - 'a']++;
    
    int windowSize = p.size();
    
    // Process first window
    for (int i = 0; i < windowSize; i++) {
        windowCount[s[i] - 'a']++;
    }
    
    if (windowCount == pCount) result.push_back(0);
    
    // Slide window
    for (int i = windowSize; i < s.size(); i++) {
        // Add new character
        windowCount[s[i] - 'a']++;
        
        // Remove old character
        windowCount[s[i - windowSize] - 'a']--;
        
        if (windowCount == pCount) {
            result.push_back(i - windowSize + 1);
        }
    }
    
    return result;
}
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Early Termination**
```cpp
// Stop early when impossible to improve
if (right - left + 1 > maxPossible) break;

// Skip when current window can't be optimal
if (currentSum < minRequired) continue;
```

### **Strategy 2: Efficient Data Structures**
```cpp
// Use array instead of map when character set is small
vector<int> count(128, 0); // ASCII characters
// vs
unordered_map<char, int> count; // Any characters
```

### **Strategy 3: Minimize Window Operations**
```cpp
// Batch operations when possible
while (needToShrink && left <= right) {
    // Multiple shrink operations
    left++;
}

// Use running sum instead of recalculating
currentSum = currentSum - nums[left] + nums[right];
// vs
currentSum = sum(nums, left, right);
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Pattern Recognition (30 seconds)**
```cpp
if (problem_mentions("subarray/substring")) {
    if (mentions("size k")) return FIXED_WINDOW;
    if (mentions("longest/maximum")) return VARIABLE_WINDOW_MAX;
    if (mentions("shortest/minimum")) return VARIABLE_WINDOW_MIN;
    if (mentions("exactly k")) return EXACTLY_K_PATTERN;
}
```

### **Step 2: Choose Template (30 seconds)**
```cpp
// Template selection flowchart
if (fixed_size) use fixed_window_template;
else if (maximize_window) use at_most_template;
else if (minimize_window) use min_window_template;
else if (exact_count) use exactly_k_template;
```

### **Step 3: Implementation Strategy**
1. **Initialize**: Set up window boundaries and tracking structures
2. **Expand**: Add elements to right side of window
3. **Contract**: Remove elements from left when condition violated
4. **Update**: Track optimal result during the process
5. **Return**: Best result found

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong Window Size Calculation**
```cpp
// ❌ Wrong: Off by one error
int windowSize = right - left; // Missing +1

// ✅ Correct: Inclusive window size
int windowSize = right - left + 1;
```

### **Pitfall 2: Forgetting to Update Result**
```cpp
// ❌ Wrong: Only update at the end
for (int right = 0; right < n; right++) {
    // expand window
    // contract window
}
return result; // Result might be suboptimal

// ✅ Correct: Update result during process
for (int right = 0; right < n; right++) {
    // expand window
    // contract window
    result = max(result, right - left + 1); // Update each iteration
}
```

### **Pitfall 3: Incorrect Shrinking Logic**
```cpp
// ❌ Wrong: Not shrinking enough
if (condition_violated) {
    left++; // Might still be violated
}

// ✅ Correct: Shrink until valid
while (condition_violated) {
    // remove from window
    left++;
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **Fixed Window**: O(n) - each element processed once
- **Variable Window**: O(n) - each element added once, removed once (amortized)
- **With Complex Data Structures**: O(n log k) - when using TreeMap/TreeSet
- **Multiple Windows**: O(n × w) where w is number of windows

### **Space Complexity:**
- **Basic Sliding Window**: O(k) where k is window size or character set
- **With Frequency Maps**: O(min(n, alphabet_size))
- **With Deque**: O(k) for window elements

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Sliding Window when you can:

- [ ] **Identify window problems** from keywords in 30 seconds
- [ ] **Choose correct template** (fixed/variable/minimum) immediately
- [ ] **Handle frequency tracking** without bugs
- [ ] **Convert "exactly k"** to "at most k" problems
- [ ] **Optimize with appropriate data structures**
- [ ] **Combine with other techniques** (deque, two-pointers)
- [ ] **Debug window boundary issues** quickly

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Start with Brute Force**: "The naive approach would be O(n²)..."
2. **Identify Optimization**: "We can use sliding window to make it O(n)"
3. **Choose Pattern**: Fixed vs Variable vs Minimum window
4. **Code Template**: Start with basic template, then customize
5. **Test Edge Cases**: Empty input, single element, no valid window
6. **Explain Invariant**: What does your window represent?

---

**🎯 Master Sliding Window and you'll solve substring/subarray problems with optimal efficiency!**
