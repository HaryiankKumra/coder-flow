import { Calendar } from "lucide-react";
import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Schedule() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl lg:text-3xl font-bold">Schedule</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Schedule feature coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}