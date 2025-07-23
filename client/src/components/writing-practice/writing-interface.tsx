import React, { useState, useEffect } from "react";
import { VocabularyWord, VocabularyCategory } from "@/data/vocabulary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/ui/editor";
import { Timer } from "@/components/ui/timer";
import { WordCounter } from "@/components/ui/word-counter";
import { useTimer } from "@/hooks/use-timer";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Save, Layers, ArrowLeft, Eye, EyeOff, Smile } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOutline } from "@/data/outlines";
import { getVocabulary } from "@/data/vocabulary";
import { getPhrases, getStructuredPhrases, phraseCategories } from "@/data/phrases";
import { WritingTestType, DifficultyLevel } from "./test-setup";
import { Link } from "wouter";

// Outline component with tabs for outline and useful expressions
function OutlineSection({ testType, topic }: { testType: WritingTestType, topic: string }) {
  const [showOutline, setShowOutline] = useState(true);
  const outline = getOutline(testType, topic);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
          console.log("here")
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/writing-assistant`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: topic, level: "Band 6.5" }),
        });
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setApiData(data.data.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {showOutline ? (
        <Tabs defaultValue="expressions" className="w-full h-full flex flex-col">
          <div className="mb-4 relative">
            <TabsList className="w-full flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="expressions" 
                className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        hover:bg-gray-50
                        data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                <Smile className="h-4 w-4" />
                Analyze Topic
              </TabsTrigger>
              <TabsTrigger 
                value="outline" 
                className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        hover:bg-gray-50
                        data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                <Layers className="h-4 w-4" />
                Suggested Outline
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent 
            value="outline" 
            className="flex-1 overflow-y-auto custom-scrollbar mt-0 rounded-b-lg rounded-tr-lg border border-gray-200 bg-white p-4 shadow-md"
            style={{ height: '500px' }}
          >
            <div>
              <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                Suggested Outline - Đề xuất cấu trúc bài viết
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">
                Cấu trúc đề xuất giúp bạn tổ chức ý tưởng và viết bài tốt hơn
              </p>

              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '430px' }}>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {/* Overall Outline as the first item */}
                  <AccordionItem 
                    value="overall-outline"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </span>
                        Overall Outline
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                            <div className="p-3 bg-[#f9fafb] rounded-md border border-gray-100 text-xs mb-3">
                          <p className="mb-2 font-medium text-[#1fb2aa]">Dàn ý tổng quan</p>
                          <p className="mb-2 text-[#374151]">
                            {apiData?.suggest_outline?.["1_dan_y_tong_quan"]?.mo_ta || "This is a Two-part question essay. The essay requires an analysis of the reasons behind the increasing trend of career changes and an evaluation of whether this is a positive or negative development for society."}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {outline.slice(0, 3).map((section, index) => (
                    <AccordionItem 
                      key={`outline-${index}`} 
                      value={`section-${index}`}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger 
                        className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                            {index + 2}
                          </span>
                          {section.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-white">
{index === 0 && (
  <div className="mt-3 space-y-3">
    <div className="p-3 bg-[#f9fafb] rounded-md border border-gray-100 text-xs">
      <p className="mb-2 font-medium text-[#1fb2aa]">Hướng dẫn:</p>
      <p className="mb-2 text-[#374151]">
        {apiData?.suggest_outline?.["2_introduction"]?.huong_dan || "Mở bài 2 câu – paraphrase đề + thesis statement"}
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-blue-100 text-xs text-blue-700 bg-[#f9fafb]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Câu 1 – Paraphrase đề bài</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Mục đích:</strong> {apiData?.suggest_outline?.["2_introduction"]?.cau_1_paraphrase?.muc_dich || "loading"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> "{apiData?.suggest_outline?.["2_introduction"]?.cau_1_paraphrase?.vi_du || "The phenomenon of individuals frequently transitioning between different professions throughout their working lives is becoming increasingly common."}"
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-green-100 text-xs text-green-700 bg-[#f9fafb]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Câu 2 – Thesis Statement</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Mục đích:</strong> {apiData?.suggest_outline?.["2_introduction"]?.cau_2_thesis?.muc_dich || "Thesis statement phù hợp với Two-part question essay"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> "{apiData?.suggest_outline?.["2_introduction"]?.cau_2_thesis?.vi_du || "This essay will explore the primary reasons behind this trend and argue that it represents a largely positive development for society."}"
      </p>
    </div>
  </div>
)}

{index === 1 && (
  <div className="mt-3 space-y-3">
    <div className="p-3 rounded-md border border-blue-100 text-xs text-blue-700 bg-[#f9fafb]">
      <p className="mb-2 text-[#1fb2aa] font-medium">Topic Sentence</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Content:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.topic_sentence?.content || "loading"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.topic_sentence?.vi_du || "Several core factors compel individuals to alter their career paths in the contemporary era, ranging from technological advancements to evolving personal needs."}
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-green-100 text-xs text-green-700 bg-[#f9fafb]">
      <p className="mb-2 text-[#1fb2aa] font-medium">Supporting Idea 1</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Idea:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_1?.chu_de || "Technological advancements and automation leading to job displacement or creation of new roles."}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ cụ thể:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_1?.vi_du_cu_the || "For instance, the rise of AI and robotics has rendered many traditional manufacturing or administrative roles obsolete, forcing workers to retrain for new fields like data science or digital marketing."}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Development:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_1?.development || "Consequently, individuals must adapt by acquiring new skills or seeking opportunities in burgeoning sectors, leading to career shifts."}
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-purple-100 text-xs text-purple-700 bg-[#f9fafb]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Supporting Idea 2</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Idea:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_2?.chu_de || "Quest for personal fulfillment, better work-life balance, and evolving values."}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ cụ thể:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_2?.vi_du_cu_the || "Many professionals, after years in high-pressure corporate environments, might transition to non-profit work or entrepreneurship, seeking greater meaning or flexibility, as seen with former bankers becoming social entrepreneurs."}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Development:</strong> {apiData?.suggest_outline?.["3_body_1_causes"]?.supporting_idea_2?.development || "This pursuit of job satisfaction and a healthier lifestyle often outweighs the stability of a long-term career, prompting a change."}
      </p>
    </div>
  </div>
)}

{index === 2 && (
  <div className="mt-3 space-y-3">
    <div className="p-3 rounded-md border border-orange-100 text-xs text-orange-700 bg-[#f9fafb]">
      <p className="mb-2 text-[#1fb2aa] font-medium">Topic Sentence</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Content:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.topic_sentence?.content || "loading"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.topic_sentence?.vi_du || "While this trend might present initial challenges, I contend that the increasing prevalence of career changes brings significant benefits to societal development."}
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-red-100 text-xs bg-[#f9fafb] text-[#374151]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Supporting Idea 1</p>
      <p className="mb-2">
        • <strong>Idea:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_1?.chu_de || "Enhanced workforce adaptability and skill diversification."}
      </p>
      <p className="mb-2">
        • <strong>Ví dụ cụ thể:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_1?.vi_du_cu_the || "When individuals move between sectors, they bring diverse perspectives and skill sets, fostering innovation. For example, a former teacher entering the tech industry might introduce novel educational software solutions."}
      </p>
      <p className="mb-2">
        • <strong>Development:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_1?.development || "This cross-pollination of ideas and expertise makes the workforce more resilient and dynamic, better equipped to respond to economic shifts."}
      </p>
    </div>
    
    <div className="p-3 rounded-md border border-indigo-100 text-xs bg-[#f9fafb] text-[#374151]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Supporting Idea 2</p>
      <p className="mb-2">
        • <strong>Idea:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_2?.chu_de || "Increased individual job satisfaction and overall productivity."}
      </p>
      <p className="mb-2">
        • <strong>Ví dụ cụ thể:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_2?.vi_du_cu_the || "People who are genuinely passionate about their work are more likely to be productive and engaged. A person who switches from a dissatisfying job to a fulfilling one, like a lawyer becoming a chef, often experiences higher morale and contributes more effectively to their new field."}
      </p>
      <p className="mb-2">
        • <strong>Development:</strong> {apiData?.suggest_outline?.["4_body_2_solutions"]?.supporting_idea_2?.development || "This leads to a more motivated and efficient workforce, ultimately boosting economic output and societal well-being."}
      </p>
    </div>
  </div>
)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  {/* Conclusion section as the 5th item */}
                  <AccordionItem 
                    value="conclusion"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          5
                        </span>
                        Conclusion
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                    <div className="mt-3 space-y-3">
    <div className="p-3 bg-[#f9fafb] rounded-md border border-gray-100 text-xs">
      <p className="mb-2 font-medium text-[#1fb2aa]">Hướng dẫn</p>
      <p className="mb-2 text-[#374151]">
        {apiData?.suggest_outline?.["5_conclusion"]?.huong_dan || "Kết bài 2 câu – summary + recommendation"}
      </p>
    </div>
   
    <div className="p-3 rounded-md border border-blue-100 text-xs bg-[#f9fafb]">
      <p className="mb-2 font-medium text-[#1fb2aa]">Câu 1 – Summary</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Mục đích:</strong> {apiData?.suggest_outline?.["5_conclusion"]?.cau_1_summary?.muc_dich || "Tóm tắt cả 2 phần body và main topic, không nêu quan điểm mới"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> {apiData?.suggest_outline?.["5_conclusion"]?.cau_1_summary?.vi_du || "In conclusion, the growing phenomenon of career changes is driven by both external forces like technological disruption and internal desires for personal fulfillment."}
      </p>
    </div>
   
    <div className="p-3 bg-[#f9fafb] rounded-md border border-emerald-100 text-xs">
      <p className="mb-2 font-medium text-[#1fb2aa]">Câu 2 – Final Recommendation</p>
      <p className="mb-2 text-[#374151]">
        • <strong>Mục đích:</strong> {apiData?.suggest_outline?.["5_conclusion"]?.cau_2_final?.muc_dich || "Final recommendation về giải pháp hoặc quan điểm bền vững"}
      </p>
      <p className="mb-2 text-[#374151]">
        • <strong>Ví dụ:</strong> {apiData?.suggest_outline?.["5_conclusion"]?.cau_2_final?.vi_du || "Despite potential initial disruptions, this flexibility is largely beneficial, fostering a more adaptable, innovative, and satisfied society."}
      </p>
    </div>
  </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent 
            value="expressions" 
            className="flex-1 overflow-y-auto custom-scrollbar mt-0 rounded-b-lg rounded-tr-lg border border-gray-200 bg-white p-4 shadow-md"
            style={{ height: '500px' }}
          >
            <div>
              <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-1.5">
                <Smile className="h-4 w-4" />
                Analyze Topic - Phân tích đề bài
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">
                Những hướng dẫn cụ thể giúp bạn viết bài hiệu quả hơn
              </p>

              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '430px' }}>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {/* Accordion 1: Highlight Keywords */}
                  <AccordionItem 
                    value="highlight-keywords"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </span>
                        Highlight Keywords
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Bối cảnh – Lý do:</p>
                          <p className="text-xs text-[#374151]">
      {apiData?.analyze_question?.["1_highlight_keywords"]?.boi_canh_ly_do || "Loading..."}                          </p>
                        </div>
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Chủ thể chính:</p>
                          <p className="text-xs text-[#374151]">
      {apiData?.analyze_question?.["1_highlight_keywords"]?.chu_the_chinh || "Loading..."}                          </p>
                        </div>
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Liệt kê quan điểm:</p>
                          <ul className="text-xs text-[#374151] space-y-1 list-disc pl-4">
                            <li> Quan điểm 1: {apiData?.analyze_question?.["1_highlight_keywords"]?.liet_ke_quan_diem?.quan_diem_1 || "Loading..."}</li>
                            <li>Quan điểm 2: {apiData?.analyze_question?.["1_highlight_keywords"]?.liet_ke_quan_diem?.quan_diem_2 || "Loading..."}</li>
                          </ul>
                        </div>
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Yêu cầu chính của đề bài:</p>
                          <p className="text-xs text-[#374151]">
                           {apiData?.analyze_question?.["1_highlight_keywords"]?.yeu_cau_chinh || "Loading..."}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 2: Identify Essay Type */}
                  <AccordionItem 
                    value="essay-type"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          2
                        </span>
                        Identify Essay Type
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                     <div className="space-y-3">
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Essay Type:</p>
                        <p className="text-xs text-[#374151]">
                          {apiData?.analyze_question?.["2_identify_essay_type"]?.essay_type || "Loading..."}
                        </p>
                      </div>
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Tips for Band 6.5+ (dưới từng tiêu chí chấm điểm):</p>
                      </div>
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Task Response:</p>
                        <p className="text-xs text-[#374151]">
                          {apiData?.analyze_question?.["2_identify_essay_type"]?.tips_chi_tiet?.task_response || "Loading..."}
                        </p>
                      </div>
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Coherence & Cohesion:</p>
                        <p className="text-xs text-[#374151]">
                          {apiData?.analyze_question?.["2_identify_essay_type"]?.tips_chi_tiet?.coherence_cohesion || "Loading..."}
                        </p>
                      </div>
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Lexical Resource:</p>
                        <p className="text-xs text-[#374151]">
                          {apiData?.analyze_question?.["2_identify_essay_type"]?.tips_chi_tiet?.lexical_resource || "Loading..."}
                        </p>
                      </div>
                      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Grammatical Range & Accuracy:</p>
                        <p className="text-xs text-[#374151]">
                          {apiData?.analyze_question?.["2_identify_essay_type"]?.tips_chi_tiet?.grammatical_range || "Loading..."}
                        </p>
                      </div>
                    </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 3: Main Topic Aspects */}
                  <AccordionItem 
                    value="main-topic"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          3
                        </span>
                        Main Topic Aspects
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Main Topic:</p>
                          <p className="text-xs text-[#374151]">
                             {apiData?.analyze_question?.["3_main_topic_aspects"]?.main_topic || "Loading..."}
                          </p>
                        </div>
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Topic Sentence 1:</p>
                          <p className="text-xs text-[#374151]">
                            {apiData?.analyze_question?.["3_main_topic_aspects"]?.topic_sentence_1 || "Loading..."}
                          </p>
                        </div>
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Topic Sentence 2:</p>
                          <p className="text-xs text-[#374151]">
                             {apiData?.analyze_question?.["3_main_topic_aspects"]?.topic_sentence_2 || "Loading..."}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 4: Tasks To Do */}
                  <AccordionItem 
                    value="tasks-todo"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          4
                        </span>
                        Jobs To Be Done
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                        {apiData?.analyze_question?.["4_jobs_to_done"]?.map((task, index) => (
        <div key={index} className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Task {index + 1}:</p>
          <p className="text-xs text-[#374151]">
            {task || "Loading..."}
          </p>
        </div>
      ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 5: Suggested Viewpoint */}
                  <AccordionItem 
                    value="suggested-viewpoint"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          5
                        </span>
                        Suggested Viewpoint
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                        <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                          <p className="text-xs font-medium text-[#1fb2aa] mb-2">Quan điểm gợi ý:</p>
        <p className="text-xs text-[#374151]">
          {apiData?.analyze_question?.["5_suggested_viewpoint"]?.quan_diem_goi_y || "Loading..."}
        </p>
      </div>
      <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
        <p className="text-xs font-medium text-[#1fb2aa] mb-2">Lý do cụ thể:</p>
        <p className="text-xs text-[#374151]">
          {apiData?.analyze_question?.["5_suggested_viewpoint"]?.ly_do_cu_the || "Loading..."}
        </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <Button
            variant="outline"
            size="sm"
            className="mb-4 bg-white hover:bg-gray-50 shadow-sm border-gray-200 px-4"
            onClick={() => setShowOutline(true)}
          >
            <Eye className="h-3.5 w-3.5 mr-2 text-primary" /> Show Support
          </Button>
          <p className="text-gray-700 font-medium text-base mb-2 text-center">Hãy cố gắng hết mình nhé!</p>
          <p className="text-primary font-medium text-sm text-center">Good things take time. 😉</p>
        </div>
      )}
    </div>
  );
}

// Vocabulary and Phrases component
function ResourcesSection({ testType, topic }: { testType: WritingTestType, topic: string }) {
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [showWordBank, setShowWordBank] = useState(false);
  const [allVocabulary, setAllVocabulary] = useState<VocabularyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch vocabulary data when component mounts or topic/testType changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const vocabularyData = await getVocabulary(testType, topic);
      setAllVocabulary(vocabularyData);
      setIsLoading(false);
    };
    fetchData();
  }, [testType, topic]);

  // Filter vocabulary for each tab
  const vocabularyWords = allVocabulary.flatMap(category =>
    category.words
      .filter((word: VocabularyWord) => ['N', 'V', 'Adj', 'Adv'].includes(word.partOfSpeech))
      .map((word: VocabularyWord) => ({ ...word, type: category.type }))
  );

  const phraseWords = allVocabulary.flatMap(category =>
    category.words
      .filter((word: VocabularyWord) => word.partOfSpeech === 'Phrase')
      .map((word: VocabularyWord) => ({ ...word, type: category.type }))
  );

  // Remove additionalVocabulary and additionalCollocations since we're fetching from API
  const allVocabularyWords = vocabularyWords;
  const allPhraseWords = phraseWords;

  // State for displayed word counts
  const [vocabDisplayCount, setVocabDisplayCount] = useState(10);
  const [phraseDisplayCount, setPhraseDisplayCount] = useState(8);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [isLoadingPhrases, setIsLoadingPhrases] = useState(false);

  // Handle loading more words
  const handleLoadMoreVocab = () => {
    setIsLoadingVocab(true);
    setTimeout(() => {
      setVocabDisplayCount(prevCount => prevCount + 10);
      setIsLoadingVocab(false);
    }, 600);
  };

  const handleLoadMorePhrases = () => {
    setIsLoadingPhrases(true);
    setTimeout(() => {
      setPhraseDisplayCount(prevCount => prevCount + 10);
      setIsLoadingPhrases(false);
    }, 600);
  };

  // Handle unified word bank button
  const handleExploreWordBank = () => {
    setShowWordBank(true);
    setShowVocabulary(true);
    setShowPhrases(true);
  };

  // Words to display based on current count limits
  const displayedVocabWords = allVocabularyWords.slice(0, vocabDisplayCount);
  const displayedPhraseWords = allPhraseWords.slice(0, phraseDisplayCount);

  // Check if there are more words to load
  const hasMoreVocab = vocabDisplayCount < allVocabularyWords.length;
  const hasMorePhrases = phraseDisplayCount < allPhraseWords.length;

  return (
    <Card className="mt-6 p-0 border-0 bg-transparent shadow-none">
      <Tabs 
        defaultValue="vocabulary" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="relative"
      >
        <div className="mb-4 relative">
          <TabsList className="w-full flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="vocabulary" 
              className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                      hover:bg-gray-50
                      data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M12 20V4"></path><path d="M20 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path><path d="M4 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4"></path>
              </svg>
              Vocabulary
            </TabsTrigger>
            <TabsTrigger 
              value="phrases" 
              className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                      hover:bg-gray-50
                      data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Useful collocations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vocabulary" className="p-0 min-h-[200px]">
          {!showWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <Button
                variant="outline"
                size="sm"
                className="mb-4 bg-white hover:bg-gray-50 shadow-sm border-gray-200 px-4"
                onClick={handleExploreWordBank}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-2 text-primary">
                  <path d="M12 20V4"></path><path d="M20 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path><path d="M4 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4"></path>
                </svg>
                Explore Word Bank
              </Button>
              <p className="text-gray-700 font-medium text-base mb-2 text-center">Click to explore helpful vocabulary!</p>
              <p className="text-primary font-medium text-sm text-center">Build your writing skills with relevant words. 😉</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Vocabulary Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M12 20V4"></path><path d="M20 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path><path d="M4 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4"></path>
                  </svg>
                  Vocabulary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {displayedVocabWords.map((word, index) => (
                      <div 
                        key={`word-${index}`}
                        className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="font-semibold text-sm text-primary">{word.word}</span>
                          <div className="text-xs font-medium px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                            {word.partOfSpeech}
                          </div>
                          <div className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {word.difficulty}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-medium">Meaning:</span> {word.meaning}
                        </p>
                        <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-1 mt-1">
                          <span className="font-medium not-italic">Example:</span> {word.example}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Load more button for vocabulary */}
                {hasMoreVocab && (
                  <div className="flex justify-center mt-4 mb-2">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMoreVocab}
                      className="text-primary border-primary/30 hover:border-primary text-xs px-6 py-1.5 h-auto shadow-sm"
                      size="sm"
                      disabled={isLoadingVocab}
                    >
                      {isLoadingVocab ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-2">
                            <path d="M12 8v8"></path><path d="M8 12h8"></path>
                          </svg>
                          Load More Words
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              
            </div>
          )}
        </TabsContent>

        <TabsContent value="phrases" className="p-0 min-h-[200px]">
          {!showWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <Button
                variant="outline"
                size="sm"
                className="mb-4 bg-white hover:bg-gray-50 shadow-sm border-gray-200 px-4"
                onClick={handleExploreWordBank}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-2 text-primary">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Explore Word Bank
              </Button>
              <p className="text-gray-700 font-medium text-base mb-2 text-center">Click to explore useful collocations!</p>
              <p className="text-primary font-medium text-sm text-center">Master natural word combinations. 😉</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {displayedPhraseWords.map((phrase, index) => (
                    <div 
                      key={`phrase-${index}`}
                      className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="font-semibold text-sm text-primary">{phrase.word}</span>
                        <div className="text-xs font-medium px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Collocation
                        </div>
                        <div className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {phrase.difficulty}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Meaning:</span> {phrase.meaning}
                      </p>
                      <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-1 mt-1">
                        <span className="font-medium not-italic">Example:</span> {phrase.example}
                      </p>
                    </div>
                  )
                )}

                {/* Fill in empty cell if odd number of phrases */}
                {displayedPhraseWords.length % 2 !== 0 && (
                  <div className="hidden md:block" />
                )}
              </div>

              {/* Load more button for phrases */}
              {hasMorePhrases && (
                <div className="flex justify-center mt-4 mb-2">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMorePhrases}
                    className="text-primary border-primary/30 hover:border-primary text-xs px-6 py-1.5 h-auto shadow-sm"
                    size="sm"
                    disabled={isLoadingPhrases}
                  >
                    {isLoadingPhrases ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-2">
                          <path d="M12 8v8"></path><path d="M8 12h8"></path>
                        </svg>
                        Load More Phrases
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

interface WritingInterfaceProps {
  testType: WritingTestType;
  difficulty: DifficultyLevel;
  topic: string;
  timeLimit: number;
  onSubmit: (essayContent: string) => void;
}

export function WritingInterface({
  testType,
  difficulty,
  topic,
  timeLimit,
  onSubmit,
}: WritingInterfaceProps) {
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isWordCountValid, setIsWordCountValid] = useState(true);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const { formattedTime, isRunning, startTimer, updateTimer } = useTimer({
    initialMinutes: timeLimit,
    onTimeUp: () => setShowTimeUpDialog(true),
    autoStart: timeLimit > 0,
  });

  // Start timer when component mounts if time limit is set
  useEffect(() => {
    if (timeLimit > 0) {
      startTimer();
    }
  }, [timeLimit, startTimer]);

  const handleTimeSelect = (minutes: number) => {
    updateTimer(minutes);
    if (minutes > 0) {
      startTimer();
    }
  };

  const handleWordCountChange = (count: number, isValid: boolean) => {
    setWordCount(count);
    setIsWordCountValid(isValid);
  };

  const handleSubmit = () => {
    if (!isWordCountValid) {
      setShowErrorDialog(true);
      return;
    }
    onSubmit(essayContent);
  };

  const handleSaveDraft = () => {
    // Save to localStorage
    localStorage.setItem('essayDraft', essayContent);
    localStorage.setItem('essayTopic', topic);
    alert('Draft saved successfully');
  };

  const [showExitDialog, setShowExitDialog] = useState(false);

  return (
    <div className="p-4">
      <div className="flex mb-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowExitDialog(true)}
        >
          <ArrowLeft className="h-3 w-3 mr-1" /> Back
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="lg:w-3/5">
          <div className="bg-cyan-50 rounded-md p-4 mb-3 border-2 border-cyan-200 shadow-sm">
            <div className="text-cyan-700 font-medium mb-1">Question:</div>
            <div className="text-gray-700 text-sm">{topic}</div>
          </div>

          <div className="flex items-center justify-between mb-2 h-8">
            <Timer 
              time={formattedTime()} 
              onTimeSelect={handleTimeSelect}
              isRunning={isRunning}
            />
            <WordCounter
              count={wordCount}
              maxWords={500}
              isValid={isWordCountValid}
            />
          </div>

          <Editor
            value={essayContent}
            onChange={setEssayContent}
            onWordCountChange={handleWordCountChange}
          />

          <div className="flex justify-end mt-3">
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:opacity-90 h-8 text-xs"
            >
              Submit Essay <Layers className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="hidden lg:block lg:w-2/5 lg:pl-3 lg:flex lg:flex-col" style={{ minHeight: '500px' }}>
          <OutlineSection 
            testType={testType} 
            topic={topic} 
          />
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <OutlineSection 
          testType={testType} 
          topic={topic} 
        />
      </div>

      {/* Resources Section Below */}
      <ResourcesSection 
        testType={testType} 
        topic={topic} 
      />

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát khỏi bài tập?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thoát khỏi quá trình làm bài? Tiến trình làm bài của bạn sẽ không được lưu lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <Link href="/writing-practice">
              <AlertDialogAction>
                Thoát
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time's Up Dialog */}
      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your allocated time for this essay has ended. Would you like to submit your work now or continue writing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Writing</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowTimeUpDialog(false);
              handleSubmit();
            }}>
              Submit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Word Count Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Word Count Error</AlertDialogTitle>
            <AlertDialogDescription>
              Word limit requirement not met. Your essay should be between 50 and 500 words.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}