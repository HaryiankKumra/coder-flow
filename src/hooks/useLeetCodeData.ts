import { useState, useEffect } from 'react';

export const useLeetCodeData = (username: string = 'your_leetcode_username') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        setLoading(true);
        
        // Use mock data for faster loading - replace with real API when needed
        const mockData = {
          userStats: {
            submitStatsGlobal: {
              acSubmissionNum: [
                { difficulty: 'Easy', count: 15 },
                { difficulty: 'Medium', count: 8 },
                { difficulty: 'Hard', count: 2 }
              ]
            }
          },
          totalProblems: 25,
          totalQuestions: 75
        };
        
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(mockData);
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
          totalQuestions: 75
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeData();
  }, [username]);

  return { data, loading, error };
};