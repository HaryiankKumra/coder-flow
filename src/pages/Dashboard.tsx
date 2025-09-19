import { Calendar, CheckSquare, Timer, Code2, TrendingUp, Target, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome back, Haryian!
        </h1>
        <p className="text-muted-foreground">
          Here's your productivity overview for today
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12/15</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Time Today
            </CardTitle>
            <Timer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4h 32m</div>
            <p className="text-xs text-muted-foreground">Target: 6h</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              LeetCode Progress
            </CardTitle>
            <Code2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">68%</div>
            <p className="text-xs text-muted-foreground">54/79 problems</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Goal
            </CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">85%</div>
            <p className="text-xs text-muted-foreground">34/40 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-success" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { task: "Complete React project setup", completed: true },
              { task: "Solve 3 LeetCode problems", completed: true },
              { task: "Review system design concepts", completed: false },
              { task: "Practice data structures", completed: false },
              { task: "Work on portfolio website", completed: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  item.completed 
                    ? 'bg-success border-success' 
                    : 'border-muted-foreground'
                }`}>
                  {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.task}
                </span>
              </div>
            ))}
            <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90" size="sm">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* LeetCode Progress */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-accent" />
              LeetCode Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { category: "Array", solved: 8, total: 10 },
              { category: "String", solved: 7, total: 10 },
              { category: "Tree", solved: 9, total: 14 },
              { category: "Dynamic Programming", solved: 6, total: 11 },
            ].map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-muted-foreground">{cat.solved}/{cat.total}</span>
                </div>
                <Progress 
                  value={(cat.solved / cat.total) * 100} 
                  className="h-2"
                />
              </div>
            ))}
            <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90" size="sm">
              Practice Problems
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Schedule */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { activity: "Pomodoro Session - DSA Practice", duration: "25 min", time: "2 hours ago" },
              { activity: "Study Block - React Concepts", duration: "1h 30m", time: "4 hours ago" },
              { activity: "LeetCode Practice", duration: "45 min", time: "6 hours ago" },
            ].map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{session.activity}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
                <span className="text-sm font-medium text-primary">{session.duration}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { task: "System Design Study", time: "2:00 PM - 3:30 PM", type: "study" },
              { task: "LeetCode Practice", time: "4:00 PM - 5:00 PM", type: "practice" },
              { task: "Project Work", time: "7:00 PM - 9:00 PM", type: "project" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className={`w-3 h-3 rounded-full ${
                  item.type === 'study' ? 'bg-primary' :
                  item.type === 'practice' ? 'bg-accent' : 'bg-success'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90" size="sm">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}