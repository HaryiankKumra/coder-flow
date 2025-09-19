import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LeetCodeProblem {
  problem_title: string;
  problem_slug: string;
  problem_url: string;
  category: string;
  difficulty: string;
  is_premium: boolean;
}

interface LeetCodeStats {
  username: string;
  submitStatsGlobal: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
  profile: {
    realName: string;
    aboutMe: string;
    userAvatar: string;
    ranking: number;
  };
}

export const useLeetCodeData = (username: string = 'haryiank') => {
  return useQuery({
    queryKey: ['leetcode-data', username],
    queryFn: async () => {
      console.log('Fetching LeetCode data for:', username);
      
      const { data, error } = await supabase.functions.invoke('fetch-leetcode-data', {
        body: { username }
      });

      if (error) {
        console.error('Error fetching LeetCode data:', error);
        throw new Error(error.message || 'Failed to fetch LeetCode data');
      }

      console.log('LeetCode data received:', data);
      return data as {
        success: boolean;
        userStats: LeetCodeStats | null;
        problems: LeetCodeProblem[];
        totalProblems: number;
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2
  });
};