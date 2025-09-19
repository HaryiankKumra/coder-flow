import { useState } from "react";
import { Code2, ExternalLink, CheckCircle, Circle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { leetcodeProblems, categories } from "@/data/leetcode";

export default function LeetCode() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  const filteredProblems = leetcodeProblems.filter(problem => {
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (category: string) => {
    const categoryProblems = leetcodeProblems.filter(p => p.category === category);
    const solvedCount = categoryProblems.filter(p => solvedProblems.has(p.title)).length;
    return { solved: solvedCount, total: categoryProblems.length };
  };

  const toggleSolved = (problemTitle: string) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(problemTitle)) {
      newSolved.delete(problemTitle);
    } else {
      newSolved.add(problemTitle);
    }
    setSolvedProblems(newSolved);
  };

  const totalSolved = solvedProblems.size;
  const totalProblems = leetcodeProblems.length;
  const overallProgress = (totalSolved / totalProblems) * 100;

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
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalSolved}</div>
            <div className="text-sm text-muted-foreground">Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
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
            {filteredProblems.map((problem, index) => (
              <div
                key={`${problem.title}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <button
                  onClick={() => toggleSolved(problem.title)}
                  className="flex-shrink-0"
                >
                  {solvedProblems.has(problem.title) ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium text-sm truncate ${
                      solvedProblems.has(problem.title) ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {problem.title}
                    </h3>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {problem.category}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <a 
                    href={problem.url} 
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