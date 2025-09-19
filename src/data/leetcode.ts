export interface LeetCodeProblem {
  title: string;
  url: string;
  category: string;
}

export const leetcodeProblems: LeetCodeProblem[] = [
  // Array
  { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", category: "Array" },
  { title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", category: "Array" },
  { title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", category: "Array" },
  { title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", category: "Array" },
  { title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", category: "Array" },
  { title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", category: "Array" },
  { title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", category: "Array" },
  { title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", category: "Array" },
  { title: "3 Sum", url: "https://leetcode.com/problems/3sum/", category: "Array" },
  { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", category: "Array" },

  // Binary
  { title: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", category: "Binary" },
  { title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", category: "Binary" },
  { title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", category: "Binary" },
  { title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", category: "Binary" },
  { title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", category: "Binary" },

  // Dynamic Programming
  { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", category: "Dynamic Programming" },
  { title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", category: "Dynamic Programming" },
  { title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", category: "Dynamic Programming" },
  { title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", category: "Dynamic Programming" },
  { title: "Word Break Problem", url: "https://leetcode.com/problems/word-break/", category: "Dynamic Programming" },
  { title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum-iv/", category: "Dynamic Programming" },
  { title: "House Robber", url: "https://leetcode.com/problems/house-robber/", category: "Dynamic Programming" },
  { title: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", category: "Dynamic Programming" },
  { title: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", category: "Dynamic Programming" },
  { title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", category: "Dynamic Programming" },
  { title: "Jump Game", url: "https://leetcode.com/problems/jump-game/", category: "Dynamic Programming" },

  // Graph
  { title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", category: "Graph" },
  { title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", category: "Graph" },
  { title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", category: "Graph" },
  { title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", category: "Graph" },
  { title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", category: "Graph" },
  { title: "Alien Dictionary (Premium)", url: "https://leetcode.com/problems/alien-dictionary/", category: "Graph" },
  { title: "Graph Valid Tree (Premium)", url: "https://leetcode.com/problems/graph-valid-tree/", category: "Graph" },
  { title: "Number of Connected Components (Premium)", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", category: "Graph" },

  // Interval
  { title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", category: "Interval" },
  { title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", category: "Interval" },
  { title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", category: "Interval" },
  { title: "Meeting Rooms (Premium)", url: "https://leetcode.com/problems/meeting-rooms/", category: "Interval" },
  { title: "Meeting Rooms II (Premium)", url: "https://leetcode.com/problems/meeting-rooms-ii/", category: "Interval" },

  // Linked List
  { title: "Reverse a Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", category: "Linked List" },
  { title: "Detect Cycle in a Linked List", url: "https://leetcode.com/problems/linked-list-cycle/", category: "Linked List" },
  { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", category: "Linked List" },
  { title: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", category: "Linked List" },
  { title: "Remove Nth Node From End Of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", category: "Linked List" },
  { title: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", category: "Linked List" },

  // Matrix
  { title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/", category: "Matrix" },
  { title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", category: "Matrix" },
  { title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/", category: "Matrix" },
  { title: "Word Search", url: "https://leetcode.com/problems/word-search/", category: "Matrix" },

  // String
  { title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", category: "String" },
  { title: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", category: "String" },
  { title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", category: "String" },
  { title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", category: "String" },
  { title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", category: "String" },
  { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", category: "String" },
  { title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", category: "String" },
  { title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", category: "String" },
  { title: "Palindromic Substrings", url: "https://leetcode.com/problems/palindromic-substrings/", category: "String" },
  { title: "Encode and Decode Strings (Premium)", url: "https://leetcode.com/problems/encode-and-decode-strings/", category: "String" },

  // Tree
  { title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", category: "Tree" },
  { title: "Same Tree", url: "https://leetcode.com/problems/same-tree/", category: "Tree" },
  { title: "Invert/Flip Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", category: "Tree" },
  { title: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", category: "Tree" },
  { title: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", category: "Tree" },
  { title: "Serialize and Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", category: "Tree" },
  { title: "Subtree of Another Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", category: "Tree" },
  { title: "Construct Binary Tree from Preorder and Inorder Traversal", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", category: "Tree" },
  { title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", category: "Tree" },
  { title: "Kth Smallest Element in a BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", category: "Tree" },
  { title: "Lowest Common Ancestor of BST", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", category: "Tree" },
  { title: "Implement Trie (Prefix Tree)", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", category: "Tree" },
  { title: "Add and Search Word", url: "https://leetcode.com/problems/add-and-search-word-data-structure-design/", category: "Tree" },
  { title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", category: "Tree" },

  // Heap
  { title: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", category: "Heap" },
  { title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", category: "Heap" },
  { title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", category: "Heap" },
];

export const categories = [
  "Array", "Binary", "Dynamic Programming", "Graph", 
  "Interval", "Linked List", "Matrix", "String", "Tree", "Heap"
];