import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username = 'haryiank' } = await req.json().catch(() => ({}));
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching LeetCode data for user: ${username}`);

    // Fetch user stats from LeetCode GraphQL API
    const statsQuery = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            realName
            aboutMe
            userAvatar
            ranking
          }
        }
      }
    `;

    const statsResponse = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: statsQuery, 
        variables: { username } 
      })
    });

    const statsData = await statsResponse.json();
    console.log('Stats data:', statsData);

    // Fetch all problems from LeetCode API
    const problemsResponse = await fetch("https://leetcode.com/api/problems/all/");
    const problemsData = await problemsResponse.json();
    console.log(`Fetched ${problemsData.stat_status_pairs?.length || 0} problems`);

    // Define our curated problem list with categories
    const curatedProblems = [
      // Array
      { slug: "two-sum", category: "Array" },
      { slug: "best-time-to-buy-and-sell-stock", category: "Array" },
      { slug: "contains-duplicate", category: "Array" },
      { slug: "product-of-array-except-self", category: "Array" },
      { slug: "maximum-subarray", category: "Array" },
      { slug: "maximum-product-subarray", category: "Array" },
      { slug: "find-minimum-in-rotated-sorted-array", category: "Array" },
      { slug: "search-in-rotated-sorted-array", category: "Array" },
      { slug: "3sum", category: "Array" },
      { slug: "container-with-most-water", category: "Array" },

      // Binary
      { slug: "sum-of-two-integers", category: "Binary" },
      { slug: "number-of-1-bits", category: "Binary" },
      { slug: "counting-bits", category: "Binary" },
      { slug: "missing-number", category: "Binary" },
      { slug: "reverse-bits", category: "Binary" },

      // Dynamic Programming
      { slug: "climbing-stairs", category: "Dynamic Programming" },
      { slug: "coin-change", category: "Dynamic Programming" },
      { slug: "longest-increasing-subsequence", category: "Dynamic Programming" },
      { slug: "longest-common-subsequence", category: "Dynamic Programming" },
      { slug: "word-break", category: "Dynamic Programming" },
      { slug: "combination-sum-iv", category: "Dynamic Programming" },
      { slug: "house-robber", category: "Dynamic Programming" },
      { slug: "house-robber-ii", category: "Dynamic Programming" },
      { slug: "decode-ways", category: "Dynamic Programming" },
      { slug: "unique-paths", category: "Dynamic Programming" },
      { slug: "jump-game", category: "Dynamic Programming" },

      // Graph
      { slug: "clone-graph", category: "Graph" },
      { slug: "course-schedule", category: "Graph" },
      { slug: "pacific-atlantic-water-flow", category: "Graph" },
      { slug: "number-of-islands", category: "Graph" },
      { slug: "longest-consecutive-sequence", category: "Graph" },
      { slug: "alien-dictionary", category: "Graph" },
      { slug: "graph-valid-tree", category: "Graph" },
      { slug: "number-of-connected-components-in-an-undirected-graph", category: "Graph" },

      // Interval
      { slug: "insert-interval", category: "Interval" },
      { slug: "merge-intervals", category: "Interval" },
      { slug: "non-overlapping-intervals", category: "Interval" },
      { slug: "meeting-rooms", category: "Interval" },
      { slug: "meeting-rooms-ii", category: "Interval" },

      // Linked List
      { slug: "reverse-linked-list", category: "Linked List" },
      { slug: "linked-list-cycle", category: "Linked List" },
      { slug: "merge-two-sorted-lists", category: "Linked List" },
      { slug: "merge-k-sorted-lists", category: "Linked List" },
      { slug: "remove-nth-node-from-end-of-list", category: "Linked List" },
      { slug: "reorder-list", category: "Linked List" },

      // Matrix
      { slug: "set-matrix-zeroes", category: "Matrix" },
      { slug: "spiral-matrix", category: "Matrix" },
      { slug: "rotate-image", category: "Matrix" },
      { slug: "word-search", category: "Matrix" },

      // String
      { slug: "longest-substring-without-repeating-characters", category: "String" },
      { slug: "longest-repeating-character-replacement", category: "String" },
      { slug: "minimum-window-substring", category: "String" },
      { slug: "valid-anagram", category: "String" },
      { slug: "group-anagrams", category: "String" },
      { slug: "valid-parentheses", category: "String" },
      { slug: "valid-palindrome", category: "String" },
      { slug: "longest-palindromic-substring", category: "String" },
      { slug: "palindromic-substrings", category: "String" },
      { slug: "encode-and-decode-strings", category: "String" },

      // Tree
      { slug: "maximum-depth-of-binary-tree", category: "Tree" },
      { slug: "same-tree", category: "Tree" },
      { slug: "invert-binary-tree", category: "Tree" },
      { slug: "binary-tree-maximum-path-sum", category: "Tree" },
      { slug: "binary-tree-level-order-traversal", category: "Tree" },
      { slug: "serialize-and-deserialize-binary-tree", category: "Tree" },
      { slug: "subtree-of-another-tree", category: "Tree" },
      { slug: "construct-binary-tree-from-preorder-and-inorder-traversal", category: "Tree" },
      { slug: "validate-binary-search-tree", category: "Tree" },
      { slug: "kth-smallest-element-in-a-bst", category: "Tree" },
      { slug: "lowest-common-ancestor-of-a-binary-search-tree", category: "Tree" },
      { slug: "implement-trie-prefix-tree", category: "Tree" },
      { slug: "add-and-search-word-data-structure-design", category: "Tree" },
      { slug: "word-search-ii", category: "Tree" },

      // Heap
      { slug: "merge-k-sorted-lists", category: "Heap" },
      { slug: "top-k-frequent-elements", category: "Heap" },
      { slug: "find-median-from-data-stream", category: "Heap" },
    ];

    // Match curated problems with LeetCode API data
    const problemsMap = new Map();
    if (problemsData.stat_status_pairs) {
      problemsData.stat_status_pairs.forEach((problem: any) => {
        problemsMap.set(problem.stat.question__title_slug, {
          id: problem.stat.frontend_question_id,
          title: problem.stat.question__title,
          slug: problem.stat.question__title_slug,
          difficulty: problem.difficulty?.level === 1 ? 'Easy' : 
                     problem.difficulty?.level === 2 ? 'Medium' : 'Hard',
          paidOnly: problem.paid_only,
          url: `https://leetcode.com/problems/${problem.stat.question__title_slug}/`
        });
      });
    }

    // Build final problem list
    const finalProblems = curatedProblems
      .map(cp => {
        const problemData = problemsMap.get(cp.slug);
        if (!problemData) return null;
        
        return {
          problem_title: problemData.title,
          problem_slug: problemData.slug,
          problem_url: problemData.url,
          category: cp.category,
          difficulty: problemData.difficulty,
          is_premium: problemData.paidOnly || false
        };
      })
      .filter(Boolean);

    console.log(`Processed ${finalProblems.length} curated problems`);

    // Return the data
    return new Response(JSON.stringify({
      success: true,
      userStats: statsData.data?.matchedUser || null,
      problems: finalProblems,
      totalProblems: finalProblems.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-leetcode-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});