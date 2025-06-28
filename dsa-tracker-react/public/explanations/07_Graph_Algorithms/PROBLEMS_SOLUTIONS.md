# 🎯 GRAPH ALGORITHMS: ESSENTIAL PROBLEMS & SOLUTIONS

## 🧠 **PROBLEM CATEGORIZATION**

### **TIER 1: FUNDAMENTAL PATTERNS (Master These First)**
1. **Graph Traversal (DFS/BFS)**
2. **Connected Components**
3. **Cycle Detection**
4. **Topological Sort**

### **TIER 2: SHORTEST PATH ALGORITHMS**
5. **BFS Shortest Path (Unweighted)**
6. **Dijkstra's Algorithm (Weighted)**
7. **Bellman-Ford (Negative Weights)**
8. **Floyd-Warshall (All Pairs)**

### **TIER 3: ADVANCED GRAPH ALGORITHMS**
9. **Union-Find Applications**
10. **Minimum Spanning Tree**

---

## 💻 **TIER 1: FUNDAMENTAL PATTERNS**

### **Problem 1: Number of Islands (Leetcode 200)**
```cpp
// Problem: Count connected components in 2D binary grid
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int islands = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    dfsMarkIsland(grid, i, j);
                }
            }
        }
        
        return islands;
    }
    
private:
    void dfsMarkIsland(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        
        // Boundary check and water check
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') {
            return;
        }
        
        // Mark current cell as visited (turn to water)
        grid[i][j] = '0';
        
        // Explore all 4 directions
        dfsMarkIsland(grid, i - 1, j); // Up
        dfsMarkIsland(grid, i + 1, j); // Down
        dfsMarkIsland(grid, i, j - 1); // Left
        dfsMarkIsland(grid, i, j + 1); // Right
    }
};

// Time: O(M×N), Space: O(M×N) worst case for recursion
// Pattern: Connected component counting using DFS
// Key Insight: Each unvisited '1' starts a new island
```

### **Problem 2: Clone Graph (Leetcode 133)**
```cpp
// Problem: Create deep copy of undirected graph
class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> cloned;
        return dfsClone(node, cloned);
    }
    
private:
    Node* dfsClone(Node* original, unordered_map<Node*, Node*>& cloned) {
        // If already cloned, return existing clone
        if (cloned.count(original)) {
            return cloned[original];
        }
        
        // Create new node with same value
        Node* clone = new Node(original->val);
        cloned[original] = clone; // Mark as cloned before recursion
        
        // Clone all neighbors
        for (Node* neighbor : original->neighbors) {
            clone->neighbors.push_back(dfsClone(neighbor, cloned));
        }
        
        return clone;
    }
};

// Time: O(V + E), Space: O(V) for cloned map
// Pattern: Graph traversal with memoization
// Key Insight: Clone before recursing to handle cycles
```

### **Problem 3: Course Schedule (Leetcode 207)**
```cpp
// Problem: Determine if all courses can be finished (cycle detection)
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list: prerequisite -> course
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prerequisite = prereq[1];
            
            graph[prerequisite].push_back(course);
            indegree[course]++;
        }
        
        // Kahn's algorithm for topological sort
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i); // Courses with no prerequisites
            }
        }
        
        int completedCourses = 0;
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            completedCourses++;
            
            // Process all courses that depend on current
            for (int nextCourse : graph[current]) {
                indegree[nextCourse]--;
                if (indegree[nextCourse] == 0) {
                    q.push(nextCourse);
                }
            }
        }
        
        return completedCourses == numCourses; // No cycle if all completed
    }
};

// Time: O(V + E), Space: O(V + E)
// Pattern: Cycle detection using topological sort
// Key Insight: If topological sort processes all nodes, no cycle exists
```

### **Problem 4: Course Schedule II (Leetcode 210)**
```cpp
// Problem: Return valid ordering of courses (topological sort)
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        
        // Build graph
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prerequisite = prereq[1];
            
            graph[prerequisite].push_back(course);
            indegree[course]++;
        }
        
        // Topological sort using Kahn's algorithm
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> order;
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            order.push_back(current);
            
            for (int next : graph[current]) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        // Check if valid topological order exists
        return order.size() == numCourses ? order : vector<int>();
    }
};

// Time: O(V + E), Space: O(V + E)
// Pattern: Topological sort with result collection
// Key Insight: Order of processing gives valid topological order
```

---

## 💻 **TIER 2: SHORTEST PATH ALGORITHMS**

### **Problem 5: Shortest Path in Binary Matrix (Leetcode 1091)**
```cpp
// Problem: Shortest path from top-left to bottom-right in binary matrix
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        
        // Check if path is possible
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) {
            return -1;
        }
        
        // Special case: single cell
        if (n == 1) return 1;
        
        // BFS for shortest path in unweighted graph
        queue<pair<int,int>> q;
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        
        q.push({0, 0});
        visited[0][0] = true;
        
        // 8 directions (including diagonals)
        vector<pair<int,int>> directions = {
            {-1,-1}, {-1,0}, {-1,1},
            {0,-1},          {0,1},
            {1,-1},  {1,0},  {1,1}
        };
        
        int pathLength = 1;
        
        while (!q.empty()) {
            int size = q.size();
            
            // Process all nodes at current level
            for (int i = 0; i < size; i++) {
                auto [row, col] = q.front();
                q.pop();
                
                // Check if reached destination
                if (row == n-1 && col == n-1) {
                    return pathLength;
                }
                
                // Explore all 8 directions
                for (auto [dr, dc] : directions) {
                    int newRow = row + dr;
                    int newCol = col + dc;
                    
                    if (isValid(newRow, newCol, n) && 
                        grid[newRow][newCol] == 0 && 
                        !visited[newRow][newCol]) {
                        
                        visited[newRow][newCol] = true;
                        q.push({newRow, newCol});
                    }
                }
            }
            
            pathLength++;
        }
        
        return -1; // No path found
    }
    
private:
    bool isValid(int row, int col, int n) {
        return row >= 0 && row < n && col >= 0 && col < n;
    }
};

// Time: O(N²), Space: O(N²)
// Pattern: BFS for shortest path in unweighted grid
// Key Insight: BFS guarantees shortest path in unweighted graphs
```

### **Problem 6: Network Delay Time (Leetcode 743)**
```cpp
// Problem: Time for signal to reach all nodes (Dijkstra's algorithm)
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Build adjacency list
        vector<vector<pair<int,int>>> graph(n + 1);
        for (auto& time : times) {
            int u = time[0], v = time[1], w = time[2];
            graph[u].push_back({v, w});
        }
        
        // Dijkstra's algorithm
        vector<int> dist(n + 1, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        dist[k] = 0;
        pq.push({0, k}); // {distance, node}
        
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            
            // Skip if we've found a better path already
            if (d > dist[u]) continue;
            
            // Relax all neighbors
            for (auto [v, weight] : graph[u]) {
                int newDist = dist[u] + weight;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.push({newDist, v});
                }
            }
        }
        
        // Find maximum distance to any reachable node
        int maxTime = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) {
                return -1; // Some node is unreachable
            }
            maxTime = max(maxTime, dist[i]);
        }
        
        return maxTime;
    }
};

// Time: O((V + E) log V), Space: O(V + E)
// Pattern: Single-source shortest path with Dijkstra
// Key Insight: Maximum shortest distance = time for all nodes to receive signal
```

### **Problem 7: Cheapest Flights Within K Stops (Leetcode 787)**
```cpp
// Problem: Shortest path with constraint on number of edges (Bellman-Ford variant)
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // Bellman-Ford with at most k+1 edges
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;
        
        // Relax edges at most k+1 times
        for (int i = 0; i <= k; i++) {
            vector<int> temp = dist; // Snapshot of current distances
            
            for (auto& flight : flights) {
                int u = flight[0], v = flight[1], price = flight[2];
                
                if (dist[u] != INT_MAX) {
                    temp[v] = min(temp[v], dist[u] + price);
                }
            }
            
            dist = temp;
        }
        
        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};

// Alternative: Modified Dijkstra with state (node, stops)
class Solution2 {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<vector<pair<int,int>>> graph(n);
        for (auto& flight : flights) {
            graph[flight[0]].push_back({flight[1], flight[2]});
        }
        
        // Priority queue: {cost, {node, stops}}
        priority_queue<pair<int,pair<int,int>>, vector<pair<int,pair<int,int>>>, greater<>> pq;
        pq.push({0, {src, 0}});
        
        // Track minimum cost to reach each node with at most i stops
        vector<vector<int>> visited(n, vector<int>(k + 2, INT_MAX));
        
        while (!pq.empty()) {
            auto [cost, state] = pq.top();
            auto [node, stops] = state;
            pq.pop();
            
            if (node == dst) return cost;
            
            if (stops > k || cost > visited[node][stops]) continue;
            visited[node][stops] = cost;
            
            for (auto [next, price] : graph[node]) {
                int newCost = cost + price;
                int newStops = stops + 1;
                
                if (newStops <= k + 1 && newCost < visited[next][newStops]) {
                    pq.push({newCost, {next, newStops}});
                }
            }
        }
        
        return -1;
    }
};

// Time: O(V × K) for Bellman-Ford, O((V + E) × K log(V × K)) for Dijkstra
// Space: O(V × K)
// Pattern: Constrained shortest path
// Key Insight: Track state as (node, remaining_stops)
```

### **Problem 8: All Paths From Source to Target (Leetcode 797)**
```cpp
// Problem: Find all paths from source to target in DAG
class Solution {
public:
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
        vector<vector<int>> result;
        vector<int> path;
        
        dfs(graph, 0, graph.size() - 1, path, result);
        return result;
    }
    
private:
    void dfs(vector<vector<int>>& graph, int node, int target, 
             vector<int>& path, vector<vector<int>>& result) {
        path.push_back(node);
        
        if (node == target) {
            result.push_back(path);
        } else {
            for (int neighbor : graph[node]) {
                dfs(graph, neighbor, target, path, result);
            }
        }
        
        path.pop_back(); // Backtrack
    }
};

// Time: O(2^V × V) in worst case, Space: O(V) for recursion
// Pattern: Path enumeration using DFS + backtracking
// Key Insight: Since it's a DAG, no need for visited array
```

---

## 💻 **TIER 3: ADVANCED GRAPH ALGORITHMS**

### **Problem 9: Number of Connected Components (Leetcode 323)**
```cpp
// Problem: Count connected components using Union-Find
class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        UnionFind uf(n);
        
        // Union all connected nodes
        for (auto& edge : edges) {
            uf.unite(edge[0], edge[1]);
        }
        
        // Count unique roots
        unordered_set<int> components;
        for (int i = 0; i < n; i++) {
            components.insert(uf.find(i));
        }
        
        return components.size();
    }
    
private:
    class UnionFind {
        vector<int> parent, rank;
        
    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
            iota(parent.begin(), parent.end(), 0);
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }
        
        bool unite(int x, int y) {
            int rootX = find(x), rootY = find(y);
            if (rootX == rootY) return false;
            
            // Union by rank
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            
            return true;
        }
    };
};

// Time: O(E × α(V)), Space: O(V) where α is inverse Ackermann
// Pattern: Connected components using Union-Find
// Key Insight: Each unique root represents a component
```

### **Problem 10: Minimum Spanning Tree - Kruskal's Algorithm**
```cpp
// Problem: Find minimum cost to connect all nodes
class Solution {
public:
    int minimumCost(int n, vector<vector<int>>& connections) {
        if (connections.size() < n - 1) return -1; // Not enough edges
        
        // Sort edges by weight
        sort(connections.begin(), connections.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[2] < b[2];
             });
        
        UnionFind uf(n + 1); // 1-indexed
        int totalCost = 0;
        int edgesUsed = 0;
        
        for (auto& edge : connections) {
            int u = edge[0], v = edge[1], cost = edge[2];
            
            if (uf.unite(u, v)) {
                totalCost += cost;
                edgesUsed++;
                
                if (edgesUsed == n - 1) {
                    break; // MST complete
                }
            }
        }
        
        return edgesUsed == n - 1 ? totalCost : -1;
    }
    
private:
    class UnionFind {
        vector<int> parent, rank;
        
    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
            iota(parent.begin(), parent.end(), 0);
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        
        bool unite(int x, int y) {
            int rootX = find(x), rootY = find(y);
            if (rootX == rootY) return false;
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            
            return true;
        }
    };
};

// Time: O(E log E), Space: O(V)
// Pattern: MST using Kruskal's algorithm
// Key Insight: Greedily add minimum weight edges that don't create cycles
```

---

## 🎯 **GRAPH ALGORITHM TEMPLATES**

### **Template 1: DFS Traversal**
```cpp
void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {
    visited[node] = true;
    // Process current node
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}
```

### **Template 2: BFS Traversal**
```cpp
void bfs(int start, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        // Process current node
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

### **Template 3: Dijkstra's Shortest Path**
```cpp
vector<int> dijkstra(int start, vector<vector<pair<int,int>>>& graph) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue;
        
        for (auto [v, weight] : graph[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;
}
```

### **Template 4: Topological Sort (Kahn's Algorithm)**
```cpp
vector<int> topologicalSort(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);
    
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) {
            indegree[v]++;
        }
    }
    
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> result;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        
        for (int v : graph[u]) {
            indegree[v]--;
            if (indegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    return result.size() == n ? result : vector<int>();
}
```

---

## 🔧 **OPTIMIZATION TECHNIQUES**

### **1. Bidirectional BFS**
```cpp
// When finding shortest path between two specific nodes
int bidirectionalBFS(int start, int target, vector<vector<int>>& graph) {
    if (start == target) return 0;
    
    unordered_set<int> frontierA, frontierB;
    unordered_set<int> visitedA, visitedB;
    
    frontierA.insert(start);
    frontierB.insert(target);
    visitedA.insert(start);
    visitedB.insert(target);
    
    int level = 0;
    
    while (!frontierA.empty() && !frontierB.empty()) {
        level++;
        
        // Always expand smaller frontier
        if (frontierA.size() > frontierB.size()) {
            swap(frontierA, frontierB);
            swap(visitedA, visitedB);
        }
        
        unordered_set<int> nextFrontier;
        
        for (int node : frontierA) {
            for (int neighbor : graph[node]) {
                if (visitedB.count(neighbor)) {
                    return level; // Found intersection
                }
                
                if (!visitedA.count(neighbor)) {
                    visitedA.insert(neighbor);
                    nextFrontier.insert(neighbor);
                }
            }
        }
        
        frontierA = nextFrontier;
    }
    
    return -1;
}
```

### **2. Early Termination in DFS**
```cpp
bool dfsWithEarlyTermination(int node, int target, vector<vector<int>>& graph, 
                            vector<bool>& visited) {
    if (node == target) return true;
    
    visited[node] = true;
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            if (dfsWithEarlyTermination(neighbor, target, graph, visited)) {
                return true; // Found target, stop searching
            }
        }
    }
    
    return false;
}
```

---

## 🏆 **MASTERY CHECKLIST**

- [ ] **Traversal**: Implement DFS and BFS from memory
- [ ] **Modeling**: Convert problem to appropriate graph representation
- [ ] **Shortest Path**: Choose correct algorithm (BFS/Dijkstra/Bellman-Ford)
- [ ] **Cycle Detection**: Use DFS colors or topological sort
- [ ] **Connected Components**: Use DFS or Union-Find efficiently
- [ ] **Optimization**: Apply bidirectional search and early termination
- [ ] **MST**: Implement Kruskal's or Prim's algorithm

---

## 🚀 **INTERVIEW STRATEGY**

1. **Identify Graph Structure**: "I can model this as a graph where..."
2. **Choose Algorithm**: "For this problem, I need [algorithm] because..."
3. **Analyze Complexity**: "This gives us O(V + E) time which is optimal..."
4. **Handle Edge Cases**: "I need to check for disconnected components..."
5. **Optimize**: "We can improve with early termination/bidirectional search..."

---

**🎯 Master these 10 problems and you'll handle any graph algorithm interview question!**
