# 🎯 BACKTRACKING: TEMPLATE LIBRARY & QUICK REFERENCE

## 🧠 **CORE TEMPLATES FOR INSTANT USE**

### **Template 1: Standard Backtracking Framework**
```cpp
class BacktrackingSolution {
private:
    vector<result_type> results;
    current_state_type currentState;
    
    void backtrack(parameters) {
        // Base case: complete solution found
        if (isComplete(parameters)) {
            results.push_back(getCurrentSolution());
            return;
        }
        
        // Try all possible choices
        for (auto choice : getAvailableChoices(parameters)) {
            if (isValidChoice(choice, parameters)) {
                // Make choice
                makeChoice(choice);
                
                // Recurse with updated state
                backtrack(getUpdatedParameters(choice));
                
                // Backtrack: undo choice
                undoChoice(choice);
            }
        }
    }
    
public:
    vector<result_type> solve(input_type input) {
        // Initialize state
        initializeState(input);
        
        // Start backtracking
        backtrack(initialParameters);
        
        return results;
    }
};
```

### **Template 2: Early Termination (Find First Solution)**
```cpp
class EarlyTerminationBacktrack {
private:
    bool backtrack(parameters) {
        // Base case: solution found
        if (isComplete(parameters)) {
            return isValidSolution(parameters);
        }
        
        // Try all choices
        for (auto choice : getAvailableChoices(parameters)) {
            if (isValidChoice(choice, parameters)) {
                makeChoice(choice);
                
                // Early return if solution found
                if (backtrack(getUpdatedParameters(choice))) {
                    return true; // Solution found, stop searching
                }
                
                undoChoice(choice);
            }
        }
        
        return false; // No solution found in this branch
    }
    
public:
    bool hasSolution(input_type input) {
        initializeState(input);
        return backtrack(initialParameters);
    }
};
```

### **Template 3: Optimized with Pruning**
```cpp
class OptimizedBacktrack {
private:
    void backtrack(parameters) {
        // Base case
        if (isComplete(parameters)) {
            processResult(parameters);
            return;
        }
        
        // Pruning: early termination if impossible
        if (cannotReachValidSolution(parameters)) {
            return; // Prune this branch
        }
        
        // Try choices in optimized order
        auto choices = getOptimalChoiceOrder(parameters);
        for (auto choice : choices) {
            if (isValidChoice(choice) && isPromising(choice)) {
                makeChoice(choice);
                updateConstraints(choice); // Advanced: constraint propagation
                
                backtrack(getUpdatedParameters(choice));
                
                undoChoice(choice);
                restoreConstraints(choice);
            }
        }
    }
};
```

---

## 🎨 **SPECIALIZED TEMPLATES BY PROBLEM TYPE**

### **Type 1: Permutation Generator**
```cpp
class PermutationGenerator {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        
        generate(nums, used, current, result);
        return result;
    }
    
private:
    void generate(vector<int>& nums, vector<bool>& used, 
                  vector<int>& current, vector<vector<int>>& result) {
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        for (int i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                // Choose
                current.push_back(nums[i]);
                used[i] = true;
                
                // Explore
                generate(nums, used, current, result);
                
                // Unchoose
                current.pop_back();
                used[i] = false;
            }
        }
    }
};
```

### **Type 2: Subset Generator**
```cpp
class SubsetGenerator {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        
        generate(nums, 0, current, result);
        return result;
    }
    
private:
    void generate(vector<int>& nums, int start, 
                  vector<int>& current, vector<vector<int>>& result) {
        // Every state is a valid subset
        result.push_back(current);
        
        // Try including each remaining element
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);    // Include
            generate(nums, i + 1, current, result);
            current.pop_back();            // Exclude
        }
    }
};
```

### **Type 3: Board/Grid Solver**
```cpp
class GridSolver {
private:
    vector<vector<int>> board;
    int n;
    
    bool solve() {
        // Find next empty cell
        int row, col;
        if (!findEmptyCell(row, col)) {
            return true; // All cells filled
        }
        
        // Try all possible values
        for (int num = 1; num <= n; num++) {
            if (isValid(row, col, num)) {
                // Place number
                board[row][col] = num;
                
                // Recurse
                if (solve()) {
                    return true;
                }
                
                // Backtrack
                board[row][col] = 0;
            }
        }
        
        return false; // No solution possible
    }
    
    bool isValid(int row, int col, int num) {
        // Check row
        for (int j = 0; j < n; j++) {
            if (board[row][j] == num) return false;
        }
        
        // Check column
        for (int i = 0; i < n; i++) {
            if (board[i][col] == num) return false;
        }
        
        // Add problem-specific constraints here
        return true;
    }
    
    bool findEmptyCell(int& row, int& col) {
        for (row = 0; row < n; row++) {
            for (col = 0; col < n; col++) {
                if (board[row][col] == 0) {
                    return true;
                }
            }
        }
        return false;
    }
};
```

### **Type 4: Path Finding in 2D Grid**
```cpp
class PathFinder {
private:
    vector<vector<char>> grid;
    int m, n;
    vector<vector<int>> directions = {{-1,0}, {1,0}, {0,-1}, {0,1}};
    
    bool findPath(int row, int col, string& target, int index) {
        // Base case: found complete path
        if (index == target.length()) {
            return true;
        }
        
        // Boundary and validity checks
        if (row < 0 || row >= m || col < 0 || col >= n || 
            grid[row][col] != target[index] || grid[row][col] == '#') {
            return false;
        }
        
        // Mark as visited
        char temp = grid[row][col];
        grid[row][col] = '#';
        
        // Try all 4 directions
        for (auto& dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];
            
            if (findPath(newRow, newCol, target, index + 1)) {
                grid[row][col] = temp; // Restore before returning
                return true;
            }
        }
        
        // Backtrack: restore original value
        grid[row][col] = temp;
        return false;
    }
};
```

### **Type 5: Combination with Target**
```cpp
class CombinationTargetSolver {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        
        sort(candidates.begin(), candidates.end()); // For pruning
        backtrack(candidates, target, 0, current, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& candidates, int remainingTarget, 
                   int start, vector<int>& current, 
                   vector<vector<int>>& result) {
        if (remainingTarget == 0) {
            result.push_back(current);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            // Pruning: if current candidate > remaining target
            if (candidates[i] > remainingTarget) break;
            
            current.push_back(candidates[i]);
            
            // Can reuse same element: pass 'i'
            // Cannot reuse: pass 'i + 1'
            backtrack(candidates, remainingTarget - candidates[i], 
                     i, current, result);
            
            current.pop_back();
        }
    }
};
```

---

## 🔧 **OPTIMIZATION SNIPPETS**

### **Optimization 1: Duplicate Handling**
```cpp
// In problems with duplicates, skip duplicate elements
void backtrack(vector<int>& nums, int start, /*...*/) {
    // ... base case ...
    
    for (int i = start; i < nums.size(); i++) {
        // Skip duplicates: only process first occurrence at each level
        if (i > start && nums[i] == nums[i-1]) continue;
        
        // ... rest of backtracking logic ...
    }
}
```

### **Optimization 2: Early Pruning**
```cpp
// Prune branches that cannot lead to valid solutions
void backtrack(/*...*/) {
    // Mathematical pruning
    if (remainingSum < 0 || remainingSum > maxPossibleSum) return;
    
    // Constraint-based pruning
    if (violatesConstraints()) return;
    
    // Size-based pruning
    if (currentSize + remainingElements < minRequiredSize) return;
    
    // ... continue with normal logic ...
}
```

### **Optimization 3: Bit Manipulation for State**
```cpp
class OptimizedNQueens {
private:
    int n;
    vector<vector<string>> result;
    
    void solve(int row, int cols, int diag1, int diag2, vector<string>& board) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        // Available positions = positions not attacked
        int available = ((1 << n) - 1) & (~(cols | diag1 | diag2));
        
        while (available) {
            int pos = available & (-available); // Get rightmost bit
            available &= (available - 1);       // Remove rightmost bit
            
            int col = __builtin_ctz(pos);        // Get column index
            
            board[row][col] = 'Q';
            solve(row + 1, 
                  cols | pos, 
                  (diag1 | pos) << 1, 
                  (diag2 | pos) >> 1, 
                  board);
            board[row][col] = '.';
        }
    }
};
```

---

## 🎯 **QUICK DECISION TREE**

### **Choose Your Template:**
```
Problem involves generating all solutions?
├─ Yes → Use Standard Backtracking Template
└─ No → Problem asks for existence only?
   ├─ Yes → Use Early Termination Template
   └─ No → Use Optimized Template

Problem type:
├─ Permutations → Use Permutation Generator
├─ Subsets/Combinations → Use Subset Generator
├─ Grid/Board → Use Grid Solver
├─ Path Finding → Use Path Finder
└─ Target Sum → Use Combination Target Solver
```

---

## 📚 **COMMON PATTERNS QUICK REFERENCE**

### **Pattern 1: Include/Exclude Decisions**
```cpp
// For each element, decide to include or exclude
void backtrack(int index) {
    if (index == n) { /* process result */ return; }
    
    // Exclude current element
    backtrack(index + 1);
    
    // Include current element
    current.push_back(arr[index]);
    backtrack(index + 1);
    current.pop_back();
}
```

### **Pattern 2: Choose from Available Options**
```cpp
// At each step, choose from remaining options
void backtrack() {
    if (isComplete()) { /* process result */ return; }
    
    for (auto option : availableOptions) {
        if (isValid(option)) {
            choose(option);
            backtrack();
            unchoose(option);
        }
    }
}
```

### **Pattern 3: Fill Positions Sequentially**
```cpp
// Fill positions one by one (like Sudoku)
bool solve(int pos) {
    if (pos == totalPositions) return true;
    
    if (isAlreadyFilled(pos)) return solve(pos + 1);
    
    for (int value : possibleValues) {
        if (isValid(pos, value)) {
            place(pos, value);
            if (solve(pos + 1)) return true;
            remove(pos, value);
        }
    }
    return false;
}
```

---

## 🚀 **PERFORMANCE OPTIMIZATION CHECKLIST**

### **Before Coding:**
- [ ] Sort input if it helps with pruning
- [ ] Identify pruning opportunities
- [ ] Consider bit manipulation for boolean states
- [ ] Plan constraint checking order (cheap checks first)

### **During Implementation:**
- [ ] Add bounds checking for early termination
- [ ] Use references to avoid copying
- [ ] Minimize memory allocations in recursion
- [ ] Consider iterative vs recursive based on stack depth

### **After Coding:**
- [ ] Profile for bottlenecks
- [ ] Add memoization if subproblems repeat
- [ ] Optimize constraint checking functions
- [ ] Consider parallel processing for independent branches

---

## 🎯 **COMPLEXITY ANALYSIS SHORTCUTS**

### **Time Complexity Patterns:**
```cpp
// Permutations: O(N! × N)
// Subsets: O(2^N × N)
// N-Queens: O(N!)
// Sudoku: O(9^(empty_cells))
// Combination Sum: O(N^(target/min_candidate))
```

### **Space Complexity:**
```cpp
// Recursion depth: O(max_depth)
// Current state storage: O(solution_size)
// Result storage: O(number_of_solutions × solution_size)
```

---

**🎯 Use these templates as starting points and customize for your specific problem!**
