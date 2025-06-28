# 🎯 BINARY SEARCH: TEMPLATE LIBRARY

## 🚀 **CORE TEMPLATES FOR INSTANT USE**

These templates cover 95% of binary search interview problems. Memorize these patterns and adapt them to specific problems.

---

## 📋 **TEMPLATE 1: CLASSICAL BINARY SEARCH**
**Use Case**: Find exact element in sorted array

```cpp
// Template: Find target element
int binarySearch(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Key Points:
// - Use left <= right (inclusive bounds)
// - Safe mid calculation prevents overflow
// - Eliminate half space each iteration
// - Return -1 if not found
```

**When to Use**: LeetCode 704, basic search problems

---

## 📋 **TEMPLATE 2: FIRST OCCURRENCE SEARCH**
**Use Case**: Find leftmost occurrence of target (with duplicates)

```cpp
// Template: Find first occurrence
int findFirst(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            result = mid;
            right = mid - 1; // Continue searching left
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// Key Points:
// - Save result when found
// - Continue searching left (right = mid - 1)
// - Don't return immediately when found
```

**When to Use**: LeetCode 34 (first position), range queries

---

## 📋 **TEMPLATE 3: LAST OCCURRENCE SEARCH**
**Use Case**: Find rightmost occurrence of target (with duplicates)

```cpp
// Template: Find last occurrence
int findLast(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            result = mid;
            left = mid + 1; // Continue searching right
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// Key Points:
// - Save result when found
// - Continue searching right (left = mid + 1)
// - Mirror of first occurrence
```

**When to Use**: LeetCode 34 (last position), range queries

---

## 📋 **TEMPLATE 4: LOWER BOUND SEARCH**
**Use Case**: Find insertion position (leftmost position where target could be inserted)

```cpp
// Template: Find lower bound (insertion position)
int lowerBound(vector<int>& nums, int target) {
    int left = 0, right = nums.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

// Key Points:
// - Use left < right (exclusive right bound)
// - right = nums.size() (one past last element)
// - No equality check needed
// - Returns insertion position
```

**When to Use**: LeetCode 35 (search insert position), STL lower_bound equivalent

---

## 📋 **TEMPLATE 5: BINARY SEARCH ON ANSWER**
**Use Case**: Find minimum/maximum value that satisfies condition

```cpp
// Template: Binary search on answer space
int binarySearchOnAnswer(int minAnswer, int maxAnswer, function<bool(int)> isValid) {
    int left = minAnswer, right = maxAnswer;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (isValid(mid)) {
            right = mid; // Try to find smaller valid answer
        } else {
            left = mid + 1; // Need larger answer
        }
    }
    
    return left;
}

// Example usage for "Capacity to Ship Packages":
bool canShip(vector<int>& weights, int days, int capacity) {
    int currentWeight = 0, daysUsed = 1;
    
    for (int weight : weights) {
        if (currentWeight + weight > capacity) {
            daysUsed++;
            currentWeight = weight;
            if (daysUsed > days) return false;
        } else {
            currentWeight += weight;
        }
    }
    
    return true;
}

int shipWithinDays(vector<int>& weights, int days) {
    int minCapacity = *max_element(weights.begin(), weights.end());
    int maxCapacity = accumulate(weights.begin(), weights.end(), 0);
    
    return binarySearchOnAnswer(minCapacity, maxCapacity, 
                               [&](int cap) { return canShip(weights, days, cap); });
}

// Key Points:
// - Search on answer space, not array indices
// - Define validation function isValid()
// - Find minimum valid answer
```

**When to Use**: LeetCode 1011 (ship packages), 410 (split array), optimization problems

---

## 📋 **TEMPLATE 6: ROTATED ARRAY SEARCH**
**Use Case**: Search in rotated sorted array

```cpp
// Template: Search in rotated sorted array
int searchRotated(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1; // Target in left sorted half
            } else {
                left = mid + 1;  // Target in right half
            }
        } else {
            // Right half is sorted
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;  // Target in right sorted half
            } else {
                right = mid - 1; // Target in left half
            }
        }
    }
    
    return -1;
}

// Key Points:
// - Identify which half is sorted
// - Check if target is in sorted half
// - Handle rotation point carefully
```

**When to Use**: LeetCode 33 (search rotated array), 81 (with duplicates)

---

## 📋 **TEMPLATE 7: PEAK FINDING**
**Use Case**: Find peak element (greater than neighbors)

```cpp
// Template: Find peak element
int findPeak(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] < nums[mid + 1]) {
            left = mid + 1; // Peak is on the right
        } else {
            right = mid;    // Peak is on the left (including mid)
        }
    }
    
    return left; // Peak index
}

// Key Points:
// - Compare with right neighbor
// - Move toward increasing slope
// - Use left < right (not <=)
```

**When to Use**: LeetCode 162 (find peak element), mountain array problems

---

## 📋 **TEMPLATE 8: 2D MATRIX SEARCH**
**Use Case**: Search in row-wise and column-wise sorted matrix

```cpp
// Template: Search in 2D matrix (treat as 1D)
bool searchMatrix2D(vector<vector<int>>& matrix, int target) {
    if (matrix.empty() || matrix[0].empty()) return false;
    
    int m = matrix.size(), n = matrix[0].size();
    int left = 0, right = m * n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int midValue = matrix[mid / n][mid % n]; // Convert to 2D
        
        if (midValue == target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

// Key Points:
// - Treat 2D matrix as 1D array
// - Convert indices: row = mid / n, col = mid % n
// - Standard binary search logic
```

**When to Use**: LeetCode 74 (search 2D matrix)

---

## 🎯 **TEMPLATE SELECTION GUIDE**

### **Quick Decision Tree:**
```
Is it a sorted array?
├── Yes: Finding specific element?
│   ├── Yes: Use Template 1 (Classical)
│   └── No: Finding boundary/position?
│       ├── First occurrence: Template 2
│       ├── Last occurrence: Template 3
│       └── Insertion position: Template 4
└── No: Is it an optimization problem?
    ├── Yes: Use Template 5 (Binary Search on Answer)
    └── No: Special structure?
        ├── Rotated array: Template 6
        ├── Peak finding: Template 7
        └── 2D matrix: Template 8
```

### **Complexity Reference:**
- **Templates 1-4**: O(log n) time, O(1) space
- **Template 5**: O(log(answer_space) × validation_time)
- **Templates 6-7**: O(log n) time, O(1) space
- **Template 8**: O(log(m×n)) time, O(1) space

---

## 🛠️ **IMPLEMENTATION TIPS**

### **Always Use Safe Mid Calculation:**
```cpp
// ❌ Wrong: Can overflow
int mid = (left + right) / 2;

// ✅ Correct: Safe from overflow
int mid = left + (right - left) / 2;
```

### **Choose Correct Loop Condition:**
```cpp
// For finding exact element or boundaries
while (left <= right) { ... }

// For finding position or insertion point
while (left < right) { ... }
```

### **Boundary Update Patterns:**
```cpp
// When eliminating left half
left = mid + 1;

// When eliminating right half (with equality)
right = mid - 1;

// When eliminating right half (without equality)
right = mid;
```

---

**🎯 Memorize these 8 templates and you'll solve 95% of binary search problems instantly!**
