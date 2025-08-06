import React, { useState, useEffect, useRef } from "react";
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
import { getTask1Outline } from "@/data/task1-outlines";
import { getTask1Vocabulary } from "@/data/task1-vocabulary";
import { getTask1Phrases, task1PhraseCategories } from "@/data/task1-phrases";
import { Task1FeedbackInterface } from "./task1-feedback-interface";
import { Link } from "wouter";
import { InteractiveLoadingPage } from "@/components/ui/interactive-loading-page";
import {
  ShimmerLoader,
  ShimmerCard,
  ShimmerList,
  ShimmerText,
} from "@/components/ui/shimmer-loader";
import { BookLoader } from "@/components/ui/book-loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChemicalFlaskLoader } from "../ui/chemical-flask-loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface Task1WritingInterfaceProps {
  question: string;
  questionType: string;
  bandLevel: string;
  timeLimit: string;
}

// Task 1 Outline component with tabs for outline and useful expressions
function Task1OutlineSection({
  questionType,
  question,
}: {
  questionType: string;
  question: string;
}) {
  const [showOutline, setShowOutline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const outline = getTask1Outline(questionType);
  const [data, setData] = useState(null);
  const [isLoadingTaskAnalysis, setIsLoadingTaskAnalysis] = useState(false);
  const [showTaskAnalysis, setShowTaskAnalysis] = useState(false);

  const fetchIELTSData = async () => {
    setIsLoading(true);
    try {
      // Get data from sessionStorage
      const task1Config = sessionStorage.getItem("task1WritingConfig");
      if (!task1Config) {
        throw new Error("No task1WritingConfig found in sessionStorage");
      }

      const config = JSON.parse(task1Config);

      // Prepare POST request payload
      const requestBody = {
        question: config.question,
        url: config.apiImageUrl || config.uploadedImageDataUrl,
        topic: config.questionType,
        level: `Band ${config.bandLevel}`,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/writing-assistant-task1`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result?.data?.data);
    } catch (err) {
      console.error("Error fetching IELTS data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIELTSData();
  }, []);

  const handleRevealTaskAnalysis = () => {
    setIsLoadingTaskAnalysis(true);
    setTimeout(() => {
      setIsLoadingTaskAnalysis(false);
      setShowTaskAnalysis(true);
    }, 5000);
  };

  return (
    <div className="h-full flex flex-col">
      {showOutline ? (
        <Tabs
          defaultValue="expressions"
          className="w-full h-full flex flex-col"
        >
          <div className="mb-4 relative">
            <TabsList className="w-full flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
              <TabsTrigger
                value="expressions"
                className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        hover:bg-gray-50
                        data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                <Smile className="h-4 w-4" />
                Question Analysis
              </TabsTrigger>
              <TabsTrigger
                value="outline"
                className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        hover:bg-gray-50
                        data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
              >
                <Layers className="h-4 w-4" />
                Sample
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="outline"
            className="flex-1 overflow-y-auto custom-scrollbar mt-0 rounded-b-lg rounded-tr-lg border border-gray-200 bg-white p-4 shadow-md"
            style={{ height: "500px" }}
          >
            <div>
              <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                Sample - Bài mẫu
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">
                Sample answer with paragraph-by-paragraph breakdown
              </p>

              <div
                className="overflow-y-auto custom-scrollbar"
                style={{ maxHeight: "430px" }}
              >
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-2"
                >
                  {/* Accordion 1: Paragraph 1: Introduction */}
                  <AccordionItem
                    value="paragraph-1"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </span>
                        Paragraph 1: Introduction
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {isLoading ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </div>
                        ) : (
                          data?.sample?.task1_outline
                            ?.paragraph_1_introduction ||
                          "No introduction available"
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 2: Paragraph 2: Overview */}
                  <AccordionItem
                    value="paragraph-2"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          2
                        </span>
                        Paragraph 2: Overview
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {isLoading ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          </div>
                        ) : (
                          data?.sample?.task1_outline?.paragraph_2_overview ||
                          "No overview available"
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 3: Paragraph 3: First Main Feature */}
                  <AccordionItem
                    value="paragraph-3"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          3
                        </span>
                        Paragraph 3: First Main Feature
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {isLoading ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                          </div>
                        ) : (
                          data?.sample?.task1_outline
                            ?.paragraph_3_first_main_feature ||
                          "No first main feature available"
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 4: Paragraph 4: Second Main Feature */}
                  <AccordionItem
                    value="paragraph-4"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          4
                        </span>
                        Paragraph 4: Second Main Feature
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {isLoading ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          </div>
                        ) : (
                          data?.sample?.task1_outline
                            ?.paragraph_4_second_main_feature ||
                          "No second main feature available"
                        )}
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
            style={{ height: "500px" }}
          >
            <div>
              <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-1.5">
                <Smile className="h-4 w-4" />
                Question Analysis - Phân tích câu hỏi
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">
                Detailed analysis of the Task 1 question and visual data
              </p>

              {isLoadingTaskAnalysis ? (
                <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[350px]">
                  <ChemicalFlaskLoader isVisible={true} onComplete={() => {}} />
                  <p className="text-sm font-medium text-gray-600 mt-4">
                    Preparing task analysis...
                  </p>
                </div>
              ) : !showTaskAnalysis ? (
                <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[350px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-4 bg-white hover:bg-gray-50 shadow-sm border-gray-200 px-4"
                    onClick={handleRevealTaskAnalysis}
                  >
                    <Eye className="h-3.5 w-3.5 mr-2 text-primary" />
                    Reveal Task Analysis and Sample
                  </Button>
                  <p className="text-gray-700 font-medium text-base mb-2 text-center">
                    Click to explore detailed analysis and sample!
                  </p>
                  <p className="text-primary font-medium text-sm text-center">
                    Build your understanding step by step.
                  </p>
                </div>
              ) : (
                <div
                  className="overflow-y-auto custom-scrollbar"
                  style={{ maxHeight: "430px" }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    {/* Accordion 1: Image Description */}
                    <AccordionItem
                      value="image-description"
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                        <span className="flex items-center gap-2">
                          <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                            1
                          </span>
                          Image Description
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-white">
                        {isLoading ? (
                          <div className="space-y-3">
                            <ShimmerCard className="border-blue-100" />
                            <ShimmerCard className="border-blue-100" />
                            <ShimmerCard className="border-blue-100" />
                            <ShimmerCard className="border-blue-100" />
                            <ShimmerCard className="border-blue-100" />
                            <ShimmerCard className="border-blue-100" />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Chart Type:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.chart_type
                                }
                              </p>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Main Subject:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.main_subject
                                }
                              </p>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Unit of Measurement:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.unit_measurement
                                }
                              </p>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Time Period:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.time_period
                                }
                              </p>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Verb Tense Used:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.verb_tense
                                }
                              </p>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                              <p className="text-xs">
                                <span className="text-[#1fb2aa] font-bold">
                                  Chart Summary:
                                </span>{" "}
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "1_image_description"
                                  ]?.chart_summary
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Accordion 2: Question Analysis */}
                    <AccordionItem
                      value="analyze-question"
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                        <span className="flex items-center gap-2">
                          <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                            2
                          </span>
                          Question Analysis
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-white">
                        {isLoading ? (
                          <div className="space-y-3">
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Question Requirement:
                              </p>
                              <p className="text-xs text-[#374151]">
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "2_analyse_question"
                                  ]?.question_requirement
                                }
                              </p>
                            </div>
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Key Tasks:
                              </p>
                              <ul className="text-xs text-[#374151] space-y-1 ml-3">
                                {data?.analyze_question?.task1_analysis?.[
                                  "2_analyse_question"
                                ]?.key_tasks?.map((task, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-xs mt-0.5">•</span>
                                    <span>{task}</span>
                                  </li>
                                )) ||
                                  // Fallback loading skeleton if data is not available
                                  Array.from({ length: 3 }, (_, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-xs mt-0.5">•</span>
                                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Band Guidance:
                              </p>
                              <p className="text-xs text-[#374151]">
                                {
                                  data?.analyze_question?.task1_analysis?.[
                                    "2_analyse_question"
                                  ]?.band_guidance
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Accordion 3: Identify Main Features */}
                    <AccordionItem
                      value="identify-features"
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                        <span className="flex items-center gap-2">
                          <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                            3
                          </span>
                          Identify Main Features
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-white">
                        {isLoading ? (
                          <div className="space-y-3">
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Overall Trends Section */}
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Overall Trends:
                              </p>
                              <ul className="text-xs text-[#374151] space-y-1 ml-3">
                                {data?.analyze_question?.task1_analysis?.[
                                  "3_identify_main_features"
                                ]?.overall_trends?.map((trend, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-xs mt-0.5">•</span>
                                    <span>{trend}</span>
                                  </li>
                                )) || (
                                  <li className="flex items-start gap-2">
                                    <span className="text-xs mt-0.5">•</span>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Key Data Points Section */}
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Key Data Points:
                              </p>
                              <ul className="text-xs text-[#374151] space-y-1 ml-3">
                                {data?.analyze_question?.task1_analysis?.[
                                  "3_identify_main_features"
                                ]?.key_data_points?.map((point, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-xs mt-0.5">•</span>
                                    <span>{point}</span>
                                  </li>
                                )) || (
                                  <li className="flex items-start gap-2">
                                    <span className="text-xs mt-0.5">•</span>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Significant Changes Section */}
                            <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                              <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                Significant Changes:
                              </p>
                              <ul className="text-xs text-[#374151] space-y-1 ml-3">
                                {data?.analyze_question?.task1_analysis?.[
                                  "3_identify_main_features"
                                ]?.significant_changes?.map((change, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-xs mt-0.5">•</span>
                                    <span>{change}</span>
                                  </li>
                                )) || (
                                  <li className="flex items-start gap-2">
                                    <span className="text-xs mt-0.5">•</span>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Accordion 4: Jobs To Be Done */}
                    <AccordionItem
                      value="jobs-to-be-done"
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10">
                        <span className="flex items-center gap-2">
                          <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                            4
                          </span>
                          Jobs To Be Done
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-white">
                        {isLoading ? (
                          <div className="space-y-3">
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                            <ShimmerCard className="border-gray-100" />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {data?.analyze_question?.task1_analysis?.[
                              "4_jobs_to_done"
                            ]?.map((job, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]"
                              >
                                <p className="text-xs font-bold text-[#1fb2aa] mb-2">
                                  {job.split(":")[0]}:
                                </p>
                                <p className="text-xs text-[#374151]">
                                  {job.split(":").slice(1).join(":").trim()}
                                </p>
                              </div>
                            )) ||
                              // Fallback skeleton if no data
                              Array.from({ length: 3 }, (_, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]"
                                >
                                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                                  <div className="space-y-1">
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <Button
            variant="outline"
            size="sm"
            className="mb-4 bg-white hover:bg-gray-50 shadow-sm border-gray-200 px-4"
            onClick={() => setShowOutline(true)}
          >
            <Eye className="h-3.5 w-3.5 mr-2 text-primary" /> Show Support
          </Button>
          <p className="text-gray-700 font-medium text-base mb-2 text-center">
            Hãy cố gắng hết mình nhé!
          </p>
          <p className="text-primary font-medium text-sm text-center">
            Good things take time. 😉
          </p>
        </div>
      )}
    </div>
  );
}

// Task 1 Vocabulary and Phrases component
// Interface for Task1VocabularyWord
interface Task1VocabularyWord {
  word: string;
  partOfSpeech: "N" | "V" | "Adj" | "Adv" | "Phrase" | "Collocation";
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  meaning: string;
  chartFunction: string;
  example: string;
  type?: string;
}

// Interface for API response vocabulary item
interface ApiVocabularyItem {
  word: string;
  type: string;
  cefr_level: string;
  meaning: string;
  chart_function: string;
  example: string;
}

// Interface for API response collocation item
interface ApiCollocationItem {
  phrase: string;
  type: string;
  cefr_level: string;
  meaning: string;
  chart_function: string;
  example: string;
}

// Interface for the full API response
interface ApiResponse {
  success: boolean;
  data: {
    data: {
      task: string;
      chart_specific_vocabulary: ApiVocabularyItem[];
      trend_collocations: ApiCollocationItem[];
    };
    original_type: string;
    converted: boolean;
    success: boolean;
  };
  message: string;
  timestamp: string;
}

// Interface for session storage data
interface SessionStorageData {
  question: string;
  questionType: string;
  bandLevel: string;
  timeLimit: string;
  hasGeneratedQuestion: boolean;
  apiImageUrl: string | null;
  uploadedImageDataUrl: string | null;
}

function Task1ResourcesSection({ questionType }: { questionType: string }) {
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [showWordBank, setShowWordBank] = useState(false);
  const [vocabDisplayCount, setVocabDisplayCount] = useState(10);
  const [phraseDisplayCount, setPhraseDisplayCount] = useState(8);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [isLoadingPhrases, setIsLoadingPhrases] = useState(false);
  const [isLoadingWordBank, setIsLoadingWordBank] = useState(false);
  const [vocabularyWords, setVocabularyWords] = useState<Task1VocabularyWord[]>(
    []
  );
  const [phraseWords, setPhraseWords] = useState<Task1VocabularyWord[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch vocabulary from API
  useEffect(() => {
    const fetchVocabulary = async () => {
      setIsLoadingWordBank(true);
      try {
        // Retrieve and parse session storage data
        const sessionDataRaw = sessionStorage.getItem("task1WritingConfig"); // Adjust key as needed
        if (!sessionDataRaw) {
          throw new Error("No task data found in session storage");
        }

        const sessionData: SessionStorageData = JSON.parse(sessionDataRaw);
        const { question, bandLevel, apiImageUrl } = sessionData;

        // Validate required fields
        if (!question || !bandLevel || !apiImageUrl) {
          throw new Error(
            "Missing required data (question, bandLevel, or apiImageUrl) in session storage"
          );
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/generate-vocabulary-task1`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question,
              url: apiImageUrl,
              level: `Band ${bandLevel}`,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vocabulary data");
        }

        const data: ApiResponse = await response.json();
        if (data.success && data.data.success) {
          // Map chart-specific vocabulary
          const vocab: Task1VocabularyWord[] =
            data.data.data.chart_specific_vocabulary.map((item) => ({
              word: item.word,
              partOfSpeech: item.type as
                | "N"
                | "V"
                | "Adj"
                | "Adv"
                | "Phrase"
                | "Collocation",
              difficulty: item.cefr_level as
                | "A1"
                | "A2"
                | "B1"
                | "B2"
                | "C1"
                | "C2",
              meaning: item.meaning,
              chartFunction: item.chart_function,
              example: item.example,
              type: "neutral",
            }));

          // Map trend collocations
          const phrases: Task1VocabularyWord[] =
            data.data.data.trend_collocations.map((item) => ({
              word: item.phrase,
              partOfSpeech: "Collocation",
              difficulty: item.cefr_level as
                | "A1"
                | "A2"
                | "B1"
                | "B2"
                | "C1"
                | "C2",
              meaning: item.meaning,
              chartFunction: item.chart_function,
              example: item.example,
              type: "neutral",
            }));

          setVocabularyWords(vocab);
          setPhraseWords(phrases);
        } else {
          throw new Error(data.message || "API returned an error");
        }
      } catch (err) {
        setError("Error fetching vocabulary data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoadingWordBank(false);
        setShowWordBank(true);
      }
    };

    fetchVocabulary();
  }, []);

  // Handle loading more words
  const handleLoadMoreVocab = () => {
    setIsLoadingVocab(true);
    setTimeout(() => {
      setVocabDisplayCount((prevCount) => prevCount + 10);
      setIsLoadingVocab(false);
    }, 600);
  };

  const handleLoadMorePhrases = () => {
    setIsLoadingPhrases(true);
    setTimeout(() => {
      setPhraseDisplayCount((prevCount) => prevCount + 10);
      setIsLoadingPhrases(false);
    }, 600);
  };

  // Words to display based on current count limits
  const displayedVocabWords = vocabularyWords.slice(0, vocabDisplayCount);
  const displayedPhraseWords = phraseWords.slice(0, phraseDisplayCount);

  // Check if there are more words to load
  const hasMoreVocab = vocabDisplayCount < vocabularyWords.length;
  const hasMorePhrases = phraseDisplayCount < phraseWords.length;

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 20V4"></path>
                <path d="M20 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path>
                <path d="M4 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4"></path>
              </svg>
              Chart-specific Vocabulary
            </TabsTrigger>
            <TabsTrigger
              value="phrases"
              className="flex-1 text-sm py-2.5 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        hover:bg-gray-50
                        data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Trend collocations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vocabulary" className="p-0 min-h-[200px]">
          {error ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <p className="text-red-600 font-medium text-base text-center">
                {error}
              </p>
            </div>
          ) : isLoadingWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <BookLoader message="Flipping through our vocabulary archive..." />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 20V4"></path>
                    <path d="M20 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path>
                    <path d="M4 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4"></path>
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
                        <span className="font-semibold text-sm text-primary">
                          {word.word}
                        </span>
                        <div className="text-xs font-medium px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                          {word.partOfSpeech}
                        </div>
                        <div className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {word.difficulty}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Meaning:</span>{" "}
                        {word.meaning}
                      </p>
                      <p className="text-xs mb-1" style={{ color: "#374151" }}>
                        <span className="font-medium">Chart Function:</span>{" "}
                        {word.chartFunction}
                      </p>
                      <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-1 mt-1">
                        <span className="font-medium not-italic">Example:</span>{" "}
                        {word.example}
                      </p>
                    </div>
                  ))}
                </div>
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
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5 mr-2"
                          >
                            <path d="M12 8v8"></path>
                            <path d="M8 12h8"></path>
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
          {error ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <p className="text-red-600 font-medium text-base text-center">
                {error}
              </p>
            </div>
          ) : isLoadingWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <BookLoader message="Flipping through our vocabulary archive..." />
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
                      <span className="font-semibold text-sm text-primary">
                        {phrase.word}
                      </span>
                      <div className="text-xs font-medium px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        Collocation
                      </div>
                      <div className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {phrase.difficulty}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mb-1">
                      <span className="font-medium">Meaning:</span>{" "}
                      {phrase.meaning}
                    </p>
                    <p className="text-xs mb-1" style={{ color: "#374151" }}>
                      <span className="font-medium">Chart Function:</span>{" "}
                      {phrase.chartFunction}
                    </p>
                    <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-1 mt-1">
                      <span className="font-medium not-italic">Example:</span>{" "}
                      {phrase.example}
                    </p>
                  </div>
                ))}
                {displayedPhraseWords.length % 2 !== 0 && (
                  <div className="hidden md:block" />
                )}
              </div>
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
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5 mr-2"
                        >
                          <path d="M12 8v8"></path>
                          <path d="M8 12h8"></path>
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

export default function Task1WritingInterface({
  question,
  questionType,
  bandLevel,
  timeLimit,
}: Task1WritingInterfaceProps) {
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isWordCountValid, setIsWordCountValid] = useState(true);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [questionTest, setQuestion] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve config from sessionStorage
    const config = sessionStorage.getItem("task1WritingConfig");
    if (config) {
      try {
        const parsedConfig = JSON.parse(config);
        if (parsedConfig.question) {
          setQuestion(
            parsedConfig.question
              .replace(/^\*\*IELTS Writing Task 1:\*\*\s*/, "")
              .trim()
          );
        }
        if (parsedConfig.apiImageUrl) {
          setImageUrl(parsedConfig.apiImageUrl);
        }
        // Note: uploadedImage is a File object and cannot be stored directly in sessionStorage.
        // If you need to handle uploadedImage, it would require a different approach (e.g., storing as a data URL).
      } catch (error) {
        console.error("Error parsing sessionStorage config:", error);
      }
    }
  }, []);
  const { formattedTime, isRunning, startTimer, updateTimer } = useTimer({
    initialMinutes: timeLimit === "no-limit" ? 0 : parseInt(timeLimit),
    onTimeUp: () => setShowTimeUpDialog(true),
    autoStart: timeLimit !== "no-limit" && parseInt(timeLimit) > 0,
  });

  // Start timer when component mounts if time limit is set
  useEffect(() => {
    if (timeLimit !== "no-limit" && parseInt(timeLimit) > 0) {
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
    sessionStorage.setItem("task1EssayContent", essayContent);
    setShowLoadingPage(true);
  };

  const handleLoadingComplete = () => {
    // First hide the loading page
    setShowLoadingPage(false);
    // Then show feedback after a brief delay to ensure state update
    setTimeout(() => {
      setShowFeedback(true);
    }, 100);
  };

  const handleSaveDraft = () => {
    // Save to localStorage
    localStorage.setItem("task1EssayDraft", essayContent);
    localStorage.setItem("task1Question", question);
    alert("Task 1 draft saved successfully");
  };

  // Show feedback interface after submission
  if (showFeedback) {
    return (
      <Task1FeedbackInterface
        essayContent={essayContent}
        onTryAgain={() => setShowFeedback(false)}
        onNextPractice={() => {
          // Handle next practice logic
          console.log("Next practice");
        }}
      />
    );
  }

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
          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-6 mb-4 border-2 border-cyan-300 shadow-sm">
            <div className="text-teal-800 font-bold text-sm mb-3">
              IELTS Writing Task 1:
            </div>
            <div className="text-gray-800 text-sm leading-relaxed">
              {questionTest ||
                "No question available. Please generate or select a question."}
            </div>
          </div>

          {imageUrl ? (
            <div className="bg-white rounded-md p-4 mb-3 border-2 border-gray-200 shadow-sm">
              <img
                src={imageUrl}
                alt="Task 1 Visual"
                className="w-full max-h-[400px] object-contain rounded-md"
                onError={() => {
                  console.error("Failed to load image");
                }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-md p-4 mb-3 border-2 border-gray-200 shadow-sm text-gray-600 text-sm">
              No image available. Please generate or upload an image.
            </div>
          )}
          <div className="flex items-center justify-between mb-2 h-8">
            <Timer
              time={formattedTime()}
              onTimeSelect={handleTimeSelect}
              isRunning={isRunning}
            />
            <WordCounter
              count={wordCount}
              maxWords={400}
              isValid={isWordCountValid}
              minWords={50}
            />
          </div>

          <Editor
            value={essayContent}
            onChange={setEssayContent}
            onWordCountChange={handleWordCountChange}
            minWords={50}
            maxWords={400}
            placeholder="Start writing your Task 1 response here..."
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

        <div
          className="hidden lg:block lg:w-2/5 lg:pl-3 lg:flex lg:flex-col"
          style={{ minHeight: "500px" }}
        >
          <Task1OutlineSection
            questionType={questionType}
            question={question}
          />
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <Task1OutlineSection questionType={questionType} question={question} />
      </div>

      {/* Resources Section Below */}
      <Task1ResourcesSection questionType={questionType} />

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Task 1 Practice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the Task 1 writing practice? Your
              progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Writing</AlertDialogCancel>
            <Link href="/writing-task-1">
              <AlertDialogAction>Exit</AlertDialogAction>
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
              Your allocated time for this Task 1 essay has ended. Would you
              like to submit your work now or continue writing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Writing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowTimeUpDialog(false);
                handleSubmit();
              }}
            >
              Submit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Word Count Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Word Count Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Your response must be at least 50 words. Please add more content
              before submitting for feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Interactive Loading Page */}
      <InteractiveLoadingPage
        isVisible={showLoadingPage}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
}
