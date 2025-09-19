import { useState } from "react";
import CalendarView from "@/components/CalendarView";

export default function Schedule() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="p-6">
      <CalendarView view={view} onViewChange={setView} />
    </div>
  );
}