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
import { ShimmerLoader, ShimmerCard, ShimmerList, ShimmerText } from "@/components/ui/shimmer-loader";
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

interface Task1WritingInterfaceProps {
  question: string;
  questionType: string;
  bandLevel: string;
  timeLimit: string;
}

// Task 1 Outline component with tabs for outline and useful expressions
function Task1OutlineSection({ questionType, question }: { questionType: string, question: string }) {
  const [showOutline, setShowOutline] = useState(true);
  const outline = getTask1Outline(questionType);

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
                Analyze Question
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
            style={{ height: '500px' }}
          >
            <div>
              <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                Sample - Bài mẫu
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">Sample answer with paragraph-by-paragraph breakdown</p>

              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '430px' }}>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {/* Accordion 1: Paragraph 1: Introduction */}
                  <AccordionItem 
                    value="paragraph-1"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </span>
                        Paragraph 1: Introduction
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        The line graph illustrates the consumption of energy in the United States from 1980, with projections extending to 2030, categorized by different fuel types.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 2: Paragraph 2: Overview */}
                  <AccordionItem 
                    value="paragraph-2"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          2
                        </span>
                        Paragraph 2: Overview
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        Overall, the graph indicates a general increase in energy consumption across most sources over the period. While petroleum consistently remained the dominant energy source, natural gas experienced the most substantial growth. Conversely, nuclear energy exhibited relative stability, and renewables, although starting from a low base, showed a gradual upward trend.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 3: Paragraph 3: First Main Feature */}
                  <AccordionItem 
                    value="paragraph-3"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          3
                        </span>
                        Paragraph 3: First Main Feature
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        Petroleum held the largest share of energy consumption, starting at approximately 35 quadrillion BTU in 1980. It rose slightly to around 37 quadrillion BTU by 2008 and is projected to remain at this level until 2030. Natural gas consumption, however, saw a significant increase, rising from about 20 quadrillion BTU in 1980 to roughly 24 quadrillion BTU in 2008.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 4: Paragraph 4: Second Main Feature */}
                  <AccordionItem 
                    value="paragraph-4"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          4
                        </span>
                        Paragraph 4: Second Main Feature
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        Coal consumption increased steadily from 15 quadrillion BTU in 1980 to approximately 22 quadrillion BTU in 2008 and is expected to remain stable until 2030. In contrast, nuclear energy remained relatively constant at around 8 quadrillion BTU throughout the period. Renewables, starting from a low base of 3 quadrillion BTU in 1980, increased to about 7 quadrillion BTU by 2008 and are projected to reach 12 quadrillion BTU by 2030.
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
                Analyze Question - Phân tích câu hỏi
              </h4>
              <p className="text-xs mb-4 text-gray-600 italic bg-gray-50 p-2 rounded-md border border-gray-100">
                Detailed analysis of the Task 1 question and visual data
              </p>

              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '430px' }}>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {/* Accordion 1: Image Description */}
                  <AccordionItem 
                    value="image-description"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </span>
                        Image Description
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <div className="space-y-3">
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Chart Type:</span> Line Graph
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Main Subject:</span> Energy consumption in the USA by different sources (petroleum, natural gas, coal, nuclear, renewables)
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Unit of Measurement:</span> Quadrillion BTU (British Thermal Units)
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Time Period:</span> From 1980 to 2030 (projected)
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Verb Tense Used:</span> Combination of Past tense for the period 1980–2008 and Future tense for the projected period 2008–2030
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md border border-blue-100 bg-[#f9fafb] text-[#374151]">
                            <p className="text-xs">
                              <span className="text-[#1fb2aa] font-bold">Chart Summary:</span> The line graph shows the changes in energy consumption in the USA over time, categorized by different energy sources, including projections for the future.
                            </p>
                          </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion 2: Analyze Question */}
                  <AccordionItem 
                    value="analyze-question"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                          2
                        </span>
                        Analyze Question
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
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Question Requirement:</p>
                            <p className="text-xs text-[#374151]">
                              Summarise the information by selecting and reporting the main features, and make comparisons where relevant
                            </p>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Key Tasks:</p>
                            <ul className="text-xs text-[#374151] space-y-1 ml-3">
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Summarize information about the energy consumption of each energy source.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Compare the changes in energy consumption between different energy sources.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Highlight key trends and projections for the future.</span>
                              </li>
                            </ul>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Band Guidance:</p>
                            <p className="text-xs text-[#374151]">
                              With a target of Band 6.0: Adequate overview with main trends identified. Cover key features but details may be incomplete. Clear purpose.
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
                    <AccordionTrigger 
                      className="text-sm font-medium py-3 px-4 hover:no-underline bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10"
                    >
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
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Overall Trends:</p>
                            <ul className="text-xs text-[#374151] space-y-1 ml-3">
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Petroleum remains the largest energy source consumed, with a slight upward trend from about 35 quadrillion BTU in 1980 to around 37 quadrillion BTU by 2030.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Natural Gas shows significant growth, from about 20 quadrillion BTU in 1980 to around 32 quadrillion BTU by 2030.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Coal has a slow and steady upward trend, from about 15 quadrillion BTU in 1980 to around 22 quadrillion BTU by 2030.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Nuclear energy remains relatively stable, fluctuating around 8 quadrillion BTU throughout the period.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Renewables show growth, especially in the projected period, from about 3 quadrillion BTU in 1980 to around 12 quadrillion BTU by 2030.</span>
                              </li>
                            </ul>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Key Data Points:</p>
                            <ul className="text-xs text-[#374151] space-y-1 ml-3">
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>In 2008, petroleum accounted for about 37 quadrillion BTU, natural gas about 24 quadrillion BTU, coal about 22 quadrillion BTU, nuclear about 8 quadrillion BTU, and renewables about 7 quadrillion BTU.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Projected for 2030, petroleum is expected to account for about 37 quadrillion BTU, natural gas about 32 quadrillion BTU, coal about 22 quadrillion BTU, nuclear about 8 quadrillion BTU, and renewables about 12 quadrillion BTU.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Petroleum has always been the largest energy source consumed throughout the period.</span>
                              </li>
                            </ul>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Significant Changes:</p>
                            <ul className="text-xs text-[#374151] space-y-1 ml-3">
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Significant growth of natural gas, especially from 2000 onwards.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Growth of renewables in the projected period 2008-2030.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs mt-0.5">•</span>
                                <span>Relative stability of nuclear energy.</span>
                              </li>
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
                      {isLoading ? (
                        <div className="space-y-3">
                          <ShimmerCard className="border-gray-100" />
                          <ShimmerCard className="border-gray-100" />
                          <ShimmerCard className="border-gray-100" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Task 1:</p>
                            <p className="text-xs text-[#374151]">
                              Introduction paragraph - paraphrase the question and introduce the line graph showing energy consumption in the USA from 1980 to 2030, categorized by source.
                            </p>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Task 2:</p>
                            <p className="text-xs text-[#374151]">
                              Overview paragraph - summarize 2-3 main trends: petroleum remains the largest source, natural gas shows significant growth, renewables increase in the future.
                            </p>
                          </div>
                          <div className="p-3 rounded-md border border-gray-100 bg-[#f9fafb]">
                            <p className="text-xs font-bold text-[#1fb2aa] mb-2">Task 3:</p>
                            <p className="text-xs text-[#374151]">
                              Body paragraphs - Body 1 describes petroleum and natural gas (specific data), Body 2 describes coal, nuclear, and renewables (data and comparisons)
                            </p>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
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
          <p className="text-gray-700 font-medium text-base mb-2 text-center">Hãy cố gắng hết mình nhé!</p>
          <p className="text-primary font-medium text-sm text-center">Good things take time. 😉</p>
        </div>
      )}
    </div>
  );
}

// Task 1 Vocabulary and Phrases component
function Task1ResourcesSection({ questionType }: { questionType: string }) {
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [showWordBank, setShowWordBank] = useState(false);
  const [vocabDisplayCount, setVocabDisplayCount] = useState(10);
  const [phraseDisplayCount, setPhraseDisplayCount] = useState(8);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [isLoadingPhrases, setIsLoadingPhrases] = useState(false);
  const [isLoadingWordBank, setIsLoadingWordBank] = useState(false);
  
  const allVocabulary = getTask1Vocabulary(questionType);
  const phrases = getTask1Phrases();

  // Filter vocabulary for each tab
  const vocabularyWords = allVocabulary.flatMap(category => 
    category.words
      .filter(word => ["N", "V", "Adj", "Adv"].includes(word.partOfSpeech))
      .map(word => ({ ...word, type: category.type }))
  );

  // Additional vocabulary data (matching Task 2 styling)
  const additionalVocabulary = [
    {
      word: "Sustainable",
      partOfSpeech: "Adj",
      difficulty: "B2",
      meaning: "Có thể duy trì được lâu dài, bền vững",
      chartFunction: "Mô tả sự phát triển lâu dài",
      example: "Companies are trying to develop more sustainable business practices.",
      type: "positive"
    },
    {
      word: "Implement",
      partOfSpeech: "V",
      difficulty: "B2",
      meaning: "Thực hiện, triển khai",
      chartFunction: "Mô tả việc thực hiện các biện pháp",
      example: "The government plans to implement new environmental regulations next year.",
      type: "neutral"
    },
    {
      word: "Unprecedented",
      partOfSpeech: "Adj",
      difficulty: "C1",
      meaning: "Chưa từng có trước đây, chưa từng thấy",
      chartFunction: "Mô tả mức độ cao bất thường",
      example: "The pandemic caused unprecedented disruption to global supply chains.",
      type: "neutral"
    },
    {
      word: "Mitigate",
      partOfSpeech: "V",
      difficulty: "C1",
      meaning: "Làm giảm, làm dịu bớt",
      chartFunction: "Mô tả sự giảm thiểu tác động tiêu cực",
      example: "Companies are taking steps to mitigate their environmental impact.",
      type: "positive"
    }
  ];

  // Combine vocabulary words
  const allVocabularyWords = [...vocabularyWords, ...additionalVocabulary];

  // Get phrase words from vocabulary data
  const phraseWords = allVocabulary.flatMap(category => 
    category.words
      .filter(word => word.partOfSpeech === "Phrase")
      .map(word => ({ ...word, type: category.type }))
  );

  // Additional collocations data
  const additionalCollocations = [
    {
      word: "Show an upward trend",
      partOfSpeech: "Collocations",
      difficulty: "B2",
      meaning: "Thể hiện xu hướng tăng",
      chartFunction: "Mô tả xu hướng tăng trưởng",
      example: "The graph shows an upward trend in online shopping.",
      type: "positive"
    },
    {
      word: "Remain stable",
      partOfSpeech: "Collocations",
      difficulty: "B1",
      meaning: "Duy trì ổn định",
      chartFunction: "Mô tả sự ổn định không thay đổi",
      example: "House prices remained stable throughout the year.",
      type: "neutral"
    },
    {
      word: "Experience a decline",
      partOfSpeech: "Collocations",
      difficulty: "B2",
      meaning: "Trải qua sự suy giảm",
      chartFunction: "Mô tả xu hướng giảm sút",
      example: "The industry experienced a decline in profits.",
      type: "negative"
    },
    {
      word: "Reach its peak",
      partOfSpeech: "Collocations",
      difficulty: "B2",
      meaning: "Đạt đỉnh cao nhất",
      chartFunction: "Mô tả điểm cao nhất trên biểu đồ",
      example: "Sales reached their peak during the holiday season.",
      type: "positive"
    }
  ];

  // Combine phrase words with additional collocations
  const allPhraseWords = [...phraseWords, ...additionalCollocations];

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

  // Handle unified word bank button with 5-second loading animation
  const handleExploreWordBank = () => {
    setIsLoadingWordBank(true);
    setTimeout(() => {
      setIsLoadingWordBank(false);
      setShowWordBank(true);
    }, 5000);
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
              Chart-specific Vocabulary
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
              Trend collocations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vocabulary" className="p-0 min-h-[200px]">
          {isLoadingWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <BookLoader message="Flipping through our vocabulary archive..." />
            </div>
          ) : !showWordBank ? (
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
                        <p className="text-xs mb-1" style={{ color: '#374151' }}>
                          <span className="font-medium">Chart Function:</span> {word.chartFunction}
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
          {isLoadingWordBank ? (
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[200px]">
              <BookLoader message="Flipping through our vocabulary archive..." />
            </div>
          ) : !showWordBank ? (
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
                      <p className="text-xs mb-1" style={{ color: '#374151' }}>
                        <span className="font-medium">Chart Function:</span> {phrase.chartFunction}
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

// Chart component for Task 1 data visualization
function Task1Chart() {
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
    <div className="bg-white rounded-md p-4 mb-3 border-2 border-gray-200 shadow-sm">
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default function Task1WritingInterface({ question, questionType, bandLevel, timeLimit }: Task1WritingInterfaceProps) {
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isWordCountValid, setIsWordCountValid] = useState(true);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);

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
    localStorage.setItem('task1EssayDraft', essayContent);
    localStorage.setItem('task1Question', question);
    alert('Task 1 draft saved successfully');
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
            <div className="text-teal-800 font-bold text-sm mb-3">IELTS Writing Task 1:</div>
            <div className="text-gray-800 text-sm leading-relaxed">The bar chart below shows the percentage of students who passed their high school competency exams, by subject and gender, during the period 2010-2011. Summarise the information by selecting and reporting the main features and make comparisons where relevant.</div>
          </div>

          <Task1Chart />

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

        <div className="hidden lg:block lg:w-2/5 lg:pl-3 lg:flex lg:flex-col" style={{ minHeight: '500px' }}>
          <Task1OutlineSection 
            questionType={questionType} 
            question={question} 
          />
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <Task1OutlineSection 
          questionType={questionType} 
          question={question} 
        />
      </div>

      {/* Resources Section Below */}
      <Task1ResourcesSection 
        questionType={questionType} 
      />

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Task 1 Practice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the Task 1 writing practice? Your progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Writing</AlertDialogCancel>
            <Link href="/writing-task-1">
              <AlertDialogAction>
                Exit
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
              Your allocated time for this Task 1 essay has ended. Would you like to submit your work now or continue writing?
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
            <AlertDialogTitle>Word Count Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Your response must be at least 50 words. Please add more content before submitting for feedback.
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