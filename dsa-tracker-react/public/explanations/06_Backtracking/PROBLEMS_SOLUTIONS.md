# 🎯 BACKTRACKING: ESSENTIAL PROBLEMS & SOLUTIONS

## 🧠 **PROBLEM CATEGORIZATION**

### **TIER 1: FUNDAMENTAL PATTERNS (Master These First)**
1. **Permutations & Combinations**
2. **Subset Generation** 
3. **N-Queens Problem**
4. **Sudoku Solver**

### **TIER 2: INTERMEDIATE PATTERNS**
5. **Word Search**
6. **Generate Parentheses**
7. **Palindrome Partitioning**
8. **Combination Sum**

### **TIER 3: ADVANCED PATTERNS**
9. **Restore IP Addresses**
10. **Letter Combinations**

---

## 💻 **TIER 1: FUNDAMENTAL PATTERNS**

### **Problem 1: Permutations (Leetcode 46)**
```cpp
// Problem: Generate all permutations of distinct integers
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        
        backtrack(nums, current, used, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& nums, vector<int>& current, 
                   vector<bool>& used, vector<vector<int>>& result) {
        // Base case: found complete permutation
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Try each unused number
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            
            // Choose
            current.push_back(nums[i]);
            used[i] = true;
            
            // Explore
            backtrack(nums, current, used, result);
            
            // Unchoose (backtrack)
            current.pop_back();
            used[i] = false;
        }
    }
};

// Time: O(N! × N), Space: O(N)
// Pattern: Choose → Explore → Unchoose
```

### **Problem 2: Subsets (Leetcode 78)**
```cpp
// Problem: Generate all possible subsets (power set)
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        
        backtrack(nums, 0, current, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& nums, int start, 
                   vector<int>& current, vector<vector<int>>& result) {
        // Every state is a valid subset
        result.push_back(current);
        
        // Try including each remaining number
        for (int i = start; i < nums.size(); i++) {
            // Include nums[i]
            current.push_back(nums[i]);
            
            // Explore with next index
            backtrack(nums, i + 1, current, result);
            
            // Exclude nums[i] (backtrack)
            current.pop_back();
        }
    }
};

// Time: O(2^N × N), Space: O(N)
// Pattern: Include vs Exclude decisions
```

### **Problem 3: N-Queens (Leetcode 51)**
```cpp
// Problem: Place N queens on N×N board such that no two queens attack each other
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        
        backtrack(board, 0, result);
        return result;
    }
    
private:
    void backtrack(vector<string>& board, int row, 
                   vector<vector<string>>& result) {
        // Base case: placed all queens
        if (row == board.size()) {
            result.push_back(board);
            return;
        }
        
        // Try placing queen in each column of current row
        for (int col = 0; col < board.size(); col++) {
            if (isValid(board, row, col)) {
                // Place queen
                board[row][col] = 'Q';
                
                // Move to next row
                backtrack(board, row + 1, result);
                
                // Remove queen (backtrack)
                board[row][col] = '.';
            }
        }
    }
    
    bool isValid(vector<string>& board, int row, int col) {
        int n = board.size();
        
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        
        // Check diagonal (top-left to bottom-right)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        
        // Check anti-diagonal (top-right to bottom-left)
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        
        return true;
    }
};

// Time: O(N!), Space: O(N²)
// Pattern: Constraint validation before recursion
```

### **Problem 4: Sudoku Solver (Leetcode 37)**
```cpp
// Problem: Solve 9×9 Sudoku puzzle
class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        backtrack(board);
    }
    
private:
    bool backtrack(vector<vector<char>>& board) {
        // Find next empty cell
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == '.') {
                    // Try digits 1-9
                    for (char digit = '1'; digit <= '9'; digit++) {
                        if (isValid(board, row, col, digit)) {
                            // Place digit
                            board[row][col] = digit;
                            
                            // If rest of board can be solved
                            if (backtrack(board)) return true;
                            
                            // Backtrack
                            board[row][col] = '.';
                        }
                    }
                    return false; // No valid digit found
                }
            }
        }
        return true; // All cells filled
    }
    
    bool isValid(vector<vector<char>>& board, int row, int col, char digit) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == digit) return false;
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == digit) return false;
        }
        
        // Check 3×3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = boxRow; i < boxRow + 3; i++) {
            for (int j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] == digit) return false;
            }
        }
        
        return true;
    }
};

// Time: O(9^(empty_cells)), Space: O(1)
// Pattern: Find-and-fill with constraint checking
```

---

## 💻 **TIER 2: INTERMEDIATE PATTERNS**

### **Problem 5: Word Search (Leetcode 79)**
```cpp
// Problem: Find if word exists in 2D board of characters
class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        int m = board.size(), n = board[0].size();
        
        // Try starting from each cell
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
private:
    bool dfs(vector<vector<char>>& board, string& word, 
             int row, int col, int index) {
        // Base case: found complete word
        if (index == word.length()) return true;
        
        // Boundary and character check
        if (row < 0 || row >= board.size() || 
            col < 0 || col >= board[0].size() || 
            board[row][col] != word[index]) {
            return false;
        }
        
        // Mark as visited
        char temp = board[row][col];
        board[row][col] = '#';
        
        // Explore all 4 directions
        int directions[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        for (auto& dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];
            
            if (dfs(board, word, newRow, newCol, index + 1)) {
                board[row][col] = temp; // Restore
                return true;
            }
        }
        
        // Backtrack: restore original character
        board[row][col] = temp;
        return false;
    }
};

// Time: O(M×N×4^L), Space: O(L) where L = word length
// Pattern: 2D exploration with path marking
```

### **Problem 6: Generate Parentheses (Leetcode 22)**
```cpp
// Problem: Generate all combinations of well-formed parentheses
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        string current = "";
        
        backtrack(current, 0, 0, n, result);
        return result;
    }
    
private:
    void backtrack(string& current, int open, int close, 
                   int n, vector<string>& result) {
        // Base case: used all n pairs
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        // Add opening parenthesis if we haven't used all
        if (open < n) {
            current.push_back('(');
            backtrack(current, open + 1, close, n, result);
            current.pop_back(); // backtrack
        }
        
        // Add closing parenthesis if it would be valid
        if (close < open) {
            current.push_back(')');
            backtrack(current, open, close + 1, n, result);
            current.pop_back(); // backtrack
        }
    }
};

// Time: O(4^n / √n), Space: O(n)
// Pattern: Constraint-based generation
```

### **Problem 7: Palindrome Partitioning (Leetcode 131)**
```cpp
// Problem: Partition string into palindromic substrings
class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        
        backtrack(s, 0, current, result);
        return result;
    }
    
private:
    void backtrack(string& s, int start, vector<string>& current,
                   vector<vector<string>>& result) {
        // Base case: processed entire string
        if (start >= s.length()) {
            result.push_back(current);
            return;
        }
        
        // Try all possible ending positions
        for (int end = start; end < s.length(); end++) {
            // If substring is palindrome
            if (isPalindrome(s, start, end)) {
                // Choose this substring
                current.push_back(s.substr(start, end - start + 1));
                
                // Explore rest of string
                backtrack(s, end + 1, current, result);
                
                // Backtrack
                current.pop_back();
            }
        }
    }
    
    bool isPalindrome(string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
};

// Time: O(N×2^N), Space: O(N)
// Pattern: Substring validation with recursion
```

### **Problem 8: Combination Sum (Leetcode 39)**
```cpp
// Problem: Find all combinations that sum to target (numbers can be reused)
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        
        sort(candidates.begin(), candidates.end()); // For optimization
        backtrack(candidates, target, 0, current, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& candidates, int remainingTarget, 
                   int start, vector<int>& current, 
                   vector<vector<int>>& result) {
        // Base case: found valid combination
        if (remainingTarget == 0) {
            result.push_back(current);
            return;
        }
        
        // Try each candidate starting from 'start'
        for (int i = start; i < candidates.size(); i++) {
            // Pruning: if current candidate > remaining target
            if (candidates[i] > remainingTarget) break;
            
            // Choose current candidate
            current.push_back(candidates[i]);
            
            // Explore (can reuse same number, so pass 'i' not 'i+1')
            backtrack(candidates, remainingTarget - candidates[i], 
                     i, current, result);
            
            // Backtrack
            current.pop_back();
        }
    }
};

// Time: O(N^(T/M)), Space: O(T/M) where T=target, M=minimal candidate
// Pattern: Target reduction with reuse allowed
```

---

## 🎯 **PROBLEM SOLVING TEMPLATES**

### **Template 1: Standard Backtracking**
```cpp
void backtrack(parameters) {
    // Base case
    if (isComplete(parameters)) {
        processResult(parameters);
        return;
    }
    
    // Try all possibilities
    for (each choice in availableChoices) {
        if (isValid(choice)) {
            // Make choice
            makeChoice(choice);
            
            // Explore
            backtrack(updatedParameters);
            
            // Unmake choice (backtrack)
            unmakeChoice(choice);
        }
    }
}
```

### **Template 2: Early Termination Backtracking**
```cpp
bool backtrackWithEarlyReturn(parameters) {
    // Base case
    if (isComplete(parameters)) {
        return isSuccessful(parameters);
    }
    
    // Try all possibilities
    for (each choice in availableChoices) {
        if (isValid(choice)) {
            makeChoice(choice);
            
            // Early return if solution found
            if (backtrackWithEarlyReturn(updatedParameters)) {
                return true;
            }
            
            unmakeChoice(choice);
        }
    }
    
    return false; // No solution found
}
```

### **Template 3: Backtracking with Pruning**
```cpp
void backtrackWithPruning(parameters) {
    // Base case
    if (isComplete(parameters)) {
        processResult(parameters);
        return;
    }
    
    // Pruning: early termination
    if (cannotReachSolution(parameters)) {
        return;
    }
    
    for (each choice in availableChoices) {
        if (isValid(choice) && isPromising(choice)) {
            makeChoice(choice);
            backtrackWithPruning(updatedParameters);
            unmakeChoice(choice);
        }
    }
}
```

---

## 🔧 **OPTIMIZATION TECHNIQUES**

### **1. Constraint Propagation**
```cpp
// Instead of checking validity after making choice
if (isValid(choice)) {
    makeChoice(choice);
    // continue...
}

// Check validity before making choice
if (wouldBeValid(choice)) {
    makeChoice(choice);
    // continue...
}
```

### **2. Pruning with Bounds**
```cpp
// In combination sum, prune if candidate > remaining target
if (candidates[i] > remainingTarget) break;

// In N-Queens, check conflicts before placing
if (isAttacked(row, col)) continue;
```

### **3. Memoization for Repeated Subproblems**
```cpp
unordered_map<string, vector<result_type>> memo;

vector<result_type> backtrackWithMemo(state) {
    string key = stateToString(state);
    if (memo.count(key)) {
        return memo[key];
    }
    
    // Normal backtracking logic
    // ...
    
    memo[key] = result;
    return result;
}
```

---

## 🏆 **MASTERY CHECKLIST**

- [ ] **Pattern Recognition**: Identify backtracking problems instantly
- [ ] **Template Selection**: Choose correct template based on problem type
- [ ] **Constraint Handling**: Implement validity checks efficiently  
- [ ] **Pruning Optimization**: Add intelligent early termination
- [ ] **State Management**: Handle choose/unchoose correctly
- [ ] **Base Case Design**: Define termination conditions properly
- [ ] **Time Complexity**: Analyze and optimize exponential solutions

---

## 🚀 **INTERVIEW STRATEGY**

1. **Identify Pattern**: "This looks like a backtracking problem because..."
2. **Define State**: "I need to track these variables in my recursion..."
3. **Base Cases**: "The recursion stops when..."
4. **Choices**: "At each step, I can choose from..."
5. **Constraints**: "I need to validate..."
6. **Optimize**: "I can prune branches by..."

---

**🎯 Master these 10 problems and you'll handle any backtracking interview question!**
