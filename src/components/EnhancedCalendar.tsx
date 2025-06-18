import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  EditIcon,
} from "./IconComponents";
import { Platform } from "../types";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  platform: Platform;
  color: string;
  content?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  mediaFiles?: string[];
}

interface EnhancedCalendarProps {
  events: CalendarEvent[];
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const PLATFORM_COLORS = {
  [Platform.YouTube]: "bg-red-600",
  [Platform.TikTok]: "bg-black",
  [Platform.Instagram]: "bg-pink-600",
  [Platform.Twitter]: "bg-blue-500",
  [Platform.LinkedIn]: "bg-blue-700",
  [Platform.Facebook]: "bg-blue-600",
};

const PLATFORM_ICONS = {
  [Platform.YouTube]: "📺",
  [Platform.TikTok]: "🎵",
  [Platform.Instagram]: "📷",
  [Platform.Twitter]: "🐦",
  [Platform.LinkedIn]: "💼",
  [Platform.Facebook]: "👥",
};

const STATUS_COLORS = {
  draft: "bg-gray-500",
  scheduled: "bg-blue-500",
  published: "bg-green-500",
  failed: "bg-red-500",
};

const STATUS_ICONS = {
  draft: "📝",
  scheduled: "⏰",
  published: "✅",
  failed: "❌",
};

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] =
    useState<Partial<CalendarEvent> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateString = date.toISOString().split("T")[0];
      const dayEvents = events.filter((event) => event.date === dateString);

      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    return days;
  }, [currentYear, currentMonth, events]);

  // Filter events by selected platforms
  const filteredEvents = useMemo(() => {
    if (selectedPlatforms.length === 0) return events;
    return events.filter((event) => selectedPlatforms.includes(event.platform));
  }, [events, selectedPlatforms]);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingEvent({
      date: date.toISOString().split("T")[0],
      platform: Platform.Instagram,
      status: "draft",
    });
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingEvent(event);
      setIsModalOpen(true);
    },
    [],
  );

  const handleSaveEvent = useCallback(() => {
    if (
      !editingEvent ||
      !editingEvent.title ||
      !editingEvent.date ||
      !editingEvent.platform
    ) {
      return;
    }

    const eventData = {
      ...editingEvent,
      color: PLATFORM_COLORS[editingEvent.platform as Platform],
    } as CalendarEvent;

    if (editingEvent.id) {
      onEventUpdate(eventData);
    } else {
      onEventCreate(eventData);
    }

    setEditingEvent(null);
    setIsModalOpen(false);
  }, [editingEvent, onEventCreate, onEventUpdate]);

  const handleDeleteEvent = useCallback(() => {
    if (editingEvent?.id) {
      onEventDelete(editingEvent.id);
      setEditingEvent(null);
      setIsModalOpen(false);
    }
  }, [editingEvent, onEventDelete]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const togglePlatformFilter = useCallback((platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }, []);

  const getEventCountByStatus = useCallback(
    (status: CalendarEvent["status"]) => {
      return filteredEvents.filter((event) => event.status === status).length;
    },
    [filteredEvents],
  );

  return (
    <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-sky-400 flex items-center">
          <CalendarDaysIcon className="h-7 w-7 mr-2" />
          Social Media Calendar
        </h2>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-2">
          {(["month", "week", "day"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-sky-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(STATUS_COLORS).map(([status, colorClass]) => (
          <div key={status} className="bg-slate-700/60 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {STATUS_ICONS[status as keyof typeof STATUS_ICONS]}
              </span>
              <div>
                <p className="text-lg font-bold text-white">
                  {getEventCountByStatus(status as CalendarEvent["status"])}
                </p>
                <p className="text-sm text-slate-400 capitalize">{status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-400 mr-2">Filter by platform:</span>
        {Object.values(Platform).map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatformFilter(platform)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedPlatforms.includes(platform)
                ? `${PLATFORM_COLORS[platform]} text-white`
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span className="mr-1">{PLATFORM_ICONS[platform]}</span>
            {platform}
          </button>
        ))}
        {selectedPlatforms.length > 0 && (
          <button
            onClick={() => setSelectedPlatforms([])}
            className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-slate-400" />
        </button>

        <h3 className="text-xl font-semibold text-white">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-slate-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day.date)}
            className={`min-h-[100px] p-2 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors ${
              !day.isCurrentMonth ? "opacity-50" : ""
            } ${day.isToday ? "ring-2 ring-sky-500" : ""}`}
          >
            <div className="text-sm font-medium text-white mb-1">
              {day.date.getDate()}
            </div>

            {/* Events */}
            <div className="space-y-1">
              {day.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className={`text-xs p-1 rounded text-white truncate ${PLATFORM_COLORS[event.platform]} hover:opacity-80 transition-opacity`}
                  title={`${event.title} (${event.platform})`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{PLATFORM_ICONS[event.platform]}</span>
                    <span className="truncate">{event.title}</span>
                    <span>{STATUS_ICONS[event.status]}</span>
                  </div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-slate-400 text-center">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingEvent?.id ? "Edit Event" : "Create Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingEvent?.title || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Enter event title..."
                />
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform *
                </label>
                <select
                  value={editingEvent?.platform || Platform.Instagram}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      platform: e.target.value as Platform,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {Object.values(Platform).map((platform) => (
                    <option key={platform} value={platform}>
                      {PLATFORM_ICONS[platform]} {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingEvent?.date || ""}
                    onChange={(e) =>
                      setEditingEvent((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editingEvent?.time || ""}
                    onChange={(e) =>
                      setEditingEvent((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editingEvent?.content || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-24 resize-none"
                  placeholder="Enter your content..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={editingEvent?.status || "draft"}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      status: e.target.value as CalendarEvent["status"],
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="scheduled">⏰ Scheduled</option>
                  <option value="published">✅ Published</option>
                  <option value="failed">❌ Failed</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEvent}
                disabled={
                  !editingEvent?.title ||
                  !editingEvent?.date ||
                  !editingEvent?.platform
                }
                className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg font-medium"
              >
                {editingEvent?.id ? "Update" : "Create"}
              </button>

              {editingEvent?.id && (
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCalendar;
