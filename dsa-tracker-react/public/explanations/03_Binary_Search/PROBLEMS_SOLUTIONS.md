# 🎯 BINARY SEARCH: PROBLEMS & SOLUTIONS

## 📊 **PROBLEM DIFFICULTY BREAKDOWN**
- **Easy Problems**: 4 problems (Foundation building)
- **Medium Problems**: 6 problems (Pattern application) 
- **Hard Problems**: 2 problems (Advanced techniques)
- **Total**: 12 carefully selected problems for complete mastery

---

## 🟢 **EASY PROBLEMS (Foundation)**

### **Problem 1: Binary Search (LeetCode 704)**
**Pattern**: Classical Binary Search
```cpp
// Problem: Find target in sorted array
class Solution {
public:
    int search(vector<int>& nums, int target) {
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
        
        return -1;
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Basic binary search template with safe mid calculation
```

### **Problem 2: Search Insert Position (LeetCode 35)**
**Pattern**: Lower Bound Search
```cpp
// Problem: Find index where target should be inserted
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
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
};

// Time: O(log n), Space: O(1)
// Key Learning: Finding insertion position, boundary handling
```

### **Problem 3: First Bad Version (LeetCode 278)**
**Pattern**: Binary Search on Answer
```cpp
// Problem: Find first bad version in sequence
// The API isBadVersion is defined for you.
bool isBadVersion(int version);

class Solution {
public:
    int firstBadVersion(int n) {
        int left = 1, right = n;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (isBadVersion(mid)) {
                right = mid; // First bad could be mid or earlier
            } else {
                left = mid + 1; // First bad is after mid
            }
        }
        
        return left;
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Binary search without direct array access
```

### **Problem 4: Square Root (LeetCode 69)**
**Pattern**: Binary Search on Answer
```cpp
// Problem: Find integer square root
class Solution {
public:
    int mySqrt(int x) {
        if (x < 2) return x;
        
        int left = 2, right = x / 2;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long long square = (long long)mid * mid;
            
            if (square == x) {
                return mid;
            } else if (square < x) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return right; // Largest integer whose square ≤ x
    }
};

// Time: O(log x), Space: O(1)
// Key Learning: Answer space search, overflow handling
```

---

## 🟡 **MEDIUM PROBLEMS (Pattern Application)**

### **Problem 5: Find First and Last Position (LeetCode 34)**
**Pattern**: Boundary Search
```cpp
// Problem: Find first and last occurrence of target
class Solution {
private:
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
    
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int first = findFirst(nums, target);
        if (first == -1) return {-1, -1};
        
        int last = findLast(nums, target);
        return {first, last};
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Finding boundaries with duplicates
```

### **Problem 6: Search in Rotated Sorted Array (LeetCode 33)**
**Pattern**: Modified Binary Search
```cpp
// Problem: Search in rotated sorted array
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) return mid;
            
            // Determine which half is sorted
            if (nums[left] <= nums[mid]) {
                // Left half is sorted
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                // Right half is sorted
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return -1;
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Handling rotated arrays, identifying sorted half
```

### **Problem 7: Find Peak Element (LeetCode 162)**
**Pattern**: Peak Finding
```cpp
// Problem: Find peak element (greater than neighbors)
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < nums[mid + 1]) {
                left = mid + 1; // Peak is on the right
            } else {
                right = mid; // Peak is on the left (including mid)
            }
        }
        
        return left;
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Moving toward increasing slope to find peak
```

### **Problem 8: Search a 2D Matrix (LeetCode 74)**
**Pattern**: 2D Binary Search
```cpp
// Problem: Search in row and column sorted matrix
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int m = matrix.size(), n = matrix[0].size();
        int left = 0, right = m * n - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midValue = matrix[mid / n][mid % n];
            
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
};

// Time: O(log(m*n)), Space: O(1)
// Key Learning: Converting 2D coordinates to 1D for binary search
```

### **Problem 9: Find Minimum in Rotated Sorted Array (LeetCode 153)**
**Pattern**: Finding Minimum
```cpp
// Problem: Find minimum element in rotated sorted array
class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                // Minimum is in right half
                left = mid + 1;
            } else {
                // Minimum is in left half (including mid)
                right = mid;
            }
        }
        
        return nums[left];
    }
};

// Time: O(log n), Space: O(1)
// Key Learning: Finding minimum in rotated array
```

### **Problem 10: Capacity to Ship Packages in D Days (LeetCode 1011)**
**Pattern**: Binary Search on Answer
```cpp
// Problem: Find minimum ship capacity
class Solution {
private:
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
    
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int left = *max_element(weights.begin(), weights.end());
        int right = accumulate(weights.begin(), weights.end(), 0);
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (canShip(weights, days, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
};

// Time: O(n * log(sum)), Space: O(1)
// Key Learning: Binary search on answer space, not array indices
```

---

## 🔴 **HARD PROBLEMS (Advanced Techniques)**

### **Problem 11: Median of Two Sorted Arrays (LeetCode 4)**
**Pattern**: Partition Binary Search
```cpp
// Problem: Find median of two sorted arrays
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int m = nums1.size(), n = nums2.size();
        int left = 0, right = m;
        
        while (left <= right) {
            int partitionX = left + (right - left) / 2;
            int partitionY = (m + n + 1) / 2 - partitionX;
            
            int maxLeftX = (partitionX == 0) ? INT_MIN : nums1[partitionX - 1];
            int maxLeftY = (partitionY == 0) ? INT_MIN : nums2[partitionY - 1];
            
            int minRightX = (partitionX == m) ? INT_MAX : nums1[partitionX];
            int minRightY = (partitionY == n) ? INT_MAX : nums2[partitionY];
            
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0;
                } else {
                    return max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                right = partitionX - 1;
            } else {
                left = partitionX + 1;
            }
        }
        
        return 0.0;
    }
};

// Time: O(log(min(m,n))), Space: O(1)
// Key Learning: Partitioning arrays for median, advanced binary search
```

### **Problem 12: Split Array Largest Sum (LeetCode 410)**
**Pattern**: Binary Search on Answer with Greedy Validation
```cpp
// Problem: Split array into m subarrays to minimize largest sum
class Solution {
private:
    bool canSplit(vector<int>& nums, int m, int maxSum) {
        int subarrays = 1, currentSum = 0;
        
        for (int num : nums) {
            if (currentSum + num > maxSum) {
                subarrays++;
                currentSum = num;
                if (subarrays > m) return false;
            } else {
                currentSum += num;
            }
        }
        
        return true;
    }
    
public:
    int splitArray(vector<int>& nums, int m) {
        int left = *max_element(nums.begin(), nums.end());
        int right = accumulate(nums.begin(), nums.end(), 0);
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (canSplit(nums, m, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
};

// Time: O(n * log(sum)), Space: O(1)
// Key Learning: Complex validation function with binary search on answer
```

---

## 🎯 **PROBLEM PATTERNS SUMMARY**

### **Template Usage Guide:**
| **Problem Type** | **Template** | **Key Characteristic** |
|------------------|--------------|------------------------|
| Find exact element | Classical | `nums[mid] == target` |
| Find boundaries | First/Last | Continue after finding |
| Find insertion | Lower bound | `left < right` loop |
| Peak finding | Modified | Compare with neighbors |
| Rotated array | Rotation check | Identify sorted half |
| Answer space | Min/Max search | Search on answer range |
| 2D matrix | Coordinate transform | Treat as 1D array |

### **Complexity Analysis:**
- **Most problems**: O(log n) time, O(1) space
- **With validation**: O(n * log(answer_space))
- **2D problems**: O(log(m * n))

---

## 🚀 **PRACTICE STRATEGY**

### **Day 1 Focus (2 hours)**:
- Problems 1-4 (Easy problems)
- Master basic templates
- Focus on boundary handling

### **Day 2 Focus (2 hours)**:
- Problems 5-10 (Medium problems)
- Practice pattern recognition
- Advanced template usage

### **Day 3 Focus (1 hour)**:
- Problems 11-12 (Hard problems)
- Complex validations
- Interview simulation

### **Speed Practice (30 minutes daily)**:
- Solve problems 1-4 in under 10 minutes each
- Focus on bug-free implementation
- Practice explaining approach clearly

---

**🎯 Complete these 12 problems and you'll have binary search mastery for any interview!**
