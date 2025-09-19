import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleBlock {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  category: string;
  color: string;
  is_all_day?: boolean;
}

interface CalendarViewProps {
  view: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export default function CalendarView({ view, onViewChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIScheduling, setIsAIScheduling] = useState(false);
  const [newBlock, setNewBlock] = useState<Partial<ScheduleBlock>>({
    title: '',
    description: '',
    category: 'study',
    color: '#3B82F6',
  });
  const { toast } = useToast();

  // Load schedule blocks from Supabase
  useEffect(() => {
    loadScheduleBlocks();
  }, [currentDate]);

  const loadScheduleBlocks = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('schedule_blocks')
        .select('*')
        .gte('start_time', startOfMonth.toISOString())
        .lte('start_time', endOfMonth.toISOString())
        .order('start_time');

      if (error) throw error;
      setScheduleBlocks(data || []);
    } catch (error) {
      console.error('Error loading schedule blocks:', error);
    }
  };

  const saveScheduleBlock = async () => {
    if (!newBlock.title || !selectedDate) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      const startTime = new Date(selectedDate);
      const [hours, minutes] = (newBlock.start_time || '09:00').split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endTime = new Date(startTime);
      const [endHours, endMinutes] = (newBlock.end_time || '10:00').split(':');
      endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      const blockData = {
        title: newBlock.title!,
        description: newBlock.description || '',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        category: newBlock.category || 'study',
        color: newBlock.color || '#3B82F6',
        is_all_day: false,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('schedule_blocks')
        .insert([blockData]);

      if (error) throw error;

      toast({ title: "Success", description: "Schedule block created successfully" });
      setIsDialogOpen(false);
      setNewBlock({ title: '', description: '', category: 'study', color: '#3B82F6' });
      loadScheduleBlocks();
    } catch (error) {
      console.error('Error saving schedule block:', error);
      toast({ title: "Error", description: "Failed to save schedule block", variant: "destructive" });
    }
  };

  const generateAISchedule = async () => {
    setIsAIScheduling(true);
    try {
      // Fetch current tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false });

      // Fetch user settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      const { data: aiResponse, error } = await supabase.functions.invoke('ai-scheduler', {
        body: {
          tasks: tasks || [],
          preferences: settings || {
            dailyStudyGoal: 360,
            preferredCategories: ['study', 'practice', 'project'],
            timezone: 'UTC'
          },
          currentSchedule: scheduleBlocks
        }
      });

      if (error) throw error;

      if (aiResponse.success && aiResponse.scheduledBlocks) {
        // Save AI-generated blocks to database
        const user = await supabase.auth.getUser();
        const blocksToSave = aiResponse.scheduledBlocks.map((block: any) => ({
          ...block,
          user_id: user.data.user?.id
        }));

        const { error: saveError } = await supabase
          .from('schedule_blocks')
          .insert(blocksToSave);

        if (saveError) throw saveError;

        toast({ 
          title: "AI Schedule Generated", 
          description: `Created ${aiResponse.scheduledBlocks.length} schedule blocks` 
        });
        
        loadScheduleBlocks();
      }
    } catch (error) {
      console.error('Error generating AI schedule:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate AI schedule", 
        variant: "destructive" 
      });
    } finally {
      setIsAIScheduling(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBlocksForDate = (date: Date) => {
    return scheduleBlocks.filter(block => {
      const blockDate = new Date(block.start_time);
      return blockDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const categoryColors = {
    study: '#3B82F6',
    practice: '#10B981',
    project: '#F59E0B',
    break: '#EF4444',
    meal: '#8B5CF6',
    general: '#6B7280'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('day')}
          >
            Day
          </Button>

          <Button
            onClick={generateAISchedule}
            disabled={isAIScheduling}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Bot className="h-4 w-4 mr-2" />
            {isAIScheduling ? 'Generating...' : 'AI Schedule'}
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-border/50 rounded-lg transition-colors cursor-pointer hover:bg-secondary/50 ${
                  date ? 'bg-background' : ''
                }`}
                onClick={() => {
                  if (date) {
                    setSelectedDate(date);
                    setIsDialogOpen(true);
                  }
                }}
              >
                {date && (
                  <>
                    <div className="font-medium mb-2">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getBlocksForDate(date).slice(0, 3).map((block, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-1 rounded text-white truncate"
                          style={{ backgroundColor: block.color }}
                        >
                          {formatTime(block.start_time)} {block.title}
                        </div>
                      ))}
                      {getBlocksForDate(date).length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{getBlocksForDate(date).length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Schedule Block for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newBlock.title || ''}
                onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBlock.description || ''}
                onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newBlock.start_time || '09:00'}
                  onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newBlock.end_time || '10:00'}
                  onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newBlock.category}
                onValueChange={(value) => setNewBlock({ 
                  ...newBlock, 
                  category: value,
                  color: categoryColors[value as keyof typeof categoryColors] || '#3B82F6'
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveScheduleBlock}>
                Save Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}