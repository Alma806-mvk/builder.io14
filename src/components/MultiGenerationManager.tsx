import React, { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentType, Platform } from "../types";

export interface GenerationTask {
  id: string;
  type: ContentType;
  platform: Platform;
  userInput: string;
  status:
    | "pending"
    | "analyzing"
    | "structuring"
    | "generating"
    | "refining"
    | "finalizing"
    | "completed"
    | "error";
  progress: number;
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
  stepIndex: number;
  totalSteps: number;
}

interface MultiGenerationManagerProps {
  children: (props: {
    activeGenerations: GenerationTask[];
    startGeneration: (
      type: ContentType,
      platform: Platform,
      userInput: string,
    ) => string;
    cancelGeneration: (taskId: string) => void;
    clearCompleted: () => void;
  }) => React.ReactNode;
}

const GENERATION_STEPS = [
  "analyzing",
  "structuring",
  "generating",
  "refining",
  "finalizing",
] as const;

export const MultiGenerationManager: React.FC<MultiGenerationManagerProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<GenerationTask[]>([]);

  const startGeneration = useCallback(
    (type: ContentType, platform: Platform, userInput: string): string => {
      const taskId = uuidv4();
      const newTask: GenerationTask = {
        id: taskId,
        type,
        platform,
        userInput,
        status: "pending",
        progress: 0,
        startTime: new Date(),
        stepIndex: 0,
        totalSteps: GENERATION_STEPS.length,
      };

      setTasks((prev) => [...prev, newTask]);

      // Simulate generation process
      setTimeout(() => {
        simulateGeneration(taskId);
      }, 100);

      return taskId;
    },
    [],
  );

  const simulateGeneration = useCallback(async (taskId: string) => {
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: GENERATION_STEPS[i] as any,
                stepIndex: i,
                progress: ((i + 1) / GENERATION_STEPS.length) * 100,
              }
            : task,
        ),
      );

      // Random delay between steps (1-3 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 2000 + 1000),
      );
    }

    // Mark as completed
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              progress: 100,
              endTime: new Date(),
              result: `Generated ${task.type} for ${task.platform}: "${task.userInput}"`,
            }
          : task,
      ),
    );
  }, []);

  const cancelGeneration = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) =>
      prev.filter(
        (task) => task.status !== "completed" && task.status !== "error",
      ),
    );
  }, []);

  const activeGenerations = useMemo(() => tasks, [tasks]);

  return (
    <>
      {children({
        activeGenerations,
        startGeneration,
        cancelGeneration,
        clearCompleted,
      })}
    </>
  );
};

export default MultiGenerationManager;
