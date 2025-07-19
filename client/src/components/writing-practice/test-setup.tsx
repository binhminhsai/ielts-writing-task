import { useState } from "react";
import { Sparkles, Shuffle, AlertTriangle, HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type WritingTestType = 
  | "ielts-task2" 
  | "toefl" 
  | "general" 
  | "business";

export type DifficultyLevel = 
  | "easy" 
  | "medium" 
  | "hard" 
  | "expert";

interface TestSetupProps {
  onStart: (config: {
    testType: WritingTestType;
    difficulty: DifficultyLevel;
    topic: string;
    timeLimit: number;
  }) => void;
}

export function TestSetup({ onStart }: TestSetupProps) {
  const [testType, setTestType] = useState<WritingTestType>("ielts-task2");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [topic, setTopic] = useState("");
  const [fixedTestType, setFixedTestType] = useState<WritingTestType | null>(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestionFromAPI = async (userTopic: string) => {
    setIsGenerating(true);
    setErrorMessage("");
    
    try {
      const response = await fetch('https://agentwp-api.aihubproduction.com/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          topic: userTopic
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.data?.question) {
        setTopic(result.data.data.question);
        setFixedTestType(testType);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      setErrorMessage("Failed to generate question. Please try again or enter your own question.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTopic = () => {
    const textareaValue = (document.getElementById('topic') as HTMLTextAreaElement).value;
    if (!textareaValue.trim()) {
      setErrorMessage("Vui lòng nhập Topic/Question trước khi nhấn nút Generate question");
      return;
    }
    
    generateQuestionFromAPI(textareaValue.trim());
  };

  const handleRandomQuestion = () => {
    // Generate a random topic based on test type and difficulty
    const randomTopics = {
      "ielts-task2": ["Environment", "Education", "Technology", "Health", "Society", "Culture", "Economics", "Government"],
      "toefl": ["Education", "Technology", "Work", "Personal Development", "Social Issues", "Communication"],
      "general": ["Life", "Career", "Relationships", "Personal Growth", "Current Events", "Philosophy"],
      "business": ["Leadership", "Innovation", "Marketing", "Finance", "Strategy", "Communication", "Management"]
    };
    
    const topics = randomTopics[testType] || randomTopics["general"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    generateQuestionFromAPI(randomTopic);
  };

  const handleStartWriting = () => {
    if (!topic.trim()) {
      alert("Please enter a topic or generate a random one.");
      return;
    }

    onStart({
      testType,
      difficulty,
      topic,
      timeLimit,
    });
  };

  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <h2 className="text-2xl font-semibold mb-6">English Writing Practice</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="writing-type" className="mb-3 block">
            Select Writing Test Type
          </Label>
          <Select 
            value={testType} 
            onValueChange={(val) => setTestType(val as WritingTestType)}
          >
            <SelectTrigger id="writing-type">
              <SelectValue>
                {testType === "ielts-task2" && "IELTS Writing Task 2"}
                {testType === "toefl" && "TOEFL Independent Writing"}
                {testType === "general" && "General Essay"}
                {testType === "business" && "Business Writing"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ielts-task2">IELTS Writing Task 2</SelectItem>
              <SelectItem value="toefl">TOEFL Independent Writing</SelectItem>
              <SelectItem value="general">General Essay</SelectItem>
              <SelectItem value="business">Business Writing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty" className="mb-3 block flex items-center gap-2">
            Band Level
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  className="max-w-xs p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">Band Level Guide</div>
                    <div>Choose the band level you aim for. We'll tailor vocabulary and writing guidance to match that level.</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Select 
            value={difficulty} 
            onValueChange={(val) => setDifficulty(val as DifficultyLevel)}
          >
            <SelectTrigger id="difficulty">
              <SelectValue>
                {difficulty === "easy" && "Band 5.0"}
                {difficulty === "medium" && "Band 6.0"}
                {difficulty === "hard" && "Band 7.0"}
                {difficulty === "expert" && "Band 8.0"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Band 5.0</SelectItem>
              <SelectItem value="medium">Band 6.0</SelectItem>
              <SelectItem value="hard">Band 7.0</SelectItem>
              <SelectItem value="expert">Band 8.0</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <Label htmlFor="topic" className="mb-3 block">
          Topic/Question
        </Label>
        <Textarea
          id="topic"
          onChange={(e) => e.target.value = e.target.value}
          placeholder="- Enter any relevant information related to the topic, question type,... and then use the Generate question button to create a question.
- Enter your own question and select the Using my question button to use your question."
          className="h-24"
        />
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white w-[180px] h-9 flex items-center justify-center gap-2 px-6"
            onClick={handleGenerateTopic}
            disabled={isGenerating}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-sm">
              {isGenerating ? "Generating..." : "Generate question"}
            </span>
          </Button>
          <Button 
            variant="secondary"
            size="sm" 
            className="mt-2 w-[180px] h-9 bg-[#20B2AA] hover:bg-[#1ca19a] text-white flex items-center justify-center px-6"
            onClick={() => {
              const textareaValue = (document.getElementById('topic') as HTMLTextAreaElement).value;
              const wordCount = textareaValue.trim().split(/\s+/).filter(word => word.length > 0).length;
              
              if (!textareaValue.trim()) {
                setErrorMessage("Vui lòng nhập câu hỏi của bạn trước khi nhấn nút Use my question");
                return;
              }
              
              if (wordCount < 15) {
                setErrorMessage("Vui lòng nhập câu hỏi của bạn trước khi nhấn nút Use my question");
                return;
              }
              
              setErrorMessage("");
              setTopic(textareaValue);
            }}
          >
            <span className="text-sm">Use my question</span>
          </Button>
          <Button 
            variant="secondary"
            size="sm" 
            className="mt-2 w-[180px] h-9 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 px-6"
            onClick={handleRandomQuestion}
            disabled={isGenerating}
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="text-sm">
              {isGenerating ? "Generating..." : "Random question"}
            </span>
          </Button>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {errorMessage}
            </p>
          </div>
        )}
        
        {topic && (
          <div className="mt-4 p-4 bg-teal-50 rounded-md border-2 border-teal-200 shadow-sm">
            <Label className="text-teal-700 font-medium">
              {testType === "ielts-task2" ? "IELTS Writing Task 2:" : 
               testType === "toefl" ? "TOEFL Independent Writing:" :
               testType === "general" ? "General Essay:" : 
               "Business Writing:"}
            </Label>
            <p className="mt-2 text-sm text-gray-800">{topic}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <Label htmlFor="time-limit" className="mb-3 block">
            Time Limit (optional)
          </Label>
          <Select 
            value={timeLimit.toString()} 
            onValueChange={(val) => setTimeLimit(parseInt(val, 10))}
          >
            <SelectTrigger id="time-limit" className="w-36">
              <SelectValue>
                {timeLimit === 0 && "No limit"}
                {timeLimit === 20 && "20 minutes"}
                {timeLimit === 30 && "30 minutes"}
                {timeLimit === 40 && "40 minutes"}
                {timeLimit === 60 && "60 minutes"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No limit</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="40">40 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleStartWriting}
          className="bg-primary hover:opacity-90 text-white"
        >
          Start Writing
        </Button>
      </div>
    </div>
  );
}