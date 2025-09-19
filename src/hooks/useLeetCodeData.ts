import { useState, useEffect } from 'react';

export const useLeetCodeData = (username: string = 'your_leetcode_username') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        setLoading(true);
        
        // Using a public LeetCode API endpoint
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch LeetCode data');
        }
        
        const result = await response.json();
        
        // Transform the data to match our expected format
        const transformedData = {
          userStats: {
            submitStatsGlobal: {
              acSubmissionNum: [
                { difficulty: 'Easy', count: result.easySolved || 0 },
                { difficulty: 'Medium', count: result.mediumSolved || 0 },
                { difficulty: 'Hard', count: result.hardSolved || 0 }
              ]
            }
          },
          totalProblems: result.totalSolved || 0,
          totalQuestions: result.totalQuestions || 2500,
          contributionPoints: result.contributionPoints || 0,
          reputation: result.reputation || 0
        };
        
        setData(transformedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching LeetCode data:', err);
        setError(err.message);
        
        // Fallback to mock data if API fails
        setData({
          userStats: {
            submitStatsGlobal: {
              acSubmissionNum: [
                { difficulty: 'Easy', count: 0 },
                { difficulty: 'Medium', count: 0 },
                { difficulty: 'Hard', count: 0 }
              ]
            }
          },
          totalProblems: 0,
          totalQuestions: 2500
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeData();
  }, [username]);

  return { data, loading, error };
};