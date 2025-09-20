import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTasks([]);
        setLoading(false);
        return;
      }

      // Test connection first
      const { error: connectionError } = await supabase
        .from('tasks')
        .select('id')
        .limit(1);
      
      if (connectionError && !connectionError.message.includes('RLS')) {
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error.message);
        throw error;
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error in fetchTasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: session.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};