import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw, Clock, Coffee, Settings, Timer as TimerIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TimerMode = "stopwatch" | "pomodoro";
type PomodoroPhase = "work" | "short-break" | "long-break";

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>("work");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessions, setSessions] = useState<Array<{ type: string; duration: number; completed_at: string }>>([]);
  
  // Pomodoro settings
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60); // 5 minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 minutes
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPhaseDuration = () => {
    switch (pomodoroPhase) {
      case "work": return workDuration;
      case "short-break": return shortBreakDuration;
      case "long-break": return longBreakDuration;
    }
  };

  const getPhaseDisplayName = (phase: PomodoroPhase) => {
    switch (phase) {
      case "work": return "Focus Time";
      case "short-break": return "Short Break";
      case "long-break": return "Long Break";
    }
  };

  const getPhaseColor = (phase: PomodoroPhase) => {
    switch (phase) {
      case "work": return "text-primary";
      case "short-break": return "text-success";
      case "long-break": return "text-accent";
    }
  };

  useEffect(() => {
    if (mode === "pomodoro") {
      setTime(getCurrentPhaseDuration());
    }
  }, [pomodoroPhase, workDuration, shortBreakDuration, longBreakDuration, mode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (mode === "stopwatch") {
            return prevTime + 1;
          } else {
            // Pomodoro countdown
            if (prevTime <= 1) {
              // Phase completed
              completePhase();
              return 0;
            }
            return prevTime - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const completePhase = () => {
    setIsRunning(false);
    
    // Save session
    const newSession = {
      type: mode === "stopwatch" ? "Stopwatch" : `Pomodoro - ${getPhaseDisplayName(pomodoroPhase)}`,
      duration: mode === "stopwatch" ? time : getCurrentPhaseDuration(),
      completed_at: new Date().toLocaleString()
    };
    setSessions(prev => [newSession, ...prev.slice(0, 9)]); // Keep last 10 sessions

    if (mode === "pomodoro") {
      if (pomodoroPhase === "work") {
        setPomodoroCount(prev => prev + 1);
        // After 4 work sessions, take a long break
        if ((pomodoroCount + 1) % 4 === 0) {
          setPomodoroPhase("long-break");
        } else {
          setPomodoroPhase("short-break");
        }
      } else {
        setPomodoroPhase("work");
      }
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      if (time > 0) {
        // Save the session
        const newSession = {
          type: "Stopwatch",
          duration: time,
          completed_at: new Date().toLocaleString()
        };
        setSessions(prev => [newSession, ...prev.slice(0, 9)]);
      }
      setTime(0);
    } else {
      setTime(getCurrentPhaseDuration());
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      setTime(0);
    } else {
      setTime(getCurrentPhaseDuration());
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "stopwatch") {
      setTime(0);
    } else {
      setTime(getCurrentPhaseDuration());
    }
  };

  const pomodoroProgress = mode === "pomodoro" ? 
    ((getCurrentPhaseDuration() - time) / getCurrentPhaseDuration()) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          Focus Timer
        </h1>
        <p className="text-muted-foreground">
          Stay focused with Pomodoro technique or track your study time
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {mode === "pomodoro" ? (
                    <Coffee className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-primary" />
                  )}
                  {mode === "pomodoro" ? "Pomodoro Timer" : "Stopwatch"}
                </CardTitle>
                
                <div className="flex gap-2">
                  <Button
                    variant={mode === "pomodoro" ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchMode("pomodoro")}
                  >
                    Pomodoro
                  </Button>
                  <Button
                    variant={mode === "stopwatch" ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchMode("stopwatch")}
                  >
                    Stopwatch
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Timer Display */}
              <div className="text-center space-y-4">
                {mode === "pomodoro" && (
                  <div className="space-y-2">
                    <Badge className={`${getPhaseColor(pomodoroPhase)}`} variant="outline">
                      {getPhaseDisplayName(pomodoroPhase)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Session {pomodoroCount + 1} • Cycle {Math.floor(pomodoroCount / 4) + 1}
                    </div>
                  </div>
                )}
                
                <div className="text-6xl font-mono font-bold text-center">
                  {formatTime(time)}
                </div>
                
                {mode === "pomodoro" && (
                  <Progress value={pomodoroProgress} className="h-2" />
                )}
              </div>
              
              {/* Controls */}
              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={startTimer} size="lg" className="bg-gradient-primary hover:opacity-90">
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} size="lg" variant="outline">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button onClick={stopTimer} size="lg" variant="outline">
                  <Square className="h-5 w-5 mr-2" />
                  Stop
                </Button>
                
                <Button onClick={resetTimer} size="lg" variant="outline">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings & History */}
        <div className="space-y-6">
          {/* Settings */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Work Duration (minutes)</Label>
                <Input
                  type="number"
                  value={workDuration / 60}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value) * 60)}
                  min="1"
                  max="60"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Short Break (minutes)</Label>
                <Input
                  type="number"
                  value={shortBreakDuration / 60}
                  onChange={(e) => setShortBreakDuration(parseInt(e.target.value) * 60)}
                  min="1"
                  max="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Long Break (minutes)</Label>
                <Input
                  type="number"
                  value={longBreakDuration / 60}
                  onChange={(e) => setLongBreakDuration(parseInt(e.target.value) * 60)}
                  min="1"
                  max="60"
                />
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No sessions yet</p>
                  </div>
                ) : (
                  sessions.map((session, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.type}</p>
                        <p className="text-xs text-muted-foreground">{session.completed_at}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {formatTime(session.duration)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Timer Page */}
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="flex items-center gap-2">
          <TimerIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold">Pomodoro Timer</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Timer feature coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}