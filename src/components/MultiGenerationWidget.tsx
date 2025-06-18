import React, { useState } from "react";
import { GenerationTask } from "./MultiGenerationManager";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  SparklesIcon,
} from "./IconComponents";

interface MultiGenerationWidgetProps {
  tasks: GenerationTask[];
  onCancel: (taskId: string) => void;
  onClearCompleted: () => void;
}

const getStatusIcon = (status: GenerationTask["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
    case "error":
      return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
    default:
      return <SparklesIcon className="w-4 h-4 text-sky-400" />;
  }
};

const getStatusColor = (status: GenerationTask["status"]) => {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "pending":
      return "text-slate-400";
    default:
      return "text-sky-400";
  }
};

const formatElapsedTime = (startTime: Date, endTime?: Date) => {
  const end = endTime || new Date();
  const elapsed = Math.floor((end.getTime() - startTime.getTime()) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const MultiGenerationWidget: React.FC<MultiGenerationWidgetProps> = ({
  tasks,
  onCancel,
  onClearCompleted,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const activeTasks = tasks.filter(
    (t) => !["completed", "error"].includes(t.status),
  );
  const completedTasks = tasks.filter((t) =>
    ["completed", "error"].includes(t.status),
  );

  if (tasks.length === 0) return null;

  return (
    <div
      className={`fixed ${isMinimized ? "bottom-4 right-4" : "bottom-4 right-4"} z-50 transition-all duration-300`}
    >
      {isMinimized ? (
        // Minimized view
        <div
          onClick={() => setIsMinimized(false)}
          className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl p-3 shadow-2xl cursor-pointer hover:bg-slate-700/95 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-sky-400">
                  {activeTasks.length}
                </span>
              </div>
            </div>
            <span className="text-sm text-white font-medium">
              {activeTasks.length} generating...
            </span>
          </div>
        </div>
      ) : (
        // Expanded view
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl max-w-sm w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-6 h-6 text-sky-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Generations
                </h3>
                <p className="text-sm text-slate-400">
                  {activeTasks.length} active • {completedTasks.length}{" "}
                  completed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {completedTasks.length > 0 && (
                <button
                  onClick={onClearCompleted}
                  className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                  title="Clear completed"
                >
                  <TrashIcon className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-slate-700 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                title="Minimize"
              >
                <span className="text-slate-400 hover:text-white">−</span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {isExpanded && (
            <div>
              {/* Active Tasks */}
              {activeTasks.map((task) => (
                <div key={task.id} className="p-4 border-b border-slate-700/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(task.status)}
                        <span className="text-sm font-medium text-white truncate">
                          {task.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {task.platform}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-2">
                        {task.userInput}
                      </p>
                    </div>
                    <button
                      onClick={() => onCancel(task.id)}
                      className="p-1 hover:bg-slate-700 rounded-md transition-colors ml-2"
                      title="Cancel"
                    >
                      <span className="text-xs text-slate-400 hover:text-red-400">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`capitalize ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatElapsedTime(task.startTime)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      Step {task.stepIndex + 1} of {task.totalSteps}
                    </div>
                  </div>
                </div>
              ))}

              {/* Completed Tasks */}
              {completedTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-4 border-b border-slate-700/50 opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getStatusIcon(task.status)}
                      <span className="text-sm text-slate-300 truncate">
                        {task.type} ({task.platform})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <ClockIcon className="w-3 h-3" />
                      <span>
                        {formatElapsedTime(task.startTime, task.endTime)}
                      </span>
                    </div>
                  </div>
                  {task.status === "completed" && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      ✅ Generation completed successfully
                    </p>
                  )}
                  {task.status === "error" && (
                    <p className="text-xs text-red-400 mt-1 truncate">
                      ❌ {task.error || "Generation failed"}
                    </p>
                  )}
                </div>
              ))}

              {completedTasks.length > 3 && (
                <div className="p-3 text-center text-xs text-slate-400">
                  +{completedTasks.length - 3} more completed
                </div>
              )}

              {/* Empty State */}
              {tasks.length === 0 && (
                <div className="p-6 text-center text-slate-400">
                  <SparklesIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active generations</p>
                  <p className="text-xs">
                    Start generating content to see progress here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {isExpanded && tasks.length > 0 && (
            <div className="p-3 border-t border-slate-700 bg-slate-700/30">
              <p className="text-xs text-slate-400 text-center">
                💡 Switch tabs freely while content generates in the background
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiGenerationWidget;
