import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Task1WritingInterface from "@/components/writing-practice/task1-writing-interface";

export default function WritingTask1Practice() {
  const [location] = useLocation();
  const [config, setConfig] = useState<{
    question: string;
    questionType: string;
    bandLevel: string;
    timeLimit: string;
  } | null>(null);

  useEffect(() => {
    // Get configuration from sessionStorage (passed from setup page)
    const storedConfig = sessionStorage.getItem('task1WritingConfig');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    }
  }, []);

  // If no config found, redirect back to setup
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No Configuration Found</h2>
          <p className="text-gray-600 mb-4">Please configure your Task 1 writing session first.</p>
          <a
            href="/writing-task-1"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go to Setup
          </a>
        </div>
      </div>
    );
  }

  return (
    <Task1WritingInterface
      question={config.question}
      questionType={config.questionType}
      bandLevel={config.bandLevel}
      timeLimit={config.timeLimit}
    />
  );
}