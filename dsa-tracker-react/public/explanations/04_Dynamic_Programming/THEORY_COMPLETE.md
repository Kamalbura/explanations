# 🎯 DYNAMIC PROGRAMMING: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: OPTIMAL SUBSTRUCTURE + MEMOIZATION**

Dynamic Programming is about **breaking problems into smaller subproblems** and **storing solutions** to avoid redundant calculations, transforming exponential solutions into polynomial ones.

### **The DP Mindset:**
```
Instead of recalculating same subproblems O(2^n)
→ Store solutions in table/memory O(n²) or O(n)
→ Build solution from smaller solved subproblems
→ Key: Optimal substructure + Overlapping subproblems
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Why DP Works:**
```
Recursive Solution: T(n) = T(n-1) + T(n-2) = O(2^n)
With Memoization: Each subproblem solved once = O(n)

Example - Fibonacci:
Without DP: F(50) = ~2^50 = 1,125,899,906,842,624 operations
With DP: F(50) = 50 operations
Speedup: 22,517,998,136,852,480x faster!
```

### **DP vs Other Approaches:**
| Problem Size | Brute Force | DP | Speedup |
|-------------|-------------|-----|---------|
| n = 20 | 2^20 = 1M | 20 | 52,428x |
| n = 40 | 2^40 = 1T | 40 | 27 billion x |
| n = 60 | 2^60 = 1Q | 60 | 19 quintillion x |

---

## 🎨 **DP PATTERNS & TEMPLATES**

### **Pattern 1: Linear DP (1D)**
**Use Case**: Problems with single parameter state
```cpp
// Template: 1D DP
vector<int> dp(n + 1);
dp[0] = base_case;

for (int i = 1; i <= n; i++) {
    dp[i] = optimal_choice(dp[i-1], dp[i-2], ...);
}

return dp[n];

// Examples: Fibonacci, Climbing Stairs, House Robber
```

### **Pattern 2: Grid DP (2D)**
**Use Case**: Two-parameter state, paths, strings
```cpp
// Template: 2D DP
vector<vector<int>> dp(m + 1, vector<int>(n + 1));
dp[0][0] = base_case;

for (int i = 0; i <= m; i++) {
    for (int j = 0; j <= n; j++) {
        if (i == 0 && j == 0) continue;
        dp[i][j] = optimal_choice(dp[i-1][j], dp[i][j-1], ...);
    }
}

return dp[m][n];

// Examples: Unique Paths, Edit Distance, Longest Common Subsequence
```

### **Pattern 3: Interval DP**
**Use Case**: Problems on ranges/intervals
```cpp
// Template: Interval DP
vector<vector<int>> dp(n, vector<int>(n));

// Length of interval
for (int len = 1; len <= n; len++) {
    for (int i = 0; i <= n - len; i++) {
        int j = i + len - 1;
        if (len == 1) {
            dp[i][j] = base_case;
        } else {
            for (int k = i; k < j; k++) {
                dp[i][j] = optimal_choice(dp[i][k], dp[k+1][j]);
            }
        }
    }
}

// Examples: Matrix Chain Multiplication, Palindromic Substrings
```

### **Pattern 4: State Machine DP**
**Use Case**: Problems with multiple states/decisions
```cpp
// Template: State Machine
vector<vector<int>> dp(n, vector<int>(states));

for (int i = 0; i < n; i++) {
    for (int state = 0; state < states; state++) {
        for (int prev_state = 0; prev_state < states; prev_state++) {
            if (transition_valid(prev_state, state)) {
                dp[i][state] = optimal_choice(dp[i][state], 
                                             dp[i-1][prev_state] + cost);
            }
        }
    }
}

// Examples: Best Time to Buy/Sell Stock, Paint House
```

### **Pattern 5: Digit DP**
**Use Case**: Number-based constraints
```cpp
// Template: Digit DP
int digitDP(string num, int pos, int tight, int started, 
           vector<vector<vector<vector<int>>>>& memo) {
    if (pos == num.size()) return started;
    
    if (memo[pos][tight][started][...] != -1) {
        return memo[pos][tight][started][...];
    }
    
    int limit = tight ? (num[pos] - '0') : 9;
    int result = 0;
    
    for (int digit = 0; digit <= limit; digit++) {
        int newTight = tight && (digit == limit);
        int newStarted = started || (digit > 0);
        result += digitDP(num, pos + 1, newTight, newStarted, memo);
    }
    
    return memo[pos][tight][started][...] = result;
}

// Examples: Count numbers with specific properties
```

---

## 🔍 **PROBLEM RECOGNITION GUIDE**

### **Recognition Keywords:**
| **Keywords** | **Pattern** | **Complexity** |
|-------------|-------------|----------------|
| "optimal way", "minimum/maximum" | Optimization DP | O(n²) typical |
| "number of ways", "count" | Counting DP | O(n) or O(n²) |
| "subsequence", "substring" | String DP | O(n²) |
| "path", "grid", "matrix" | 2D DP | O(m×n) |
| "partition", "subset" | Subset DP | O(n×sum) |
| "interval", "range" | Interval DP | O(n³) |

### **DP Problem Checklist:**
```cpp
bool isDPProblem(Problem p) {
    return hasOptimalSubstructure(p) && 
           hasOverlappingSubproblems(p) &&
           (isOptimization(p) || isCounting(p));
}

// Optimal Substructure: Solution contains optimal solutions to subproblems
// Overlapping Subproblems: Same subproblems are solved multiple times
```

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Fibonacci (Basic 1D DP)**
```cpp
// Top-Down (Memoization)
class Solution {
    vector<int> memo;
public:
    int fib(int n) {
        if (n <= 1) return n;
        memo.resize(n + 1, -1);
        return fibHelper(n);
    }
    
private:
    int fibHelper(int n) {
        if (n <= 1) return n;
        if (memo[n] != -1) return memo[n];
        
        return memo[n] = fibHelper(n - 1) + fibHelper(n - 2);
    }
};

// Bottom-Up (Tabulation)
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        
        vector<int> dp(n + 1);
        dp[0] = 0, dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
};

// Space Optimized
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        
        int prev2 = 0, prev1 = 1;
        
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
};

// Time: O(n), Space: O(1) optimized
```

### **Example 2: Longest Common Subsequence (2D DP)**
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
};

// Time: O(m×n), Space: O(m×n)
// Key: If characters match, extend LCS; otherwise take maximum
```

### **Example 3: 0/1 Knapsack (State DP)**
```cpp
class Solution {
public:
    int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
        int n = weights.size();
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
        
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                // Don't take item i
                dp[i][w] = dp[i - 1][w];
                
                // Take item i if possible
                if (weights[i - 1] <= w) {
                    dp[i][w] = max(dp[i][w], 
                                  dp[i - 1][w - weights[i - 1]] + values[i - 1]);
                }
            }
        }
        
        return dp[n][capacity];
    }
};

// Time: O(n×capacity), Space: O(n×capacity)
// Key: For each item, decide to take or not take
```

### **Example 4: Coin Change (Unbounded DP)**
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1); // Initialize with impossible value
        dp[0] = 0; // Base case: 0 coins needed for amount 0
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
};

// Time: O(amount × coins), Space: O(amount)
// Key: For each amount, try all coins and take minimum
```

### **Example 5: Edit Distance (String DP)**
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        
        // Base cases
        for (int i = 0; i <= m; i++) dp[i][0] = i; // Delete all
        for (int j = 0; j <= n; j++) dp[0][j] = j; // Insert all
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1]; // No operation needed
                } else {
                    dp[i][j] = 1 + min({
                        dp[i - 1][j],     // Delete
                        dp[i][j - 1],     // Insert  
                        dp[i - 1][j - 1]  // Replace
                    });
                }
            }
        }
        
        return dp[m][n];
    }
};

// Time: O(m×n), Space: O(m×n)
// Key: Three operations - insert, delete, replace
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Space Optimization**
```cpp
// From O(n²) to O(n) space
// Before: dp[i][j] depends on dp[i-1][j] and dp[i][j-1]
vector<vector<int>> dp(m, vector<int>(n));

// After: Use only current and previous row
vector<int> prev(n), curr(n);
for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
        curr[j] = calculate(prev[j], curr[j-1], ...);
    }
    prev = curr;
}
```

### **Technique 2: State Compression**
```cpp
// Use bitmask for subset states
int subsetDP(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(1 << n, 0); // 2^n states
    
    for (int mask = 0; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                // Include element i in subset
                dp[mask] = max(dp[mask], dp[mask ^ (1 << i)] + nums[i]);
            }
        }
    }
    
    return dp[(1 << n) - 1]; // All elements included
}
```

### **Technique 3: Matrix Exponentiation**
```cpp
// For linear recurrences, use matrix exponentiation
// F(n) = F(n-1) + F(n-2) can be computed in O(log n)
vector<vector<long long>> multiply(vector<vector<long long>>& A, 
                                   vector<vector<long long>>& B) {
    int n = A.size();
    vector<vector<long long>> C(n, vector<long long>(n, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    return C;
}

long long fibMatrix(int n) {
    if (n <= 1) return n;
    
    vector<vector<long long>> base = {{1, 1}, {1, 0}};
    vector<vector<long long>> result = {{1, 0}, {0, 1}}; // Identity
    
    n--; // F(n) = F(n-1) + F(n-2), start from F(1)
    
    while (n > 0) {
        if (n & 1) result = multiply(result, base);
        base = multiply(base, base);
        n >>= 1;
    }
    
    return result[0][0];
}
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Memoization vs Tabulation**
```cpp
// Memoization (Top-Down): Better for sparse problems
int solveTopDown(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    
    return memo[n] = solveTopDown(n-1, memo) + solveTopDown(n-2, memo);
}

// Tabulation (Bottom-Up): Better for dense problems
int solveBottomUp(int n) {
    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    dp[0] = 0, dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}
```

### **Strategy 2: Space Optimization Patterns**
```cpp
// Pattern 1: Only need previous k values
// From O(n) to O(k) space
vector<int> prev(k);
for (int i = 0; i < n; i++) {
    int curr = calculate(prev);
    prev.push_back(curr);
    if (prev.size() > k) prev.erase(prev.begin());
}

// Pattern 2: Rolling array
// For 2D DP where row i only depends on row i-1
vector<int> dp(n);
for (int i = 0; i < m; i++) {
    vector<int> newDp(n);
    for (int j = 0; j < n; j++) {
        newDp[j] = calculate(dp[j], newDp[j-1]);
    }
    dp = newDp;
}
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Problem Recognition (1-2 minutes)**
```cpp
// Is it a DP problem?
if (hasOptimalSubstructure && hasOverlappingSubproblems) {
    if (keywords.contains("optimal", "minimum", "maximum")) {
        problemType = OPTIMIZATION_DP;
    } else if (keywords.contains("count", "ways", "number")) {
        problemType = COUNTING_DP;
    }
}
```

### **Step 2: State Definition (2-3 minutes)**
```cpp
// Define state clearly
// dp[i] = answer to subproblem ending at position i
// dp[i][j] = answer to subproblem involving first i items and parameter j
// dp[i][j][k] = answer involving three parameters

// Examples:
// Fibonacci: dp[i] = i-th fibonacci number
// LCS: dp[i][j] = LCS of first i chars of s1 and first j chars of s2
// Knapsack: dp[i][w] = max value using first i items with weight limit w
```

### **Step 3: Recurrence Relation (3-5 minutes)**
```cpp
// Express current state in terms of previous states
// Think about: What decisions can I make at current state?

// Examples:
// Fibonacci: dp[i] = dp[i-1] + dp[i-2]
// LCS: dp[i][j] = s1[i]==s2[j] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1])
// Knapsack: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
```

### **Step 4: Base Cases (1 minute)**
```cpp
// Define the simplest cases
// Usually when one or more parameters are 0 or 1

// Examples:
// dp[0] = 0 or 1 (depending on problem)
// dp[i][0] = some_value (empty second parameter)
// dp[0][j] = some_value (empty first parameter)
```

### **Step 5: Implementation (10-15 minutes)**
1. Choose memoization vs tabulation
2. Implement with correct loop order
3. Handle edge cases
4. Optimize space if needed

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong State Definition**
```cpp
// ❌ Wrong: Ambiguous state
dp[i] = "something about array up to index i" // Too vague

// ✅ Correct: Precise state  
dp[i] = "maximum sum ending exactly at index i"
dp[i] = "number of ways to reach sum i"
```

### **Pitfall 2: Missing Base Cases**
```cpp
// ❌ Wrong: No initialization
vector<int> dp(n);
for (int i = 1; i < n; i++) {
    dp[i] = dp[i-1] + dp[i-2]; // dp[0] undefined!
}

// ✅ Correct: Clear base cases
vector<int> dp(n);
dp[0] = 1; // Base case
if (n > 1) dp[1] = 1; // Base case
for (int i = 2; i < n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
}
```

### **Pitfall 3: Wrong Loop Order**
```cpp
// ❌ Wrong: Computing dp[i][j] before dp[i-1][j] is ready
for (int j = 0; j < n; j++) {
    for (int i = 0; i < m; i++) {
        dp[i][j] = dp[i-1][j] + dp[i][j-1]; // dp[i-1][j] not computed yet!
    }
}

// ✅ Correct: Ensure dependencies are computed first
for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
        dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **1D DP**: O(n) typically
- **2D DP**: O(n²) or O(m×n) typically  
- **3D DP**: O(n³) or O(m×n×k)
- **Interval DP**: O(n³) typically
- **Subset DP**: O(n×2^n) typically

### **Space Complexity Optimization:**
- **Original**: O(state_space)
- **Space Optimized**: O(current_row) or O(k) where k is dependency window
- **Matrix Exponentiation**: O(log n) time for linear recurrences

---

## 🏆 **MASTERY CHECKLIST**

You've mastered DP when you can:

- [ ] **Identify DP problems** from keywords in 1 minute
- [ ] **Define state clearly** without ambiguity
- [ ] **Write recurrence relation** by analyzing decisions
- [ ] **Handle base cases** correctly
- [ ] **Choose between memoization and tabulation** appropriately
- [ ] **Optimize space** when possible
- [ ] **Debug common issues** (wrong order, missing cases)
- [ ] **Solve both optimization and counting problems**

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Start Simple**: "Let me first solve this recursively, then optimize"
2. **Define State Clearly**: "dp[i][j] represents..."
3. **Explain Decisions**: "At each step, I can either... or..."
4. **Write Recurrence**: "So the relation is dp[i] = ..."
5. **Handle Base Cases**: "When i=0 or j=0, the answer is..."
6. **Code Step by Step**: Start with base cases, then build up
7. **Optimize if Time**: "I can reduce space from O(n²) to O(n) by..."

**Sample Interview Flow:**
```
Interviewer: "Minimum path sum in grid"
You: "This is a DP problem because we have optimal substructure.
     dp[i][j] = minimum sum to reach cell (i,j)
     Recurrence: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
     Base case: dp[0][0] = grid[0][0]"
```

---

**🎯 Master DP patterns and you'll solve any optimization or counting problem with confidence!**
