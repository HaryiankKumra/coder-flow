import { Calendar, CheckSquare, Timer, Code2, TrendingUp, Target, Clock, BookOpen, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useLeetCodeData } from "@/hooks/useLeetCodeData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { tasks, loading: tasksLoading, updateTask } = useTasks();
  const { data: leetcodeData, loading: leetcodeLoading } = useLeetCodeData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [userName, setUserName] = useState<string>('User');

  // Get user name from auth
  useEffect(() => {
    const getUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user?.email) {
          setUserName(user.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Error getting user name:', error);
      }
    };
    getUserName();
  }, []);

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = task.due_date ? new Date(task.due_date).toDateString() : today;
    return taskDate === today;
  });

  const completedTasks = todaysTasks.filter(task => task.status === 'completed');
  const pendingTasks = todaysTasks.filter(task => task.status !== 'completed');

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(taskId, { status: newStatus });
      toast({
        title: newStatus === 'completed' ? "Task Completed! 🎉" : "Task Reopened",
        description: "Task status updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const generateAISchedule = async () => {
    setIsGeneratingSchedule(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // For now, show a simple success message
      toast({
        title: "AI Schedule Generated! 🤖",
        description: "Schedule optimization feature coming soon!",
      });
    } catch (error: any) {
      console.error('Error generating AI schedule:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI schedule.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Calculate LeetCode stats
  const leetcodeStats = leetcodeData?.userStats?.submitStatsGlobal?.acSubmissionNum || [];
  
  const totalSolved = leetcodeStats.reduce((sum: number, stat: any) => sum + stat.count, 0);
  const totalProblems = leetcodeData?.totalProblems || 75;
  const leetcodeProgress = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground mt-2 text-sm lg:text-base">
            Here's your productivity overview for today
          </p>
        </div>
        
        <Button
          onClick={generateAISchedule}
          disabled={isGeneratingSchedule}
          className="bg-gradient-primary hover:opacity-90 shadow-glow w-full md:w-auto"
          size="sm"
        >
          {isGeneratingSchedule ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Bot className="h-4 w-4 mr-2" />
          )}
          {isGeneratingSchedule ? 'Generating...' : 'AI Schedule'}
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-3 lg:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
            <CheckSquare className="h-3 w-3 lg:h-4 lg:w-4 text-success" />
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="text-lg lg:text-2xl font-bold text-success">
              {completedTasks.length}/{todaysTasks.length}
            </div>
            <p className="text-xs text-muted-foreground">Today's progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <Timer className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="text-lg lg:text-2xl font-bold text-primary">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">All tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              LeetCode Progress
            </CardTitle>
            <Code2 className="h-3 w-3 lg:h-4 lg:w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            {leetcodeLoading ? (
              <div className="text-lg lg:text-2xl font-bold text-accent">...</div>
            ) : (
            <div className="text-lg lg:text-2xl font-bold text-accent">{leetcodeProgress}%</div>
            )}
            <p className="text-xs text-muted-foreground">{totalSolved}/{totalProblems} problems</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <Target className="h-3 w-3 lg:h-4 lg:w-4 text-warning" />
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="text-lg lg:text-2xl font-bold text-warning">
              {todaysTasks.length > 0 ? Math.round((completedTasks.length / todaysTasks.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Today's completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-soft backdrop-blur-sm">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-success" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 lg:p-6 pt-0">
            {tasksLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : todaysTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks for today</p>
                <p className="text-sm">Add some tasks to get started!</p>
              </div>
            ) : (
            todaysTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 transform hover:scale-[1.02]">
                <button
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.status === 'completed'
                      ? 'bg-success border-success shadow-glow' 
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {task.status === 'completed' && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
                <span className={`flex-1 transition-all duration-200 ${
                  task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                }`}>
                  {task.title}
                </span>
              </div>
            ))
            )}
            <Button 
              className="w-full mt-4 bg-gradient-primary hover:opacity-90 shadow-soft" 
              size="sm"
              onClick={() => navigate('/todo')}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* LeetCode Progress */}
        <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Code2 className="h-4 w-4 lg:h-5 lg:w-5 text-accent" />
              LeetCode Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            {leetcodeStats.length > 0 ? (
              leetcodeStats.map((stat: any) => (
                <div key={stat.difficulty} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stat.difficulty}</span>
                    <span className="text-muted-foreground">{stat.count}</span>
                  </div>
                  <Progress 
                    value={Math.min((stat.count / 20) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              ))
            ) : (
              ['Easy', 'Medium', 'Hard'].map((difficulty) => (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{difficulty}</span>
                    <span className="text-muted-foreground">0</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              ))
            )}
            <Button 
              className="w-full mt-4 bg-gradient-primary hover:opacity-90 shadow-soft" 
              size="sm"
              onClick={() => navigate('/leetcode')}
            >
              Practice Problems
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 lg:p-6 pt-0">
            {tasks.slice(0, 3).map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 transform hover:scale-[1.02] transition-all duration-200">
                <div className="w-2 h-2 bg-primary rounded-full shadow-glow" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                  task.status === 'completed' ? 'bg-success/20 text-success' :
                  task.status === 'in_progress' ? 'bg-warning/20 text-warning' :
                  'bg-muted/20 text-muted-foreground'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft backdrop-blur-sm">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-accent" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 lg:p-6 pt-0">
            <Button 
              className="w-full justify-start bg-gradient-primary hover:opacity-90 shadow-soft" 
              onClick={() => navigate('/schedule')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button 
              className="w-full justify-start bg-gradient-secondary hover:opacity-90" 
              variant="outline"
              onClick={() => navigate('/timer')}
            >
              <Timer className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
            <Button 
              className="w-full justify-start bg-gradient-secondary hover:opacity-90" 
              variant="outline"
              onClick={() => navigate('/todo')}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}