import { useState } from "react";
import { Calendar, Clock, Plus, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleBlock {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: "study" | "break" | "project" | "meeting" | "other";
  date: string;
}

const categoryColors = {
  study: "bg-primary/10 text-primary border-primary/20",
  break: "bg-success/10 text-success border-success/20",
  project: "bg-accent/10 text-accent border-accent/20",
  meeting: "bg-warning/10 text-warning border-warning/20",
  other: "bg-muted/10 text-muted-foreground border-muted/20",
};

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([
    {
      id: "1",
      title: "System Design Study",
      description: "Learn about microservices architecture",
      startTime: "14:00",
      endTime: "15:30",
      category: "study",
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: "2",
      title: "LeetCode Practice",
      description: "Focus on dynamic programming problems",
      startTime: "16:00",
      endTime: "17:00",
      category: "study",
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: "3",
      title: "Coffee Break",
      description: "Take a refreshing break",
      startTime: "15:30",
      endTime: "16:00",
      category: "break",
      date: new Date().toISOString().split('T')[0],
    },
  ]);

  const [newBlock, setNewBlock] = useState<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    category: "study" | "break" | "project" | "meeting" | "other";
    date: string;
  }>({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    category: "study",
    date: new Date().toISOString().split('T')[0],
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getDaysOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const addScheduleBlock = () => {
    if (!newBlock.title.trim()) return;

    const block: ScheduleBlock = {
      id: Date.now().toString(),
      ...newBlock,
    };

    setScheduleBlocks(prev => [...prev, block]);
    setNewBlock({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      category: "study",
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
  };

  const deleteBlock = (id: string) => {
    setScheduleBlocks(prev => prev.filter(block => block.id !== id));
  };

  const getBlocksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduleBlocks
      .filter(block => block.date === dateString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWeekRange = (date: Date) => {
    const days = getDaysOfWeek(date);
    const start = days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const daysOfWeek = getDaysOfWeek(currentDate);
  const today = new Date().toDateString();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Schedule Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and organize your study sessions effectively
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Schedule Block</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newBlock.title}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Data Structures Study"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newBlock.description}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this session..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select
                    value={newBlock.startTime}
                    onValueChange={(value) => setNewBlock(prev => ({ ...prev, startTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select
                    value={newBlock.endTime}
                    onValueChange={(value) => setNewBlock(prev => ({ ...prev, endTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newBlock.category}
                    onValueChange={(value: "study" | "break" | "project" | "meeting" | "other") => 
                      setNewBlock(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newBlock.date}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={addScheduleBlock} className="flex-1 bg-gradient-primary hover:opacity-90">
                  Add Block
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Week Navigation */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">
                {getWeekRange(currentDate)}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {daysOfWeek.map((day, index) => {
              const dayBlocks = getBlocksForDate(day);
              const isToday = day.toDateString() === today;
              
              return (
                <div key={index} className="space-y-2">
                  <div className={`text-center p-2 rounded-lg ${
                    isToday ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'
                  }`}>
                    <div className="text-xs font-medium">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${isToday ? '' : 'text-muted-foreground'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  
                  <div className="space-y-2 min-h-[200px]">
                    {dayBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="p-2 rounded-lg border transition-all duration-200 hover:shadow-soft group"
                        style={{
                          backgroundColor: categoryColors[block.category].includes('bg-primary') ? 'hsl(var(--primary) / 0.1)' :
                                          categoryColors[block.category].includes('bg-success') ? 'hsl(var(--success) / 0.1)' :
                                          categoryColors[block.category].includes('bg-accent') ? 'hsl(var(--accent) / 0.1)' :
                                          categoryColors[block.category].includes('bg-warning') ? 'hsl(var(--warning) / 0.1)' :
                                          'hsl(var(--muted) / 0.1)',
                          borderColor: categoryColors[block.category].includes('border-primary') ? 'hsl(var(--primary) / 0.2)' :
                                      categoryColors[block.category].includes('border-success') ? 'hsl(var(--success) / 0.2)' :
                                      categoryColors[block.category].includes('border-accent') ? 'hsl(var(--accent) / 0.2)' :
                                      categoryColors[block.category].includes('border-warning') ? 'hsl(var(--warning) / 0.2)' :
                                      'hsl(var(--muted) / 0.2)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{block.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                            </p>
                            {block.description && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {block.description}
                              </p>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`${categoryColors[block.category]} text-xs mt-1`}
                            >
                              {block.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => deleteBlock(block.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getBlocksForDate(new Date()).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No schedule blocks for today</p>
                <p className="text-sm">Add your first block to get started</p>
              </div>
            ) : (
              getBlocksForDate(new Date()).map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200"
                >
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-medium">{formatTime(block.startTime)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(block.endTime)}</div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{block.title}</h3>
                    {block.description && (
                      <p className="text-sm text-muted-foreground">{block.description}</p>
                    )}
                  </div>
                  
                  <Badge className={categoryColors[block.category]} variant="outline">
                    {block.category}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}