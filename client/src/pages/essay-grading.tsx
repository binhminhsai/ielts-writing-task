import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Image
} from "lucide-react";
import { FeedbackInterface } from "@/components/writing-practice/feedback-interface";

const essayFormSchema = z.object({
  taskType: z.enum(["task1", "task2"]),
  question: z.string().refine(
    (val) => val.trim().length >= 10,
    "Vui lòng nhập câu hỏi đề bài"
  ),
  chartType: z.string().optional(),
  chartImage: z.any().optional(),
  essay: z.string().optional(),
  fileName: z.string().optional(),
}).refine((data) => {
  // For Task 1: require chartType and chartImage
  if (data.taskType === "task1") {
    if (!data.chartType) {
      return false;
    }
  }
  
  // Essay content required unless file is uploaded
  if (!data.fileName && (!data.essay || data.essay.trim().length === 0)) {
    return false;
  }
  
  return true;
}, {
  message: "Vui lòng điền đầy đủ thông tin bắt buộc",
  path: ["essay"], // This will show error on essay field
});

type EssayForm = z.infer<typeof essayFormSchema>;

export default function EssayGrading() {
  const [location] = useLocation();
  const [currentView, setCurrentView] = useState<"form" | "feedback">("form");
  const [submittedEssay, setSubmittedEssay] = useState<{ question: string; essay: string; taskType: string } | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [chartImage, setChartImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const form = useForm<EssayForm>({
    resolver: zodResolver(essayFormSchema),
    defaultValues: {
      taskType: taskType,
      question: "",
      chartType: "",
      essay: "",
      fileName: "",
    },
  });

  // Check URL parameters to set initial task type
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskParam = urlParams.get('task');
    if (taskParam === 'task1') {
      setTaskType('task1');
      form.setValue('taskType', 'task1');
    }
  }, [location, form]);

  // Custom validation function
  const validateForm = (data: EssayForm): string[] => {
    const errors: string[] = [];
    
    // Question validation
    if (!data.question || data.question.trim().length < 10) {
      errors.push("Vui lòng nhập câu hỏi đề bài");
    }
    
    // Task 1 specific validations
    if (data.taskType === "task1") {
      if (!data.chartType) {
        errors.push("Vui lòng chọn loại biểu đồ");
      }
      if (!chartImage) {
        errors.push("Vui lòng tải ảnh lên");
      }
    }
    
    // Essay content validation (either essay text or file required)
    if (!data.fileName && (!data.essay || data.essay.trim().length === 0)) {
      errors.push("Vui lòng nhập bài luận hoặc tải file Word/PDF");
    }
    
    return errors;
  };

  // Simplified submit handler - just go to feedback
  const handleSubmitEssay = async (data: EssayForm) => {
    // Custom validation
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast({
          title: "Thiếu thông tin",
          description: error,
          variant: "destructive"
        });
      });
      return;
    }

    setIsGrading(true);
    setSubmittedEssay({ 
      question: data.question, 
      essay: data.essay || "File đã tải lên", 
      taskType: data.taskType 
    });
    
    // Simulate grading time
    setTimeout(() => {
      setIsGrading(false);
      setCurrentView("feedback");
      toast({
        title: "Chấm bài thành công!",
        description: "Bài luận của bạn đã được chấm điểm và đưa ra nhận xét chi tiết.",
      });
    }, 3000);
  };

  // Functions for feedback interface
  const handleTryAgain = () => {
    setCurrentView("form");
    setSubmittedEssay(null);
    setChartImage(null);
    form.reset({
      taskType: taskType,
      question: "",
      chartType: "",
      essay: "",
      fileName: "",
    });
  };

  const handleNextPractice = () => {
    setCurrentView("form");
    setSubmittedEssay(null);
    setChartImage(null);
    form.reset({
      taskType: taskType,
      question: "",
      chartType: "",
      essay: "",
      fileName: "",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        form.setValue("fileName", file.name);
        toast({
          title: "File uploaded",
          description: `File ${file.name} đã được tải lên thành công.`,
        });
      } else {
        toast({
          title: "File không hợp lệ",
          description: "Chỉ chấp nhận file PDF hoặc Word (.docx).",
          variant: "destructive",
        });
      }
    }
  };

  // Chart image upload handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChartImage(file);
      form.setValue("chartImage", file);
      toast({
        title: "Chart uploaded successfully",
        description: `Chart "${file.name}" has been uploaded.`,
      });
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
        setChartImage(file);
        form.setValue("chartImage", file);
        toast({
          title: "Chart uploaded successfully",
          description: `Chart "${file.name}" has been uploaded.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file for the chart.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTaskTypeChange = (newTaskType: "task1" | "task2") => {
    setTaskType(newTaskType);
    form.setValue("taskType", newTaskType);
    form.reset({
      taskType: newTaskType,
      question: "",
      chartType: "",
      essay: "",
      fileName: "",
    });
    setChartImage(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {currentView === "form" && (
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Chấm bài Writing IELTS Task 1 & Task 2
            </h1>
            <p className="text-base text-gray-600">
              Nhận đánh giá chi tiết và điểm số chính xác từ hệ thống AI chuyên nghiệp
            </p>
          </div>
          
          <Card className="bg-white rounded-xl shadow-lg border border-primary/20">
          <CardHeader className="pb-4 bg-primary/5 rounded-t-xl border-b border-primary/10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-type" className="text-sm font-semibold mb-2 block text-primary">
                  Chọn loại bài thi
                </Label>
                <Select value={taskType} onValueChange={handleTaskTypeChange}>
                  <SelectTrigger className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white">
                    <SelectValue>
                      {taskType === "task1" && "Chấm điểm IELTS Writing Task 1"}
                      {taskType === "task2" && "Chấm điểm IELTS Writing Task 2"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task1">Chấm điểm IELTS Writing Task 1</SelectItem>
                    <SelectItem value="task2">Chấm điểm IELTS Writing Task 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              

            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={form.handleSubmit(handleSubmitEssay)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm font-semibold text-slate-700">
                  Câu hỏi đề bài
                </Label>
                <Textarea
                  id="question"
                  placeholder={taskType === "task1" ? "Nhập câu hỏi IELTS Writing Task 1..." : "Nhập câu hỏi IELTS Writing Task 2..."}
                  className="min-h-[80px] sm:min-h-[100px] text-sm border-slate-200 focus:border-primary focus:ring-primary/20 bg-white"
                  {...form.register("question")}
                />
                {form.formState.errors.question && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {form.formState.errors.question.message}
                  </p>
                )}
              </div>

              {taskType === "task1" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Tải ảnh biểu đồ
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-primary bg-primary/10 scale-[1.02]"
                          : chartImage
                          ? "border-emerald-300 bg-emerald-50/50 shadow-sm"
                          : "border-slate-300 hover:border-primary hover:bg-primary/5"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        {chartImage ? (
                          <div>
                            <p className="text-sm text-green-600 font-medium">
                              ✓ {chartImage.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Click để thay đổi hoặc kéo ảnh mới vào đây
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600">
                              Chọn ảnh biểu đồ hoặc kéo vào đây
                            </p>
                            <p className="text-xs text-gray-500">
                              Accepted file types: image. Max file size: 5 MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {taskType === "task1" && !chartImage && (
                      <p className="text-xs sm:text-sm text-red-600">
                        Vui lòng tải ảnh lên
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="essay" className="text-sm font-semibold text-slate-700">
                  Bài luận
                </Label>
                <Textarea
                  id="essay"
                  placeholder={taskType === "task1" 
                    ? "Nhập bài luận của bạn (tối thiểu 150 từ)..." 
                    : "Nhập bài luận của bạn (tối thiểu 250 từ)..."
                  }
                  className="min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] text-sm border-slate-200 focus:border-primary focus:ring-primary/20 bg-white"
                  {...form.register("essay")}
                />
                {(!form.watch("fileName") && (!form.watch("essay") || form.watch("essay")?.trim().length === 0)) && (
                  <p className="text-xs sm:text-sm text-red-600">
                    Vui lòng nhập bài luận hoặc tải file Word/PDF
                  </p>
                )}
                {form.formState.errors.essay && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {form.formState.errors.essay.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-semibold text-slate-700">
                  Hoặc tải file Word/PDF
                </Label>
                <div className="space-y-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {form.watch("fileName") ? (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-emerald-600 mr-2" />
                        <span className="text-xs sm:text-sm text-emerald-700 font-medium">
                          {form.watch("fileName")}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                        onClick={() => document.getElementById("file")?.click()}
                      >
                        Thay đổi
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-sm border-primary/30 hover:border-primary hover:bg-primary/5 text-primary transition-all duration-200"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Gửi file Word/PDF
                    </Button>
                  )}
                </div>
              </div>

              {isGrading && (
                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center shadow-sm">
                        <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-primary">Đang phân tích bài luận...</h3>
                      <p className="text-sm text-primary/80">
                        Hệ thống AI đang đánh giá bài viết của bạn theo tiêu chuẩn IELTS
                      </p>
                      <Progress value={66} className="w-full max-w-md mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full mt-6 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isGrading}
                size="lg"
              >
                {isGrading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Đang chấm bài...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Bắt đầu chấm bài
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        </>
      )}

      {currentView === "feedback" && submittedEssay && (
        <FeedbackInterface
          essayContent={submittedEssay.essay}
          onTryAgain={handleTryAgain}
          onNextPractice={handleNextPractice}
          context="essay-grading"
        />
      )}
    </main>
  );
}