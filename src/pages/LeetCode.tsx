import { useState, useEffect } from "react";
import { Code2, ExternalLink, CheckCircle, Circle, Search, Filter, Loader2, Bot, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLeetCodeData } from "@/hooks/useLeetCodeData";

export default function LeetCode() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { data: leetcodeData, isLoading: isDataLoading, error } = useLeetCodeData();
  const { toast } = useToast();

  // LeetCode 75 problem list with categories
  const leetcode75Problems = [
    // Array / String
    { slug: "merge-strings-alternately", title: "Merge Strings Alternately", category: "Array / String" },
    { slug: "greatest-common-divisor-of-strings", title: "Greatest Common Divisor of Strings", category: "Array / String" },
    { slug: "kids-with-the-greatest-number-of-candies", title: "Kids With the Greatest Number of Candies", category: "Array / String" },
    { slug: "can-place-flowers", title: "Can Place Flowers", category: "Array / String" },
    { slug: "reverse-vowels-of-a-string", title: "Reverse Vowels of a String", category: "Array / String" },
    { slug: "reverse-words-in-a-string", title: "Reverse Words in a String", category: "Array / String" },
    { slug: "product-of-array-except-self", title: "Product of Array Except Self", category: "Array / String" },
    { slug: "increasing-triplet-subsequence", title: "Increasing Triplet Subsequence", category: "Array / String" },
    { slug: "string-compression", title: "String Compression", category: "Array / String" },
    
    // Two Pointers
    { slug: "move-zeroes", title: "Move Zeroes", category: "Two Pointers" },
    { slug: "is-subsequence", title: "Is Subsequence", category: "Two Pointers" },
    { slug: "container-with-most-water", title: "Container With Most Water", category: "Two Pointers" },
    { slug: "max-number-of-k-sum-pairs", title: "Max Number of K-Sum Pairs", category: "Two Pointers" },
    
    // Sliding Window
    { slug: "maximum-average-subarray-i", title: "Maximum Average Subarray I", category: "Sliding Window" },
    { slug: "maximum-number-of-vowels-in-a-substring-of-given-length", title: "Maximum Number of Vowels in a Substring of Given Length", category: "Sliding Window" },
    { slug: "max-consecutive-ones-iii", title: "Max Consecutive Ones III", category: "Sliding Window" },
    { slug: "longest-subarray-of-1s-after-deleting-one-element", title: "Longest Subarray of 1's After Deleting One Element", category: "Sliding Window" },
    
    // Prefix Sum
    { slug: "find-the-highest-altitude", title: "Find the Highest Altitude", category: "Prefix Sum" },
    { slug: "find-pivot-index", title: "Find Pivot Index", category: "Prefix Sum" },
    
    // Hash Map / Set
    { slug: "find-the-difference-of-two-arrays", title: "Find the Difference of Two Arrays", category: "Hash Map / Set" },
    { slug: "unique-number-of-occurrences", title: "Unique Number of Occurrences", category: "Hash Map / Set" },
    { slug: "determine-if-two-strings-are-close", title: "Determine if Two Strings Are Close", category: "Hash Map / Set" },
    { slug: "equal-row-and-column-pairs", title: "Equal Row and Column Pairs", category: "Hash Map / Set" },
    
    // Stack
    { slug: "removing-stars-from-a-string", title: "Removing Stars From a String", category: "Stack" },
    { slug: "asteroid-collision", title: "Asteroid Collision", category: "Stack" },
    { slug: "decode-string", title: "Decode String", category: "Stack" },
    
    // Queue
    { slug: "number-of-recent-calls", title: "Number of Recent Calls", category: "Queue" },
    { slug: "dota2-senate", title: "Dota2 Senate", category: "Queue" },
    
    // Linked List
    { slug: "delete-the-middle-node-of-a-linked-list", title: "Delete the Middle Node of a Linked List", category: "Linked List" },
    { slug: "odd-even-linked-list", title: "Odd Even Linked List", category: "Linked List" },
    { slug: "reverse-linked-list", title: "Reverse Linked List", category: "Linked List" },
    { slug: "maximum-twin-sum-of-a-linked-list", title: "Maximum Twin Sum of a Linked List", category: "Linked List" },
    
    // Binary Tree - DFS
    { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", category: "Binary Tree - DFS" },
    { slug: "leaf-similar-trees", title: "Leaf-Similar Trees", category: "Binary Tree - DFS" },
    { slug: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", category: "Binary Tree - DFS" },
    { slug: "path-sum-iii", title: "Path Sum III", category: "Binary Tree - DFS" },
    { slug: "longest-zigzag-path-in-a-binary-tree", title: "Longest ZigZag Path in a Binary Tree", category: "Binary Tree - DFS" },
    { slug: "lowest-common-ancestor-of-a-binary-tree", title: "Lowest Common Ancestor of a Binary Tree", category: "Binary Tree - DFS" },
    
    // Binary Tree - BFS
    { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", category: "Binary Tree - BFS" },
    { slug: "maximum-level-sum-of-a-binary-tree", title: "Maximum Level Sum of a Binary Tree", category: "Binary Tree - BFS" },
    
    // Binary Search Tree
    { slug: "search-in-a-binary-search-tree", title: "Search in a Binary Search Tree", category: "Binary Search Tree" },
    { slug: "delete-node-in-a-bst", title: "Delete Node in a BST", category: "Binary Search Tree" },
    
    // Graphs - DFS
    { slug: "keys-and-rooms", title: "Keys and Rooms", category: "Graphs - DFS" },
    { slug: "number-of-provinces", title: "Number of Provinces", category: "Graphs - DFS" },
    { slug: "reorder-routes-to-make-all-paths-lead-to-the-city-zero", title: "Reorder Routes to Make All Paths Lead to the City Zero", category: "Graphs - DFS" },
    { slug: "evaluate-division", title: "Evaluate Division", category: "Graphs - DFS" },
    
    // Graphs - BFS
    { slug: "nearest-exit-from-entrance-in-maze", title: "Nearest Exit from Entrance in Maze", category: "Graphs - BFS" },
    { slug: "rotting-oranges", title: "Rotting Oranges", category: "Graphs - BFS" },
    
    // Heap / Priority Queue
    { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", category: "Heap / Priority Queue" },
    { slug: "smallest-number-in-infinite-set", title: "Smallest Number in Infinite Set", category: "Heap / Priority Queue" },
    { slug: "maximum-subsequence-score", title: "Maximum Subsequence Score", category: "Heap / Priority Queue" },
    { slug: "total-cost-to-hire-k-workers", title: "Total Cost to Hire K Workers", category: "Heap / Priority Queue" },
    
    // Binary Search
    { slug: "guess-number-higher-or-lower", title: "Guess Number Higher or Lower", category: "Binary Search" },
    { slug: "successful-pairs-of-spells-and-potions", title: "Successful Pairs of Spells and Potions", category: "Binary Search" },
    { slug: "find-peak-element", title: "Find Peak Element", category: "Binary Search" },
    { slug: "koko-eating-bananas", title: "Koko Eating Bananas", category: "Binary Search" },
    
    // Backtracking
    { slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", category: "Backtracking" },
    { slug: "combination-sum-iii", title: "Combination Sum III", category: "Backtracking" },
    
    // DP - 1D
    { slug: "n-th-tribonacci-number", title: "N-th Tribonacci Number", category: "DP - 1D" },
    { slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", category: "DP - 1D" },
    { slug: "house-robber", title: "House Robber", category: "DP - 1D" },
    { slug: "domino-and-tromino-tiling", title: "Domino and Tromino Tiling", category: "DP - 1D" },
    
    // DP - Multidimensional
    { slug: "unique-paths", title: "Unique Paths", category: "DP - Multidimensional" },
    { slug: "longest-common-subsequence", title: "Longest Common Subsequence", category: "DP - Multidimensional" },
    { slug: "best-time-to-buy-and-sell-stock-with-transaction-fee", title: "Best Time to Buy and Sell Stock with Transaction Fee", category: "DP - Multidimensional" },
    { slug: "edit-distance", title: "Edit Distance", category: "DP - Multidimensional" },
    
    // Bit Manipulation
    { slug: "counting-bits", title: "Counting Bits", category: "Bit Manipulation" },
    { slug: "single-number", title: "Single Number", category: "Bit Manipulation" },
    { slug: "minimum-flips-to-make-a-or-b-equal-to-c", title: "Minimum Flips to Make a OR b Equal to c", category: "Bit Manipulation" },
    
    // Trie
    { slug: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", category: "Trie" },
    { slug: "search-suggestions-system", title: "Search Suggestions System", category: "Trie" },
    
    // Intervals
    { slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", category: "Intervals" },
    { slug: "minimum-number-of-arrows-to-burst-balloons", title: "Minimum Number of Arrows to Burst Balloons", category: "Intervals" },
    
    // Monotonic Stack
    { slug: "daily-temperatures", title: "Daily Temperatures", category: "Monotonic Stack" },
    { slug: "online-stock-span", title: "Online Stock Span", category: "Monotonic Stack" }
  ];

  // Load user progress from Supabase
  useEffect(() => {
    loadUserProgress();
  }, []);

  // Sync LeetCode data to database when it loads
  useEffect(() => {
    syncLeetCode75ToDatabase();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: progress, error } = await supabase
        .from('leetcode_progress')
        .select('problem_slug, is_solved');

      if (error) throw error;

      const progressMap: Record<string, boolean> = {};
      progress?.forEach(p => {
        progressMap[p.problem_slug] = p.is_solved;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncLeetCode75ToDatabase = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      for (const problem of leetcode75Problems) {
        await supabase
          .from('leetcode_progress')
          .upsert({
            user_id: user.data.user.id,
            problem_title: problem.title,
            problem_slug: problem.slug,
            problem_url: `https://leetcode.com/problems/${problem.slug}/`,
            category: problem.category,
            difficulty: 'Medium', // Default difficulty for LeetCode 75
            is_solved: userProgress[problem.slug] || false
          }, {
            onConflict: 'user_id,problem_slug'
          });
      }
    } catch (error) {
      console.error('Error syncing LeetCode 75 problems:', error);
    }
  };

  const problems = leetcode75Problems;
  const categories = Array.from(new Set(problems.map(p => p.category))).sort();

  const filteredProblems = problems.filter((problem: any) => {
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (category: string) => {
    const categoryProblems = problems.filter(p => p.category === category);
    const solvedCount = categoryProblems.filter(p => userProgress[p.slug]).length;
    return { solved: solvedCount, total: categoryProblems.length };
  };

  const toggleSolved = async (problemSlug: string, problemTitle: string) => {
    const currentStatus = userProgress[problemSlug] || false;
    const newStatus = !currentStatus;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({ title: "Error", description: "Please sign in to track progress", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('leetcode_progress')
        .update({ 
          is_solved: newStatus, 
          solved_at: newStatus ? new Date().toISOString() : null,
          attempts: newStatus ? 1 : 0
        })
        .eq('user_id', user.data.user.id)
        .eq('problem_slug', problemSlug);

      if (error) throw error;

      setUserProgress(prev => ({ ...prev, [problemSlug]: newStatus }));
      
      toast({ 
        title: newStatus ? "Problem Solved! 🎉" : "Progress Updated", 
        description: `${problemTitle} marked as ${newStatus ? 'solved' : 'unsolved'}` 
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({ title: "Error", description: "Failed to update progress", variant: "destructive" });
    }
  };

  const totalSolved = Object.values(userProgress).filter(Boolean).length;
  const totalProblems = problems.length;
  const overallProgress = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <Code2 className="h-8 w-8 text-accent" />
            LeetCode 75 Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Master the top 75 LeetCode problems for interviews
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalSolved}</div>
            <div className="text-sm text-muted-foreground">Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          {isDataLoading && (
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress & Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">{totalSolved}/{totalProblems}</span>
              </div>
              <Progress value={overallProgress} className="h-3 shadow-soft" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              Completion Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-success">{totalSolved}</div>
                <div className="text-xs text-muted-foreground">Solved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-warning">{totalProblems - totalSolved}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => {
          const stats = getCategoryStats(category);
          const progress = (stats.solved / stats.total) * 100;
          
          return (
            <Card 
              key={category}
              className={`bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedCategory === category ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? "All" : category)}
            >
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm leading-tight">{category}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {stats.solved}/{stats.total}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            All
          </Button>
          {selectedCategory !== "All" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory("All")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Problems List */}
      <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Problems {selectedCategory !== "All" && `- ${selectedCategory}`}</span>
            <span className="text-sm text-muted-foreground font-normal">
              {filteredProblems.length} problems
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredProblems.map((problem: any, index: number) => (
              <div
                key={`${problem.title}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 group transform hover:scale-[1.02] hover:shadow-soft"
              >
                <button
                  onClick={() => toggleSolved(problem.slug, problem.title)}
                  className="flex-shrink-0"
                >
                  {userProgress[problem.slug] ? (
                    <CheckCircle className="h-5 w-5 text-success shadow-glow" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium text-sm truncate ${
                      userProgress[problem.slug] ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {problem.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <a 
                    href={`https://leetcode.com/problems/${problem.slug}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open problem</span>
                  </a>
                </Button>
              </div>
            ))}
            
            {filteredProblems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No problems found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}