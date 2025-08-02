import { ArrowLeft, CheckCircle, AlertTriangle, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "wouter";
import { useState, useEffect } from "react";

interface Task1FeedbackInterfaceProps {
  essayContent: string;
  onTryAgain: () => void;
  onNextPractice: () => void;
  prompt: string;
  url?: string;
}

interface CriteriaScores {
  "Task Achievement": {
    score: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    specific_suggestions: string[];
  };
  "Coherence and Cohesion": {
    score: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    specific_suggestions: string[];
  };
  "Lexical Resource": {
    score: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    vocabulary_enhancement: string[];
  };
  "Grammatical Range and Accuracy": {
    score: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    grammar_focus: string[];
  };
}

interface FeedbackData {
  criteria_scores: CriteriaScores;
  overall_assessment: {
    score: number;
    summary: string;
    critical_feedback: string;
    next_steps: string;
  };
}

interface GrammarFeedbackItem {
  id: string;
  type: string;
  category: string;
  original: string;
  corrected?: string;
  improved?: string;
  explanation: string;
  rule?: string;
  severity?: string;
  band_impact?: string;
}

interface GrammarFeedback {
  highlighted_essay: string;
  feedback_items: GrammarFeedbackItem[];
}

export function Task1FeedbackInterface({
  essayContent,
  onTryAgain,
  onNextPractice,
  prompt,
  url,
}: Task1FeedbackInterfaceProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [grammarData, setGrammarData] = useState<GrammarFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionTime, setCompletionTime] = useState<string>('N/A');

  useEffect(() => {
    setStartTime(new Date());
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const configData = sessionStorage.getItem('task1WritingConfig');
        let promptValue = "dwdwd";
        let urlValue = "dwdwd";
        
        if (configData) {
          try {
            const parsedConfig = JSON.parse(configData);
            promptValue = parsedConfig.question || "dwdwd";
            urlValue = parsedConfig.apiImageUrl || "dwdwd";
          } catch (parseError) {
            console.error('Failed to parse sessionStorage data:', parseError);
          }
        }
        
        const evalResponse = await fetch('https://agentwp-api.aihubproduction.com/evaluate-essay-task1', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptValue,
            url: urlValue,
            essay: essayContent,
          }),
        });
        
        if (!evalResponse.ok) {
          throw new Error(`Essay evaluation failed! status: ${evalResponse.status}`);
        }
        
        const evalResult = await evalResponse.json();
        if (!evalResult.success || !evalResult.data) {
          throw new Error(evalResult.message || 'Invalid evaluation API response');
        }
        
        setFeedbackData(evalResult.data.data);
        
        const grammarResponse = await fetch('https://agentwp-api.aihubproduction.com/check-grammar-task1', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            essay: essayContent,
            level: 'Band 6.5',
          }),
        });
        
        if (!grammarResponse.ok) {
          throw new Error(`Grammar check failed! status: ${grammarResponse.status}`);
        }
        
        const grammarResult = await grammarResponse.json();
        if (!grammarResult.success || !grammarResult.data) {
          throw new Error(grammarResult.message || 'Invalid grammar API response');
        }
        
        setGrammarData(grammarResult.data.data);
        
        if (startTime) {
          const endTime = new Date();
          const diffMs = endTime.getTime() - startTime.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          setCompletionTime(`${diffMins} min${diffMins !== 1 ? 's' : ''}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Evaluation failed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [essayContent]);

  const getScorePercentage = (score: number) => {
    return (score / 9) * 100;
  };

  const createHighlightedEssay = () => {
    if (!grammarData || !grammarData.highlighted_essay || !grammarData.feedback_items) {
      return (
        <div className="highlight-section bg-[#fdfdfd] border border-gray-300 rounded-lg p-6">
          <p className="text-base leading-relaxed">No grammar feedback available.</p>
        </div>
      );
    }

    const cleanText = grammarData.highlighted_essay.replace(/<[^>]+>/g, '').trim();
    const feedbackMap = new Map(grammarData.feedback_items.map(item => [item.id, item]));
    const parser = new DOMParser();
    const doc = parser.parseFromString(grammarData.highlighted_essay, 'text/html');
    const spans = doc.querySelectorAll('span[data-id]');
    const highlightedParts: JSX.Element[] = [];
    let currentIndex = 0;

    spans.forEach((span, spanIndex) => {
      const id = span.getAttribute('data-id');
      const feedback = feedbackMap.get(id!);
      if (!feedback) return;

      const spanText = span.textContent || '';
      const startIndex = cleanText.indexOf(spanText, currentIndex);
      if (startIndex === -1) return;

      if (startIndex > currentIndex) {
        highlightedParts.push(
          <span key={`text-${spanIndex}`}>
            {cleanText.slice(currentIndex, startIndex)}
          </span>
        );
      }

      let className = "inline cursor-pointer hover:opacity-80 transition-opacity px-1 rounded";
      let bgColor = "";
      switch (feedback.type) {
        case 'error':
          bgColor = "bg-[#ffcdd2] text-[#c62828]";
          break;
        case 'improvement':
          bgColor = "bg-[#fef9c3] text-[#92400e]";
          break;
        case 'suggestion':
          bgColor = "bg-[#dcfce7] text-[#166534]";
          break;
      }

      const tooltipContent = (
        <div className="max-w-sm space-y-3">
          <div>
            <div className="font-semibold text-sm mb-1 text-yellow-400">Category:</div>
            <div className="text-xs text-gray-200">{feedback.category}</div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-1 text-red-400">Original:</div>
            <div className="text-xs text-gray-200">{feedback.original}</div>
          </div>
          {(feedback.improved || feedback.corrected) && (
            <div>
              <div className="font-semibold text-sm mb-1 text-green-400">
                {feedback.type === 'error' ? 'Corrected:' : 'Improved:'}
              </div>
              <div className="text-xs text-gray-200">{feedback.improved || feedback.corrected}</div>
            </div>
          )}
          <div>
            <div className="font-semibold text-sm mb-1 text-blue-400">Explanation:</div>
            <div className="text-xs text-gray-200">{feedback.explanation}</div>
          </div>
          {feedback.band_impact && (
            <div>
              <div className="font-semibold text-sm mb-1 text-purple-400">Band Impact:</div>
              <div className="text-xs text-gray-200">{feedback.band_impact}</div>
            </div>
          )}
          {feedback.rule && (
            <div>
              <div className="font-semibold text-sm mb-1 text-purple-400">Rule:</div>
              <div className="text-xs text-gray-200">{feedback.rule}</div>
            </div>
          )}
          {feedback.severity && (
            <div>
              <div className="font-semibold text-sm mb-1 text-orange-400">Severity:</div>
              <div className="text-xs text-gray-200">{feedback.severity}</div>
            </div>
          )}
        </div>
      );

      highlightedParts.push(
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <span className={`${className} ${bgColor}`}>
              {spanText}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-800 text-white p-4 max-w-md">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      );

      currentIndex = startIndex + spanText.length;
    });

    if (currentIndex < cleanText.length) {
      highlightedParts.push(
        <span key="text-end">{cleanText.slice(currentIndex)}</span>
      );
    }

    return (
      <div className="highlight-section bg-[#fdfdfd] border border-gray-300 rounded-lg p-6">
        <div className="mb-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#ffcdd2] rounded"></span>
              <span>Error</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#fef9c3] rounded"></span>
              <span>Improvement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#dcfce7] rounded"></span>
              <span>Suggestion</span>
            </div>
          </div>
        </div>
        <p className="text-base leading-relaxed">
          {highlightedParts}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Evaluating your essay...</p>
      </div>
    );
  }

  if (error || !feedbackData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg text-red-500">{error || 'Failed to load feedback'}</p>
      </div>
    );
  }

  const { criteria_scores, overall_assessment } = feedbackData;

  return (
    <TooltipProvider>
      <div className="p-6">
        <div className="flex mb-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExitDialog(true)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Your essay has been evaluated based on the IELTS Task 1 criteria!</h2>
        </div>

        <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-[1100px] mx-auto">
          <div className="column flex flex-col gap-4">
            <div className="box bg-[#FAFAFA] rounded-lg border border-black p-3 h-full flex flex-col">
              <h2 className="text-lg font-bold mb-3">Score Breakdown</h2>
              <div className="flex flex-col justify-between flex-1 gap-3">
                {Object.entries(criteria_scores).map(([criterion, { score }]) => (
                  <div key={criterion}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{criterion}</span>
                      <span className="text-[#44b9b0] font-bold">{score.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-[18px]">
                      <div 
                        className="bg-[#44b9b0] h-[18px] rounded-full" 
                        style={{ width: `${getScorePercentage(score)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Overall Band Score</span>
                  <span className="text-[#44b9b0] text-4xl font-extrabold">{overall_assessment.score.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="column flex flex-col gap-4">
            <div className="box bg-[#FAFAFA] border border-black rounded-lg p-4 h-auto">
              <h2 className="text-xl font-bold mt-0 mb-2">Overall Assessment:</h2>
              <div className="overflow-y-auto h-64 custom-scrollbar pr-1">
                <Accordion type="single" collapsible className="w-full space-y-1">
                  <AccordionItem value="summary" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100">
                      <span className="text-gray-800">Summary</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {overall_assessment.summary}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="critical-feedback" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-orange-50 to-transparent hover:from-orange-100">
                      <span className="text-gray-800">Critical Feedback</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {overall_assessment.critical_feedback}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="next-steps" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-green-50 to-transparent hover:from-green-100">
                      <span className="text-gray-800">Next Steps</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {overall_assessment.next_steps}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="box bg-[#FAFAFA] border border-black rounded-lg p-4">
              <h2 className="text-xl font-bold mt-0 mb-2 text-center">Writing Statistic</h2>
              <div className="stat-row flex justify-around mt-2">
                <div className="text-center">
                  <div className="stat-label font-bold">Word Count</div>
                  <div className={`stat-value font-bold text-2xl mt-1 ${essayContent.split(/\s+/).filter(Boolean).length < 150 ? 'text-red-500' : ''}`}>
                    {essayContent.split(/\s+/).filter(Boolean).length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="stat-label font-bold">Completion Time</div>
                  <div className="stat-value font-bold text-2xl mt-1">
                    {completionTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-[1100px] mx-auto mb-6">
          <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>
          <Tabs defaultValue="task-achievement" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-white border border-gray-300 rounded-lg h-12 p-1">
              {Object.keys(criteria_scores).map((criterion) => (
                <TabsTrigger 
                  key={criterion}
                  value={criterion.toLowerCase().replace(/\s+and\s+/g, '-')}
                  className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
                >
                  {criterion}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(criteria_scores).map(([criterion, data]) => (
              <TabsContent 
                key={criterion}
                value={criterion.toLowerCase().replace(/\s+and\s+/g, '-')}
                className="border border-gray-300 rounded-lg p-6 bg-white"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{data.feedback}</p>
                  </div>
                  {data.strengths.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                      </div>
                      <ul className="space-y-2">
                        {data.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {data.areas_for_improvement.map((area, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sm">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-600">
                        {criterion === "Lexical Resource" ? "Vocabulary Enhancement" : 
                         criterion === "Grammatical Range and Accuracy" ? "Grammar Focus" : 
                         "Specific Suggestions"}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {(criterion === "Lexical Resource" ? data.vocabulary_enhancement : 
                        criterion === "Grammatical Range and Accuracy" ? data.grammar_focus : 
                        data.specific_suggestions).map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sm">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="container max-w-[1100px] mx-auto mb-6">
          <h2 className="text-2xl font-bold mb-4">Grammar Checker</h2>
          {createHighlightedEssay()}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" /> Download Feedback
          </Button>
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={onTryAgain}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={onNextPractice}
          >
            <ArrowRight className="mr-2 h-4 w-4" /> Next Practice
          </Button>
        </div>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Task 1 Practice?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will not be saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue</AlertDialogCancel>
              <Link href="/writing-task-1">
                <AlertDialogAction>
                  Exit
                </AlertDialogAction>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}