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

  // Load user progress from Supabase
  useEffect(() => {
    loadUserProgress();
  }, []);

  // Sync LeetCode data to database when it loads
  useEffect(() => {
    if (leetcodeData && 'success' in leetcodeData && leetcodeData.success && 'problems' in leetcodeData) {
      syncProblemsToDatabase();
    }
  }, [leetcodeData]);

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

  const syncProblemsToDatabase = async () => {
    if (!leetcodeData || !('problems' in leetcodeData) || !leetcodeData.problems) return;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      for (const problem of (leetcodeData.problems as any[])) {
        await supabase
          .from('leetcode_progress')
          .upsert({
            user_id: user.data.user.id,
            problem_title: problem.problem_title,
            problem_slug: problem.problem_slug,
            problem_url: problem.problem_url,
            category: problem.category,
            difficulty: problem.difficulty,
            is_solved: userProgress[problem.problem_slug] || false
          }, {
            onConflict: 'user_id,problem_slug'
          });
      }
    } catch (error) {
      console.error('Error syncing problems:', error);
    }
  };

  const problems = (leetcodeData && 'problems' in leetcodeData ? leetcodeData.problems : []) as any[];
  const categories = Array.from(new Set(problems.map((p: any) => p.category))).sort();

  const filteredProblems = problems.filter((problem: any) => {
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    const matchesSearch = problem.problem_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (category: string) => {
    const categoryProblems = problems.filter((p: any) => p.category === category);
    const solvedCount = categoryProblems.filter((p: any) => userProgress[p.problem_slug]).length;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <Code2 className="h-8 w-8 text-accent" />
            LeetCode Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your coding interview preparation progress
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {leetcodeData && 'userStats' in leetcodeData && leetcodeData.userStats && (
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{(leetcodeData.userStats as any).profile?.realName || 'haryiank'}</div>
              <div className="text-sm text-muted-foreground">LeetCode User</div>
            </div>
          )}
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
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">{totalSolved}/{totalProblems}</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* LeetCode Stats */}
        {leetcodeData && 'userStats' in leetcodeData && leetcodeData.userStats && (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                LeetCode Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-4 text-center">
                {((leetcodeData.userStats as any)?.submitStatsGlobal?.acSubmissionNum || []).map((stat: any, index: number) => (
                  <div key={index}>
                    <div className="text-lg font-bold text-primary">{stat.count}</div>
                    <div className="text-xs text-muted-foreground">{stat.difficulty}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => {
          const stats = getCategoryStats(category);
          const progress = (stats.solved / stats.total) * 100;
          
          return (
            <Card 
              key={category}
              className={`bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === category ? 'ring-2 ring-primary' : ''
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
      <Card className="bg-gradient-card border-0 shadow-soft">
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
                key={`${problem.problem_title}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <button
                  onClick={() => toggleSolved(problem.problem_slug, problem.problem_title)}
                  className="flex-shrink-0"
                >
                  {userProgress[problem.problem_slug] ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium text-sm truncate ${
                      userProgress[problem.problem_slug] ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {problem.problem_title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {problem.category}
                      </Badge>
                      <Badge 
                        variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'} 
                        className="text-xs flex-shrink-0"
                      >
                        {problem.difficulty}
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
                    href={problem.problem_url} 
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