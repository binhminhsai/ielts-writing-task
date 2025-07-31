import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Info, Shuffle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ChemicalFlaskLoader } from "@/components/ui/chemical-flask-loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Chart component for Task 1 preview
function Task1PreviewChart() {
  const chartData = {
    labels: ['2010', '2011', '2012', '2013', '2014', '2015'],
    datasets: [
      {
        label: 'Mathematics (Male)',
        data: [65, 68, 72, 75, 78, 82],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Mathematics (Female)',
        data: [62, 66, 70, 74, 77, 80],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Science (Male)',
        data: [58, 61, 65, 68, 71, 75],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Science (Female)',
        data: [55, 59, 63, 66, 69, 73],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
      },
      {
        label: 'English (Male)',
        data: [72, 74, 76, 78, 80, 83],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'High School Competency Exam Pass Rates by Subject and Gender (2010-2015)',
        font: {
          size: 12
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: 'Pass Rate (%)',
          font: {
            size: 11
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: 'Year',
          font: {
            size: 11
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm" style={{ height: '300px', padding: '16px' }}>
      <div style={{ height: '268px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default function WritingTask1() {
  const [questionType, setQuestionType] = useState("");
  const [bandLevel, setBandLevel] = useState("");
  const [timeLimit, setTimeLimit] = useState("20 minutes");
  const [question, setQuestion] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [hasGeneratedChart, setHasGeneratedChart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'use-my-question' | 'random-question' | null>(null);
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();



  // Button handler functions
  const handleUseMyQuestion = () => {
    // Check if both question text and image are provided
    if (!question.trim() || !uploadedImage) {
      toast({
        title: "Missing Requirements",
        description: "Please enter your question and upload an image.",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingAction('use-my-question');
    setIsLoading(true);
  };

  const handleCompleteUseMyQuestion = () => {
    setPreviewQuestion(`**IELTS Writing Task 1:** ${question.trim()}`);
    setShowPreview(true);
    setHasGeneratedChart(false); // This is from user input, not generated
    setIsLoading(false);
  };

  const handleRandomQuestion = () => {
    setLoadingAction('random-question');
    setIsLoading(true);
  };

  const handleCompleteRandomQuestion = () => {
    const randomQuestions = [
      "The diagram below shows the process of making soft cheese. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
      "The bar chart below shows the percentage of students who passed their high school competency exams, by subject and gender, during the period 2010-2015. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
      "The line graph below shows the consumption of fish and some different kinds of meat in a European country between 1979 and 2004. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
      "The table below shows the percentage of mobile phone owners using various mobile phone features. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
      "The pie charts below show the comparison of different kinds of energy production of France in two years. Summarise the information by selecting and reporting the main features and make comparisons where relevant."
    ];
    
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    const selectedQuestion = randomQuestions[randomIndex];
    
    // DO NOT fill the question into the textarea - keep it empty for user input
    // Only set the preview question and display the chart
    setPreviewQuestion(`**IELTS Writing Task 1:** ${selectedQuestion}`);
    setShowPreview(true);
    setHasGeneratedChart(true);
    setIsLoading(false);
    
    // DO NOT set uploadedImage - keep upload box in default state
    
    toast({
      title: "Question and chart generated",
      description: "Random Task 1 question with corresponding chart is ready for practice.",
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        toast({
          title: "Image uploaded successfully",
          description: `${file.name} has been uploaded.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        toast({
          title: "Image uploaded successfully",
          description: `${file.name} has been uploaded.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartWriting = () => {
    // Check if we have a valid preview with either uploaded image or generated chart
    if (!showPreview || !previewQuestion.trim() || (!uploadedImage && !hasGeneratedChart)) {
      toast({
        title: "Required fields missing",
        description: "Please enter your Task 1 question and either upload an image or generate a random question with chart.",
        variant: "destructive",
      });
      return;
    }

    // Save configuration to sessionStorage
    const config = {
      question: previewQuestion,
      questionType: questionType || "general",
      bandLevel: bandLevel || "6.0",
      timeLimit: timeLimit,
      hasGeneratedChart: hasGeneratedChart
    };
    
    sessionStorage.setItem('task1WritingConfig', JSON.stringify(config));
    
    // Navigate to writing interface
    setLocation('/writing-task-1/practice');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">IELTS Writing Task 1 Practice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Select Question Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Question Type
          </label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select question type">
                {questionType === "line-graph" && "Line Graph"}
                {questionType === "bar-chart" && "Bar Chart"}
                {questionType === "pie-chart" && "Pie Chart"}
                {questionType === "process-diagram" && "Process Diagram"}
                {questionType === "table" && "Table"}
                {questionType === "map" && "Map"}
                {questionType === "multiple-graphs" && "Multiple Graphs"}
                {!questionType && "Select question type"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line-graph">Line Graph</SelectItem>
              <SelectItem value="bar-chart">Bar Chart</SelectItem>
              <SelectItem value="pie-chart">Pie Chart</SelectItem>
              <SelectItem value="process-diagram">Process Diagram</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="map">Map</SelectItem>
              <SelectItem value="multiple-graphs">Multiple Graphs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Band Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Band Level
            <Info className="inline-block ml-1 h-4 w-4 text-gray-400" />
          </label>
          <Select value={bandLevel} onValueChange={setBandLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select band level">
                {bandLevel === "5.0" && "Band 5.0"}
                {bandLevel === "5.5" && "Band 5.5"}
                {bandLevel === "6.0" && "Band 6.0"}
                {bandLevel === "6.5" && "Band 6.5"}
                {bandLevel === "7.0" && "Band 7.0"}
                {bandLevel === "7.5" && "Band 7.5"}
                {bandLevel === "8.0" && "Band 8.0"}
                {bandLevel === "8.5" && "Band 8.5"}
                {!bandLevel && "Select band level"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5.0">Band 5.0</SelectItem>
              <SelectItem value="5.5">Band 5.5</SelectItem>
              <SelectItem value="6.0">Band 6.0</SelectItem>
              <SelectItem value="6.5">Band 6.5</SelectItem>
              <SelectItem value="7.0">Band 7.0</SelectItem>
              <SelectItem value="7.5">Band 7.5</SelectItem>
              <SelectItem value="8.0">Band 8.0</SelectItem>
              <SelectItem value="8.5">Band 8.5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Topic/Question */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic/Question
        </label>
        <Textarea
          placeholder="Enter your Task 1 question here. Once you've added content, the 'Use my question' button will become available."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            // If user manually edits the question, reset generated chart state
            if (hasGeneratedChart && e.target.value !== question) {
              setHasGeneratedChart(false);
              setShowPreview(false);
            }
          }}
          className="min-h-[80px] text-sm text-gray-600"
        />
      </div>
      {/* Image Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : uploadedImage ? "border-green-400 bg-green-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {uploadedImage ? (
              <>
                <div className="mx-auto h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-green-700 mb-1 font-medium">Image uploaded: {uploadedImage.name}</p>
                <p className="text-sm text-green-600">Click to change or drag another image</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-1">Chọn ảnh biểu đồ hoặc kéo và thả hình ảnh vào đây</p>
                <p className="text-sm text-gray-500">Accepted file types: image. Max file size: 5 MB</p>
              </>
            )}
          </label>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-10 px-4 py-2 text-white bg-[#1fb2aa]"
          onClick={handleUseMyQuestion}
        >
          Use my question
        </Button>
        <Button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 text-white hover:bg-[#296DE3] bg-[#3d82f6]"
          onClick={handleRandomQuestion}
        >
          <Database className="w-4 h-4 mr-2" />
          Get question
        </Button>
      </div>
      {/* Chemical Flask Loader */}
      <ChemicalFlaskLoader 
        isVisible={isLoading} 
        onComplete={() => {
          if (loadingAction === 'use-my-question') {
            handleCompleteUseMyQuestion();
          } else if (loadingAction === 'random-question') {
            handleCompleteRandomQuestion();
          }
          setLoadingAction(null);
        }}
      />
      {/* Question Preview */}
      {showPreview && (
        <div className="mb-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            {/* Question Text */}
            <div className="mb-4 p-6 border-2 border-teal-200 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="font-bold text-sm mb-3 text-[#0f766e]">IELTS Writing Task 1:</div>
              <p className="text-gray-800 text-sm leading-relaxed">
                {previewQuestion.replace(/^\*\*IELTS Writing Task 1:\*\*\s*/, '').trim()}
              </p>
            </div>
            
            {/* Chart Preview - Only show for generated charts */}
            {hasGeneratedChart && <Task1PreviewChart />}
          </div>
        </div>
      )}
      {/* Time Limit and Start Writing */}
      <div className="flex items-center justify-between">
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (optional)
          </label>
          <Select value={timeLimit} onValueChange={setTimeLimit}>
            <SelectTrigger>
              <SelectValue placeholder="Select time limit">
                {timeLimit === "15 minutes" && "15 minutes"}
                {timeLimit === "20 minutes" && "20 minutes"}
                {timeLimit === "25 minutes" && "25 minutes"}
                {timeLimit === "30 minutes" && "30 minutes"}
                {timeLimit === "no-limit" && "No limit"}
                {!timeLimit && "Select time limit"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 minutes">15 minutes</SelectItem>
              <SelectItem value="20 minutes">20 minutes</SelectItem>
              <SelectItem value="25 minutes">25 minutes</SelectItem>
              <SelectItem value="30 minutes">30 minutes</SelectItem>
              <SelectItem value="no-limit">No limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="text-white px-8"
          style={{ backgroundColor: '#1fb2aa' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1fb2aa'}
          onClick={handleStartWriting}
        >
          Start Writing
        </Button>
      </div>
    </div>
  );
}