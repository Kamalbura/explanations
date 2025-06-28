# 🎯 BINARY SEARCH: ULTIMATE MASTERY GUIDE

## 🧠 **CORE CONCEPT: SEARCH SPACE ELIMINATION**

Binary Search is about **intelligently eliminating half the possibilities** in each step, leveraging the sorted property or monotonic nature of the search space.

### **The Binary Search Mindset:**
```
Instead of linear search O(n)
→ Eliminate half the search space each iteration
→ Reduce problem size: n → n/2 → n/4 → n/8 → ... → 1
→ Total steps: log₂(n)
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Why O(log n)?**
```
Search Space: n elements
After k iterations: n/2^k elements remaining
When search space = 1: n/2^k = 1
Therefore: 2^k = n → k = log₂(n)

Real-world impact:
Array size 1,000,000 → 20 steps maximum
Array size 1,000,000,000 → 30 steps maximum
```

### **Binary Search Power:**
| Problem Size | Linear Search | Binary Search | Speedup |
|-------------|---------------|---------------|---------|
| 1,000 | 1,000 | 10 | 100x |
| 1,000,000 | 1,000,000 | 20 | 50,000x |
| 1 billion | 1 billion | 30 | 33 million x |

---

## 🎨 **PATTERN TYPES & TEMPLATES**

### **Pattern 1: Classic Binary Search (Exact Match)**
**Use Case**: Find exact target in sorted array
```cpp
// Template 1: Classic Search
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Found target
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Not found
}
```

### **Pattern 2: Lower Bound (First Occurrence)**
**Use Case**: Find first position where arr[i] >= target
```cpp
// Template 2: Lower Bound
int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] >= target) {
            right = mid; // Could be answer, search left
        } else {
            left = mid + 1; // Too small, search right
        }
    }
    
    return left; // First position >= target
}
```

### **Pattern 3: Upper Bound (Last Occurrence)**
**Use Case**: Find last position where arr[i] <= target
```cpp
// Template 3: Upper Bound  
int upperBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] <= target) {
            left = mid + 1; // Could include mid, search right
        } else {
            right = mid; // Too large, search left
        }
    }
    
    return left - 1; // Last position <= target
}
```

### **Pattern 4: Binary Search on Answer**
**Use Case**: Find minimum/maximum value satisfying condition
```cpp
// Template 4: Search on Answer Space
int binarySearchAnswer(int minVal, int maxVal) {
    int left = minVal, right = maxVal;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (isValid(mid)) {
            right = mid; // Could be answer, try smaller
        } else {
            left = mid + 1; // Not valid, need larger
        }
    }
    
    return left; // Minimum valid answer
}
```

### **Pattern 5: Rotated Array Search**
**Use Case**: Search in rotated sorted array
```cpp
// Template 5: Rotated Array
int searchRotated(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        
        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // Target in left half
            } else {
                left = mid + 1; // Target in right half
            }
        }
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1; // Target in right half
            } else {
                right = mid - 1; // Target in left half
            }
        }
    }
    
    return -1;
}
```

---

## 🔍 **PROBLEM RECOGNITION GUIDE**

### **Recognition Keywords:**
| **Keywords** | **Pattern** | **Template** |
|-------------|-------------|--------------|
| "find target in sorted array" | Classic Search | Template 1 |
| "first occurrence", "insertion position" | Lower Bound | Template 2 |
| "last occurrence", "upper bound" | Upper Bound | Template 3 |
| "minimum value satisfying...", "capacity" | Answer Search | Template 4 |
| "rotated sorted array" | Rotated Search | Template 5 |
| "peak element", "local maximum" | Peak Finding | Modified Template |
| "sqrt(x)", "guess number" | Answer Search | Template 4 |

### **Problem Type Classification:**
```cpp
// Type 1: Direct Search
if (problem_has_sorted_array && looking_for_exact_value)
    use template_1_classic_search;

// Type 2: Boundary Search  
if (looking_for_first_or_last_occurrence)
    use template_2_or_3_bounds;

// Type 3: Optimization
if (minimizing_or_maximizing_some_value)
    use template_4_answer_search;

// Type 4: Modified Structure
if (array_rotated_or_has_special_property)
    use template_5_modified_search;
```

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Search Insert Position**
```cpp
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] >= target) {
                right = mid; // Could be insertion point
            } else {
                left = mid + 1; // Need to go right
            }
        }
        
        return left; // Insertion position
    }
};

// Time: O(log n), Space: O(1)
// Key: Lower bound gives insertion position for any target
```

### **Example 2: Find First and Last Position**
```cpp
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int first = findFirst(nums, target);
        if (first == -1) return {-1, -1};
        
        int last = findLast(nums, target);
        return {first, last};
    }
    
private:
    int findFirst(vector<int>& nums, int target) {
        int left = 0, right = nums.size();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] >= target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return (left < nums.size() && nums[left] == target) ? left : -1;
    }
    
    int findLast(vector<int>& nums, int target) {
        int left = 0, right = nums.size();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return (left > 0 && nums[left - 1] == target) ? left - 1 : -1;
    }
};

// Time: O(log n), Space: O(1)
// Key: Combine lower and upper bound searches
```

### **Example 3: Koko Eating Bananas (Answer Search)**
```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int left = 1, right = *max_element(piles.begin(), piles.end());
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (canFinish(piles, mid, h)) {
                right = mid; // Can finish, try slower
            } else {
                left = mid + 1; // Too slow, need faster
            }
        }
        
        return left;
    }
    
private:
    bool canFinish(vector<int>& piles, int speed, int h) {
        int hours = 0;
        for (int pile : piles) {
            hours += (pile + speed - 1) / speed; // Ceiling division
            if (hours > h) return false; // Early termination
        }
        return hours <= h;
    }
};

// Time: O(n * log(max_pile)), Space: O(1)
// Key: Binary search on eating speed, validate with simulation
```

### **Example 4: Find Peak Element**
```cpp
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < nums[mid + 1]) {
                left = mid + 1; // Peak is on right side
            } else {
                right = mid; // Peak is on left side or at mid
            }
        }
        
        return left; // left == right, pointing to peak
    }
};

// Time: O(log n), Space: O(1)  
// Key: Compare with neighbor to determine peak direction
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Binary Search on 2D Matrix**
```cpp
// Treat m×n matrix as 1D array
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int left = 0, right = m * n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int midVal = matrix[mid / n][mid % n]; // Convert to 2D
        
        if (midVal == target) return true;
        else if (midVal < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return false;
}
```

### **Technique 2: Minimize Maximum (Optimization)**
```cpp
// Pattern: Find minimum value such that maximum <= limit
int minimizeMaximum(vector<int>& arr, int limit) {
    int left = 1, right = *max_element(arr.begin(), arr.end());
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (maxAfterOperation(arr, mid) <= limit) {
            right = mid; // Valid, try smaller
        } else {
            left = mid + 1; // Invalid, need larger
        }
    }
    
    return left;
}
```

### **Technique 3: Floating Point Binary Search**
```cpp
// For problems requiring floating point precision
double binarySearchFloat(double left, double right, double eps = 1e-9) {
    while (right - left > eps) {
        double mid = (left + right) / 2;
        
        if (check(mid)) {
            right = mid;
        } else {
            left = mid;
        }
    }
    
    return (left + right) / 2;
}
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Avoid Integer Overflow**
```cpp
// ❌ Wrong: Can overflow with large values
int mid = (left + right) / 2;

// ✅ Correct: Safe from overflow
int mid = left + (right - left) / 2;
```

### **Strategy 2: Early Termination**
```cpp
// In validation function, return early when possible
bool canFinish(vector<int>& tasks, int time) {
    int total = 0;
    for (int task : tasks) {
        total += (task + time - 1) / time;
        if (total > maxAllowed) return false; // Early exit
    }
    return true;
}
```

### **Strategy 3: Smart Boundary Selection**
```cpp
// Choose boundaries based on problem constraints
int left = 1; // Minimum possible answer
int right = sum(arr); // Maximum possible answer

// Sometimes use tight bounds for efficiency
int right = *max_element(arr.begin(), arr.end());
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Pattern Recognition (30 seconds)**
```cpp
// Decision tree for template selection
if (exact_search_in_sorted_array) use_template_1;
else if (find_boundary_or_insertion) use_template_2_or_3;
else if (optimize_some_parameter) use_template_4;
else if (special_array_structure) use_template_5;
```

### **Step 2: Define Search Space**
```cpp
// For array search
int left = 0, right = n - 1; // Or n for insertion

// For answer search  
int left = min_possible, right = max_possible;

// For floating point
double left = min_val, right = max_val;
```

### **Step 3: Implement Condition Check**
```cpp
// The heart of binary search - what makes it "sorted"?
bool isValid(int candidate) {
    // Check if candidate satisfies our condition
    // This function defines the "monotonic" property
}
```

### **Step 4: Handle Edge Cases**
- Empty array/invalid input
- Single element
- Target at boundaries  
- Target not found
- All elements same

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Infinite Loop**
```cpp
// ❌ Wrong: Can cause infinite loop
while (left < right) {
    int mid = left + (right - left) / 2;
    if (condition) left = mid; // mid can equal left!
    else right = mid - 1;
}

// ✅ Correct: Use biased mid calculation
while (left < right) {
    int mid = left + (right - left + 1) / 2; // Bias toward right
    if (condition) left = mid;
    else right = mid - 1;
}
```

### **Pitfall 2: Wrong Boundary Updates**
```cpp
// ❌ Wrong: Excluding potential answer
if (arr[mid] >= target) right = mid - 1; // Might exclude answer

// ✅ Correct: Include potential answer  
if (arr[mid] >= target) right = mid; // Keep mid as candidate
```

### **Pitfall 3: Off-by-One in Return**
```cpp
// For lower bound (first occurrence)
return left; // ✅ Correct

// For upper bound (last occurrence)  
return left - 1; // ✅ Correct

// For classic search
return left; // Only if found, else -1
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity:**
- **Classic Binary Search**: O(log n)
- **With Validation Function**: O(log n × validation_time)
- **2D Binary Search**: O(log(m×n)) = O(log m + log n)
- **Floating Point**: O(log((right-left)/epsilon))

### **Space Complexity:**
- **Iterative**: O(1) - only variables
- **Recursive**: O(log n) - call stack depth

### **When NOT to Use Binary Search:**
- Unsorted data (unless sorting is acceptable)
- Very small datasets (overhead > benefit)
- No monotonic property to exploit

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Binary Search when you can:

- [ ] **Recognize binary search opportunity** in 30 seconds
- [ ] **Choose correct template** for problem type
- [ ] **Define search space** appropriately  
- [ ] **Write condition check** that maintains monotonic property
- [ ] **Handle all edge cases** without bugs
- [ ] **Convert optimization problems** to binary search
- [ ] **Debug infinite loops** and off-by-one errors quickly

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Identify the Pattern**: "This looks like a binary search because..."
2. **Define Search Space**: "I'll search between X and Y because..."
3. **Explain Condition**: "The monotonic property here is..."
4. **Choose Template**: "I'll use lower bound because we need first occurrence"
5. **Handle Edge Cases**: "Let me check empty array, single element..."
6. **Trace Through Example**: Walk through with concrete values

**Sample Interview Flow:**
```
Interviewer: "Find square root of x"
You: "This is binary search on answer space [1, x].
     The condition is mid² ≤ x, which is monotonic.
     I'll find the largest mid satisfying this condition."
```

---

**🎯 Master Binary Search templates and you'll solve any search/optimization problem efficiently!**
