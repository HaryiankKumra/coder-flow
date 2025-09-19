-- Create productivity app tables
-- Tasks table for to-do functionality
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER, -- in minutes
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schedule table for time blocking
CREATE TABLE public.schedule_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL DEFAULT 'study',
  color TEXT DEFAULT '#3B82F6',
  is_all_day BOOLEAN DEFAULT false,
  task_id UUID, -- optional link to task
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study sessions table for timer/pomodoro tracking
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  session_type TEXT NOT NULL DEFAULT 'focus' CHECK (session_type IN ('focus', 'break', 'pomodoro')),
  category TEXT DEFAULT 'study',
  task_id UUID, -- optional link to task
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- LeetCode progress table
CREATE TABLE public.leetcode_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_title TEXT NOT NULL,
  problem_slug TEXT NOT NULL,
  problem_url TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  is_solved BOOLEAN DEFAULT false,
  solved_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_slug)
);

-- User settings table for preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  pomodoro_duration INTEGER DEFAULT 25, -- minutes
  short_break_duration INTEGER DEFAULT 5, -- minutes
  long_break_duration INTEGER DEFAULT 15, -- minutes
  daily_study_goal INTEGER DEFAULT 360, -- minutes (6 hours)
  preferred_categories TEXT[] DEFAULT ARRAY['study', 'practice', 'project', 'break'],
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leetcode_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own tasks" 
ON public.tasks FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule blocks" 
ON public.schedule_blocks FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own study sessions" 
ON public.study_sessions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own leetcode progress" 
ON public.leetcode_progress FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings" 
ON public.user_settings FOR ALL 
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_blocks_updated_at
  BEFORE UPDATE ON public.schedule_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leetcode_progress_updated_at
  BEFORE UPDATE ON public.leetcode_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();