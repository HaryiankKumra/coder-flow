import { useState } from "react";
import { Calendar, Clock, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Morning Study Session",
      description: "Data Structures and Algorithms",
      time: "09:00",
      endTime: "11:00",
      date: new Date().toDateString(),
      type: "study",
      location: "Library",
    },
    {
      id: 2,
      title: "LeetCode Practice",
      description: "Dynamic Programming problems",
      time: "14:00",
      endTime: "15:30",
      date: new Date().toDateString(),
      type: "coding",
      location: "Home",
    },
    {
      id: 3,
      title: "Project Work",
      description: "React Native app development",
      time: "16:00",
      endTime: "19:00",
      date: new Date().toDateString(),
      type: "project",
      location: "Office",
    },
    {
      id: 4,
      title: "Review Session",
      description: "Weekly progress review",
      time: "20:00",
      endTime: "21:00",
      date: new Date().toDateString(),
      type: "review",
      location: "Home",
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "coding":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "project":
        return "bg-green-100 text-green-800 border-green-200";
      case "review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "study":
        return "📚";
      case "coding":
        return "💻";
      case "project":
        return "🚀";
      case "review":
        return "📋";
      default:
        return "📅";
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
            Your Schedule
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your daily tasks and activities
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Events</p>
                <p className="text-xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-xl font-bold">6h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locations</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Free Time</p>
                <p className="text-xl font-bold">2h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Timeline */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Schedule
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {new Date().toLocaleDateString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 transform hover:scale-[1.01]"
            >
              {/* Time indicator */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="text-sm font-bold text-primary">
                  {event.time}
                </div>
                <div className="w-px h-8 bg-border my-1" />
                <div className="text-xs text-muted-foreground">
                  {event.endTime}
                </div>
              </div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(event.type)}</span>
                      <h3 className="font-semibold text-sm lg:text-base">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>
                        ${
                          (
                            (new Date(
                              `1970-01-01T${event.endTime}:00`
                            ).getTime() -
                            new Date(`1970-01-01T${event.time}:00`).getTime()) /
                            3600000
                          ).toFixed(1) + "h"
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
              <p className="text-sm">Start by adding your first event!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}