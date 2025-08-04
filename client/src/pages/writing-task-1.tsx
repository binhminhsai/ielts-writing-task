import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Info, Database, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ChemicalFlaskLoader } from "@/components/ui/chemical-flask-loader";

export default function WritingTask1() {
  const [questionType, setQuestionType] = useState("");
  const [bandLevel, setBandLevel] = useState("");
  const [timeLimit, setTimeLimit] = useState("20 minutes");
  const [question, setQuestion] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [apiImageUrl, setApiImageUrl] = useState<string | null>(null);
  const [hasGeneratedQuestion, setHasGeneratedQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "use-my-question" | "random-question" | "random-button" | null
  >(null);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Map questionType to API-compatible topic
  const mapQuestionTypeToTopic = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "line-graph": "Line Graph",
      "bar-chart": "Bar Chart",
      "pie-chart": "Pie Chart",
      "process-diagram": "Process Diagram",
      table: "Table",
      map: "Map",
      "multiple-graphs": "Multiple Graphs",
    };
    return typeMap[type] || "General";
  };

  // Button handler functions
  const handleUseMyQuestion = () => {
    if (!question.trim() || !uploadedImage) {
      toast({
        title: "Missing Requirements",
        description: "Please enter your question and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAction("use-my-question");
    setIsLoading(true);
  };

  const handleCompleteUseMyQuestion = () => {
    setPreviewQuestion(`**IELTS Writing Task 1:** ${question.trim()}`);
    setShowPreview(true);
    setHasGeneratedQuestion(false);
    setApiImageUrl(null); // Clear API image if user uploads their own
    setIsLoading(false);
  };

  const handleRandomQuestion = async () => {
    if (!questionType) {
      toast({
        title: "Missing Question Type",
        description:
          "Please select a question type before generating a random question.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAction("random-question");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate-question-task1`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: mapQuestionTypeToTopic(questionType),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      if (
        !result.success ||
        !result.data?.data?.question ||
        !result.data?.data?.image_url
      ) {
        throw new Error("Invalid API response structure");
      }

      const { question, image_url } = result.data.data;
      setPreviewQuestion(`**IELTS Writing Task 1:** ${question.trim()}`);
      setApiImageUrl(image_url);
      setShowPreview(true);
      setHasGeneratedQuestion(true);
      setUploadedImage(null); // Clear user-uploaded image
      setIsLoading(false);

      toast({
        title: "Question and image generated",
        description:
          "Random Task 1 question with corresponding image is ready for practice.",
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error generating question",
        description: "Failed to fetch random question. Please try again.",
        variant: "destructive",
      });
      console.error("API Error:", error);
    }
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
      if (file.type.startsWith("image/")) {
        setUploadedImage(file);
        setApiImageUrl(null); // Clear API image if user uploads their own
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
      if (file.type.startsWith("image/")) {
        setUploadedImage(file);
        setApiImageUrl(null); // Clear API image if user uploads their own
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

  const handleStartWriting = async () => {
    if (
      !showPreview ||
      !previewQuestion.trim() ||
      (!uploadedImage && !apiImageUrl)
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please enter your Task 1 question and either upload an image or generate a random question with image.",
        variant: "destructive",
      });
      return;
    }

    let uploadedImageDataUrl: string | null = null;
    if (uploadedImage) {
      // Convert uploaded image to Data URL
      uploadedImageDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });
    }

    const config = {
      question: previewQuestion,
      questionType: questionType || "general",
      bandLevel: bandLevel || "6.0",
      timeLimit: timeLimit,
      hasGeneratedQuestion: hasGeneratedQuestion,
      apiImageUrl: apiImageUrl,
      uploadedImageDataUrl: uploadedImageDataUrl, // Store Data URL for user-uploaded image
    };

    sessionStorage.setItem("task1WritingConfig", JSON.stringify(config));
    setLocation("/writing-task-1/practice");
  };
  const handleRandomButton = () => {
    setLoadingAction("random-button");
    setIsLoading(true);
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        IELTS Writing Task 1 Practice
      </h1>
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
            if (hasGeneratedQuestion && e.target.value !== question) {
              setHasGeneratedQuestion(false);
              setShowPreview(false);
              setApiImageUrl(null);
            }
          }}
          className="min-h-[80px] text-sm text-gray-600"
        />
      </div>
      {/* Image Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : uploadedImage
              ? "border-green-400 bg-green-50"
              : "border-gray-300"
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
                <p className="text-green-700 mb-1 font-medium">
                  Image uploaded: {uploadedImage.name}
                </p>
                <p className="text-sm text-green-600">
                  Click to change or drag another image
                </p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-1">
                  Chọn ảnh biểu đồ hoặc kéo và thả hình ảnh vào đây
                </p>
                <p className="text-sm text-gray-500">
                  Accepted file types: image. Max file size: 5 MB
                </p>
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
        <Button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 text-white hover:bg-[#c2401c] bg-[#ea580c]"
          onClick={handleRandomButton}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Random question
        </Button>
      </div>
      {/* Chemical Flask Loader */}
      <ChemicalFlaskLoader
        isVisible={isLoading}
        onComplete={() => {
          if (loadingAction === "use-my-question") {
            handleCompleteUseMyQuestion();
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
              <div className="font-bold text-sm mb-3 text-[#0f766e]">
                IELTS Writing Task 1:
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                {previewQuestion
                  .replace(/^\*\*IELTS Writing Task 1:\*\*\s*/, "")
                  .trim()}
              </p>
            </div>

            {/* Image Preview - Show either uploaded image or API image */}
            {(uploadedImage || apiImageUrl) && (
              <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-4">
                <img
                  src={
                    uploadedImage
                      ? URL.createObjectURL(uploadedImage)
                      : apiImageUrl!
                  }
                  alt="Task 1 Visual"
                  className="w-full max-h-[400px] object-contain rounded-md"
                  onError={() => {
                    toast({
                      title: "Image load error",
                      description:
                        "Failed to load the image. Please try again.",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            )}
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
          style={{ backgroundColor: "#1fb2aa" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0d9488")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1fb2aa")
          }
          onClick={handleStartWriting}
        >
          Start Writing
        </Button>
      </div>
    </div>
  );
}
