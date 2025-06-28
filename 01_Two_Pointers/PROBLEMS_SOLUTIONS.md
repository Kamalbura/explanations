# 🎯 TWO POINTERS: 15 ESSENTIAL PROBLEMS WITH C++ SOLUTIONS

## 🚀 **QUICK REFERENCE GUIDE**

| Problem | Pattern | Difficulty | Key Insight |
|---------|---------|------------|-------------|
| Two Sum II | Opposite Direction | Easy | Sorted array allows smart movement |
| Valid Palindrome | Opposite Direction | Easy | Skip non-alphanumeric chars |
| Remove Duplicates | Same Direction | Easy | Slow maintains unique, fast explores |
| 3Sum | Fixed + Two Pointers | Medium | Fix first, use 2-ptr for rest |
| Container Water | Opposite Direction | Medium | Always move shorter height |
| Trapping Rain Water | Opposite Direction | Hard | Track max heights from both sides |

---

## 🟢 **EASY PROBLEMS**

### **Problem 1: Two Sum II - Input Array Is Sorted**
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            
            if (sum == target) {
                return {left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;  // Need larger number
            } else {
                right--; // Need smaller number
            }
        }
        
        return {}; // Should never reach here per problem constraints
    }
};

// Time: O(n), Space: O(1)
// Key: Sorted array property allows us to make intelligent moves
```

### **Problem 2: Valid Palindrome**
```cpp
class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            // Skip non-alphanumeric from left
            while (left < right && !isalnum(s[left])) {
                left++;
            }
            
            // Skip non-alphanumeric from right
            while (left < right && !isalnum(s[right])) {
                right--;
            }
            
            // Compare characters (case-insensitive)
            if (tolower(s[left]) != tolower(s[right])) {
                return false;
            }
            
            left++;
            right--;
        }
        
        return true;
    }
};

// Time: O(n), Space: O(1)
// Key: Skip irrelevant characters, compare case-insensitive
```

### **Problem 3: Remove Duplicates from Sorted Array**
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int slow = 0; // Position for next unique element
        
        for (int fast = 1; fast < nums.size(); fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        
        return slow + 1; // New length
    }
};

// Time: O(n), Space: O(1)
// Key: Slow maintains unique elements, fast finds them
```

### **Problem 4: Move Zeroes**
```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int slow = 0; // Position for next non-zero
        
        // Move all non-zero elements to front
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != 0) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        
        // Fill remaining positions with zeros
        while (slow < nums.size()) {
            nums[slow] = 0;
            slow++;
        }
    }
};

// Time: O(n), Space: O(1)
// Key: Two-phase approach - collect non-zeros, then fill zeros
```

### **Problem 5: Squares of a Sorted Array**
```cpp
class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n);
        int left = 0, right = n - 1;
        
        // Fill result from largest to smallest (right to left)
        for (int i = n - 1; i >= 0; i--) {
            int leftSquare = nums[left] * nums[left];
            int rightSquare = nums[right] * nums[right];
            
            if (leftSquare > rightSquare) {
                result[i] = leftSquare;
                left++;
            } else {
                result[i] = rightSquare;
                right--;
            }
        }
        
        return result;
    }
};

// Time: O(n), Space: O(n) for result
// Key: Largest square is always at one of the ends
```

---

## 🟡 **MEDIUM PROBLEMS**

### **Problem 6: 3Sum**
```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        
        for (int i = 0; i < nums.size() - 2; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] == nums[i-1]) continue;
            
            int left = i + 1, right = nums.size() - 1;
            int target = -nums[i];
            
            while (left < right) {
                int sum = nums[left] + nums[right];
                
                if (sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    
                    // Skip duplicates
                    while (left < right && nums[left] == nums[left+1]) left++;
                    while (left < right && nums[right] == nums[right-1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
};

// Time: O(n²), Space: O(1) excluding result
// Key: Fix first element, use two pointers for remaining sum
```

### **Problem 7: Container With Most Water**
```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxWater = 0;
        
        while (left < right) {
            int width = right - left;
            int minHeight = min(height[left], height[right]);
            int area = width * minHeight;
            
            maxWater = max(maxWater, area);
            
            // Always move the pointer with smaller height
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
};

// Time: O(n), Space: O(1)
// Key: Moving shorter line is always optimal (greedy choice)
```

### **Problem 8: Sort Colors (Dutch Flag)**
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int low = 0;      // Boundary for 0s
        int mid = 0;      // Current element
        int high = nums.size() - 1; // Boundary for 2s
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else { // nums[mid] == 2
                swap(nums[mid], nums[high]);
                high--;
                // Don't increment mid (need to check swapped element)
            }
        }
    }
};

// Time: O(n), Space: O(1)
// Key: Three-way partitioning with careful pointer management
```

### **Problem 9: 4Sum**
```cpp
class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        int n = nums.size();
        
        for (int i = 0; i < n - 3; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] == nums[i-1]) continue;
            
            for (int j = i + 1; j < n - 2; j++) {
                // Skip duplicates for second element
                if (j > i + 1 && nums[j] == nums[j-1]) continue;
                
                int left = j + 1, right = n - 1;
                long long twoSum = (long long)target - nums[i] - nums[j];
                
                while (left < right) {
                    int sum = nums[left] + nums[right];
                    
                    if (sum == twoSum) {
                        result.push_back({nums[i], nums[j], nums[left], nums[right]});
                        
                        // Skip duplicates
                        while (left < right && nums[left] == nums[left+1]) left++;
                        while (left < right && nums[right] == nums[right-1]) right--;
                        
                        left++;
                        right--;
                    } else if (sum < twoSum) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }
        
        return result;
    }
};

// Time: O(n³), Space: O(1) excluding result
// Key: Extension of 3Sum - fix two elements, use 2-pointers for rest
```

### **Problem 10: Find the Duplicate Number**
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        // Phase 1: Find intersection point in cycle
        int slow = nums[0];
        int fast = nums[0];
        
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        
        // Phase 2: Find entrance to cycle
        int ptr1 = nums[0];
        int ptr2 = slow;
        
        while (ptr1 != ptr2) {
            ptr1 = nums[ptr1];
            ptr2 = nums[ptr2];
        }
        
        return ptr1;
    }
};

// Time: O(n), Space: O(1)
// Key: Floyd's cycle detection - treat array as linked list
```

---

## 🔴 **HARD PROBLEMS**

### **Problem 11: Trapping Rain Water**
```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;
        
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }
        
        return water;
    }
};

// Time: O(n), Space: O(1)
// Key: Track max heights from both sides, process from lower side
```

### **Problem 12: Minimum Window Substring**
```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> need, window;
        
        // Count characters in t
        for (char c : t) need[c]++;
        
        int left = 0, right = 0;
        int valid = 0; // Number of characters that satisfy frequency
        int start = 0, len = INT_MAX;
        
        while (right < s.size()) {
            // Expand window
            char c = s[right];
            right++;
            
            if (need.count(c)) {
                window[c]++;
                if (window[c] == need[c]) {
                    valid++;
                }
            }
            
            // Contract window when valid
            while (valid == need.size()) {
                // Update minimum window
                if (right - left < len) {
                    start = left;
                    len = right - left;
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
        
        return len == INT_MAX ? "" : s.substr(start, len);
    }
};

// Time: O(|s| + |t|), Space: O(|s| + |t|)
// Key: Sliding window with character frequency tracking
```

---

## 📊 **PROBLEM PATTERNS SUMMARY**

### **By Pattern Type:**
1. **Opposite Direction (6 problems)**: Two Sum II, Valid Palindrome, Container Water, Trapping Rain Water
2. **Same Direction (4 problems)**: Remove Duplicates, Move Zeroes, Find Duplicate, Squares Array
3. **Fixed + Two Pointers (2 problems)**: 3Sum, 4Sum
4. **Sliding Window (1 problem)**: Minimum Window Substring
5. **Special Techniques (2 problems)**: Sort Colors (Dutch Flag), Find Duplicate (Floyd's)

### **By Difficulty:**
- **Easy (5)**: Foundation building, pattern recognition
- **Medium (4)**: Core interview level, combining techniques
- **Hard (3)**: Advanced optimizations, complex state management

---

## 🎯 **PRACTICE SCHEDULE FOR 2 WEEKS**

### **Week 1: Foundation (Easy + Medium)**
- **Day 1-2**: Easy problems (1-5) - Master basic patterns
- **Day 3-4**: Medium problems (6-9) - Learn advanced techniques
- **Day 5**: Review and speed practice
- **Day 6-7**: Combine with other patterns

### **Week 2: Mastery (Medium + Hard)**
- **Day 8-10**: Hard problems (10-12) - Advanced optimizations
- **Day 11-12**: Speed solving all problems
- **Day 13**: Mock interview scenarios
- **Day 14**: Final review and weak areas

---

## 🏆 **SUCCESS METRICS**

After mastering these problems, you should be able to:
- [ ] Identify two-pointer opportunities in 30 seconds
- [ ] Choose correct pattern (same vs opposite direction) immediately
- [ ] Solve any easy two-pointer problem in 5-7 minutes
- [ ] Solve medium problems in 10-15 minutes
- [ ] Handle edge cases and duplicates automatically
- [ ] Combine two-pointers with other techniques

**🚀 Next Level: Move to Sliding Window or Binary Search patterns!**
