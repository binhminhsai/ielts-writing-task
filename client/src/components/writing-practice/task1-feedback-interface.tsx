import { Download, Pen, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle, Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";

// Enhanced highlighting types
type HighlightType = 'red' | 'yellow' | 'green';

interface HighlightData {
  type: HighlightType;
  tooltip?: {
    category: string;
    original: string;
    improved?: string;
    corrected?: string;
    explanation: string;
    bandImpact?: string;
    rule?: string;
    severity?: string;
  };
}

// Task 1 feedback data interface
interface Task1FeedbackData {
  scores: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammar: number;
    overall: number;
  };
  stats: {
    totalWords: number;
    completionTime: string;
    vocabularyRange: string;
    grammarAccuracy: string;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
  };
}

interface Task1FeedbackInterfaceProps {
  essayContent: string;
  onTryAgain: () => void;
  onNextPractice: () => void;
}

export function Task1FeedbackInterface({
  essayContent,
  onTryAgain,
  onNextPractice,
}: Task1FeedbackInterfaceProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Sample Task 1 essay about energy consumption
  const sampleEssay = `The line graph illustrates the consumption of energy by source in the USA from 1980 to 2030, with projections for the future period.
Overall, petroleum remains the dominant energy source throughout the entire period, while natural gas shows significant growth, especially after 2008.
Renewables demonstrate the most dramatic increase in the projected period, while nuclear energy remains relatively stable.
Looking at the details, petroleum consumption started at approximately 35 quadrillion BTU in 1980 and maintains its position as the largest energy source.
Although it experiences some fluctuations, particularly a decline around 2008, it is projected to return to around 37 quadrillion BTU by 2030.
Natural gas consumption shows steady growth from about 20 quadrillion BTU in 1980 to 24 quadrillion BTU in 2008.
The most significant change occur in the projected period, where natural gas consumption is expected to rise sharply to 32 quadrillion BTU by 2030.
Coal demonstrates gradual increase from 15 quadrillion BTU in 1980 to 22 quadrillion BTU in 2008, with projections showing continued growth to the same level by 2030.
Nuclear energy consumption remains relatively stable throughout the period, fluctuating around 8 quadrillion BTU with minimal variation.
The most notable trend is seen in renewables, which start at just 3 quadrillion BTU in 1980 and remain low until 2008 at 7 quadrillion BTU.
However, renewable energy sources is projected to experience substantial growth, reaching 12 quadrillion BTU by 2030, making it the third-largest energy source.`;

  // Task 1 specific feedback data - using same structure as Task 2
  const feedbackData: Task1FeedbackData = {
    scores: {
      taskAchievement: 7.0,
      coherenceCohesion: 8.0,
      lexicalResource: 7.0,
      grammar: 7.0,
      overall: 7.5,
    },
    stats: {
      totalWords: 307,
      completionTime: "35:22",
      vocabularyRange: "Good",
      grammarAccuracy: "Good",
    },
    feedback: {
      strengths: [
        "Clear overview paragraph identifying main trends",
        "Good use of data and specific figures from the graph",
        "Appropriate Task 1 language for describing trends",
        "Logical organization with introduction and body paragraphs",
      ],
      improvements: [
        "Some grammatical errors affect clarity",
        "Could provide more precise comparisons between energy sources",
        "Paragraphing could be improved for better coherence",
        "Some sentences are repetitive and could be more varied",
      ],
    }
  };

  // Task 1 specific highlighting data
  const highlightMapping: Record<string, HighlightData> = {
    // Red highlights (errors)
    "The most significant change occur in the projected period, where natural gas consumption is expected to rise sharply to 32 quadrillion BTU by 2030.": {
      type: 'red',
      tooltip: {
        category: 'Verb Tense OR Sentence Structure',
        original: 'change occur',
        corrected: 'change occurs',
        explanation: 'Singular subjects like "change" require singular verbs. Use "occurs" instead of "occur".',
        rule: 'Singular subjects take singular verbs',
        severity: 'High'
      }
    },
    "However, renewable energy sources is projected to experience substantial growth, reaching 12 quadrillion BTU by 2030, making it the third-largest energy source.": {
      type: 'red',
      tooltip: {
        category: 'Verb Tense OR Sentence Structure',
        original: 'renewable energy sources is projected',
        corrected: 'renewable energy sources are projected',
        explanation: 'Plural subjects like "renewable energy sources" require plural verbs. Use "are" instead of "is".',
        rule: 'Plural subjects take plural verbs',
        severity: 'High'
      }
    },
    
    // Yellow highlights (vocabulary enhancement)
    "Natural gas consumption shows steady growth from about 20 quadrillion BTU in 1980 to 24 quadrillion BTU in 2008.": {
      type: 'yellow',
      tooltip: {
        category: 'Vocabulary Enhancement',
        original: 'shows steady growth',
        improved: 'demonstrates consistent upward trend',
        explanation: 'Using more sophisticated vocabulary improves the academic tone of Task 1 writing.',
        bandImpact: 'Improves Lexical Resource to Band 7+'
      }
    },
    "Coal demonstrates gradual increase from 15 quadrillion BTU in 1980 to 22 quadrillion BTU in 2008": {
      type: 'yellow',
      tooltip: {
        category: 'Vocabulary Enhancement',
        original: 'gradual increase',
        improved: 'steady upward trajectory',
        explanation: 'Varied vocabulary for describing trends enhances the lexical resource score.',
        bandImpact: 'Shows good range of trend vocabulary'
      }
    },
    
    // Green highlights (good examples)
    "Overall, petroleum remains the dominant energy source throughout the entire period, while natural gas shows significant growth, especially after 2008.": {
      type: 'green',
      tooltip: {
        category: 'Task Achievement',
        original: 'Overall, petroleum remains the dominant energy source throughout the entire period',
        explanation: 'Excellent overview statement that identifies the main trend clearly.',
        bandImpact: 'Strong overview contributes to Band 6+ Task Achievement'
      }
    },
    "The line graph illustrates the consumption of energy by source in the USA from 1980 to 2030, with projections for the future period.": {
      type: 'green',
      tooltip: {
        category: 'Task Achievement',
        original: 'The line graph illustrates the consumption of energy by source in the USA from 1980 to 2030',
        explanation: 'Good paraphrasing of the question and clear introduction of the chart.',
        bandImpact: 'Effective paraphrasing supports Task Achievement'
      }
    }
  };

  // Create highlighted essay with tooltips - exactly matching Task 2 implementation
  const createHighlightedEssay = () => {
    const sentences = sampleEssay.split(/(?<=[.!?])\s+/);
    const result: React.ReactNode[] = [];

    sentences.forEach((sentence, index) => {
      const matchingEntry = Object.entries(highlightMapping).find(([key, _]) => 
        sentence.includes(key) || key.includes(sentence)
      );

      if (matchingEntry) {
        const [_, data] = matchingEntry;
        const bgColor = data.type === 'red' ? 'bg-[#ffcdd2]' : 
                       data.type === 'yellow' ? 'bg-[#fef9c3]' : 
                       'bg-[#dcfce7]';

        if (data.tooltip) {
          const tooltipContent = data.type === 'red' ? (
            // Red highlight tooltip - Error type
            <div className="space-y-2 text-left text-sm">
              <div>
                <span className="font-bold text-red-400">Category: </span>
                <span className="text-gray-200">{data.tooltip.category}</span>
              </div>
              <div>
                <span className="font-bold text-yellow-400">Original: </span>
                <span className="text-gray-200">{data.tooltip.original}</span>
              </div>
              <div>
                <span className="font-bold text-green-400">Corrected: </span>
                <span className="text-gray-200">{data.tooltip.corrected}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Explanation: </span>
                <span className="text-gray-200">{data.tooltip.explanation}</span>
              </div>
              <div>
                <span className="font-bold text-purple-400">Rule: </span>
                <span className="text-gray-200">{data.tooltip.rule}</span>
              </div>
              <div>
                <span className="font-bold text-orange-400">Severity: </span>
                <span className="text-gray-200">{data.tooltip.severity}</span>
              </div>
            </div>
          ) : (
            // Yellow/Green highlight tooltip - Improvement/Suggestion type
            <div className="space-y-2 text-left text-sm">
              <div>
                <span className="font-bold text-yellow-400">Category: </span>
                <span className="text-gray-200">{data.tooltip.category}</span>
              </div>
              <div>
                <span className="font-bold text-red-400">Original: </span>
                <span className="text-gray-200">{data.tooltip.original}</span>
              </div>
              <div>
                <span className="font-bold text-green-400">Improved: </span>
                <span className="text-gray-200">{data.tooltip.improved}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Explanation: </span>
                <span className="text-gray-200">{data.tooltip.explanation}</span>
              </div>
              <div>
                <span className="font-bold text-purple-400">Band Impact: </span>
                <span className="text-gray-200">{data.tooltip.bandImpact}</span>
              </div>
            </div>
          );

          result.push(
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span className={`cursor-help rounded px-1 ${bgColor}`}>
                  {sentence}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#1a1d26] text-white p-4 max-w-md border border-gray-600 shadow-lg">
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          );
        } else {
          result.push(
            <span key={index} className={`rounded px-1 ${bgColor}`}>
              {sentence}
            </span>
          );
        }
        
        if (index < sentences.length - 1) {
          result.push(<span key={`space-${index}`}> </span>);
        }
      } else {
        result.push(<span key={index}>{sentence}</span>);
        
        if (index < sentences.length - 1) {
          result.push(<span key={`space-${index}`}> </span>);
        }
      }
    });

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
          {result}
        </p>
      </div>
    );
  };

  const getScorePercentage = (score: number) => {
    return (score / 9) * 100;
  };

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
        {/* Left Column */}
        <div className="column flex flex-col gap-4">
            {/* Score Breakdown */}
            <div className="box bg-[#FAFAFA] rounded-lg border border-black p-3 h-full flex flex-col">
              <h2 className="text-lg font-bold mb-3">Score Breakdown</h2>

              <div className="flex flex-col justify-between flex-1 gap-3">
                {/* Task Achievement */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Task Achievement</span>
                    <span className="text-[#44b9b0] font-bold">7.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[18px]">
                    <div className="bg-[#44b9b0] h-[18px] rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Coherence & Cohesion */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Coherence & Cohesion</span>
                    <span className="text-[#44b9b0] font-bold">8.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[18px]">
                    <div className="bg-[#44b9b0] h-[18px] rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                {/* Lexical Resource */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Lexical Resource</span>
                    <span className="text-[#44b9b0] font-bold">7.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[18px]">
                    <div className="bg-[#44b9b0] h-[18px] rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Grammatical Range & Accuracy */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Grammatical Range & Accuracy</span>
                    <span className="text-[#44b9b0] font-bold">7.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-[18px]">
                    <div className="bg-[#44b9b0] h-[18px] rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Overall Band Score</span>
                  <span className="text-[#44b9b0] text-4xl font-extrabold">7.5</span>
                </div>
              </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="column flex flex-col gap-4">
            {/* Overall Feedback */}
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
                        The essay fulfills the requirements of the task and provides a reasonably comprehensive summary of the data. It shows a good understanding of the task, demonstrating the ability to identify and report key features and make relevant comparisons. While the essay is well-organized and coherent, there are areas for improvement in terms of lexical resource and the depth of analysis. The grammar and punctuation are generally well-controlled, with only minor errors. The candidate has demonstrated a clear understanding of the prompt and has presented the information in an organized and coherent manner.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="critical-feedback" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-orange-50 to-transparent hover:from-orange-100">
                      <span className="text-gray-800">Critical Feedback</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        To improve, focus on enhancing the depth of analysis by including more specific data points to support the trends identified and expanding the overview to include a broader summary of all categories. Also, work on diversifying the vocabulary and refining grammatical accuracy to elevate the overall quality of the writing.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="next-steps" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-green-50 to-transparent hover:from-green-100">
                      <span className="text-gray-800">Next Steps</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        Practice analyzing a variety of tables and charts, focusing on identifying key trends and supporting them with precise data. Work on expanding your vocabulary and refining your grammar through targeted exercises. Review and correct grammatical errors in your writing to improve accuracy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Writing Statistic */}
            <div className="box bg-[#FAFAFA] border border-black rounded-lg p-4">
              <h2 className="text-xl font-bold mt-0 mb-2 text-center">Writing Statistic</h2>
              <div className="stat-row flex justify-around mt-2">
                <div className="text-center">
                  <div className="stat-label font-bold">Word Count</div>
                  <div className={`stat-value font-bold text-2xl mt-1 ${feedbackData.stats.totalWords < 50 ? 'text-red-500' : ''}`}>
                    {feedbackData.stats.totalWords}
                  </div>
                </div>
                <div className="text-center">
                  <div className="stat-label font-bold">Completion Time</div>
                  <div className="stat-value font-bold text-2xl mt-1">
                    {feedbackData.stats.completionTime}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Detailed Feedback Section */}
      <div className="container max-w-[1100px] mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>
        
        <Tabs defaultValue="task-achievement" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-white border border-gray-300 rounded-lg h-12 p-1">
            <TabsTrigger 
              value="task-achievement" 
              className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
            >
              Task Achievement
            </TabsTrigger>
            <TabsTrigger 
              value="coherence-cohesion" 
              className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
            >
              Coherence & Cohesion
            </TabsTrigger>
            <TabsTrigger 
              value="lexical-resource" 
              className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
            >
              Lexical Resource
            </TabsTrigger>
            <TabsTrigger 
              value="grammar-accuracy" 
              className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
            >
              Grammar & Accuracy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="task-achievement" className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              {/* Feedback Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The response covers the requirements of the task and provides a relevant overview. Key features are adequately highlighted, such as email and online purchases. However, the response could be more fully illustrated with data. While an overview is present and relevant, the analysis lacks depth in terms of comparing and contrasting the trends across different age groups, particularly with respect to the 'Information Gathering' and 'Social Networking' categories. Some information is missing, and further extension is needed to achieve a higher band. While the main trends are identified, the support is not always precise and comprehensive.
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>The overview appropriately identifies variations in internet use across age groups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>The essay accurately notes the high usage of email across all age groups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Key trends, like the decline of online gaming with age, are identified.</span>
                  </li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Lacks comprehensive coverage of all key features in the table.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Could be more fully illustrated with specific data points.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>The overview could provide a more nuanced summary of the main trends and relationships.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Missing specific discussion about 'Information Gathering' and 'Social Networking' categories.</span>
                  </li>
                </ul>
              </div>

              {/* Specific Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-600">Specific Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Include specific data points to support each trend identified to enhance the analysis. For example, provide percentages for the 'Social Networking' and 'Information Gathering' categories across different age groups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Expand the overview to include a broader summary of all categories.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Make direct comparisons between age groups for all internet activities.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Include all key features: Information Gathering and Social Networking trends need attention.</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coherence-cohesion" className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              {/* Feedback Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The essay demonstrates strong coherence with logical organization from overview to detailed analysis. Information flows well with appropriate sequencing of ideas. Cohesive devices are used effectively to connect sentences and paragraphs. The structure is clear and easy to follow, making the trends and data relationships accessible to the reader.
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Clear paragraph structure with distinct overview and body paragraphs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Effective use of linking words and phrases to connect ideas smoothly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Logical progression from general trends to specific details.</span>
                  </li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Some transitions between different energy sources could be smoother.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Consider grouping related information more effectively for better flow.</span>
                  </li>
                </ul>
              </div>

              {/* Specific Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-600">Specific Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Use more transitional phrases like "In contrast," "Similarly," "Meanwhile" between energy source discussions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Consider organizing information by grouping increasing vs. decreasing trends for clearer comparisons.</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lexical-resource" className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              {/* Feedback Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The vocabulary demonstrates good range with appropriate use of trend-describing language typical of Task 1 writing. Technical terms related to energy consumption are used accurately. Some variety in vocabulary choices is evident, though there is room for more sophisticated and varied expressions to enhance the overall lexical range.
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Appropriate use of Task 1 vocabulary for describing trends and data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Accurate technical terminology related to energy sources and consumption.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Good use of phrases like "demonstrates," "projected," and "substantial growth."</span>
                  </li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Limited variety in vocabulary for describing trends and changes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Some repetition of basic terms that could be replaced with more sophisticated alternatives.</span>
                  </li>
                </ul>
              </div>

              {/* Vocabulary Enhancement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-600">Vocabulary Enhancement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>'Usage' → 'engagement' or 'participation'</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>'High' → 'significant', 'substantial'</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Use synonyms for 'popular' and 'across' to avoid repetition.</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grammar-accuracy" className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              {/* Feedback Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The essay demonstrates generally good grammatical control with mostly accurate sentence structures. A variety of sentence types is evident, from simple to complex constructions. However, there are some noticeable errors in subject-verb agreement that affect clarity and may impact the overall band score. The range of grammatical structures shows competence but could be more sophisticated.
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Good use of complex sentence structures for data comparison and description.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Appropriate use of past tense forms when describing historical data trends.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Correct use of passive voice in appropriate contexts.</span>
                  </li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Subject-verb agreement errors: "change occur" should be "change occurs."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Plural subject errors: "renewable energy sources is" should be "renewable energy sources are."</span>
                  </li>
                </ul>
              </div>

              {/* Grammar Focus */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-600">Grammar Focus</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Check for subject-verb agreement errors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Review the correct use of articles (a, an, the).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sm">•</span>
                    <span>Pay attention to proper tense usage, especially when describing trends.</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Interactive Essay Analysis Section */}
      <div className="container max-w-[1100px] mx-auto mb-6">
        {createHighlightedEssay()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={onTryAgain} variant="outline" className="px-6">
          <Pen className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button onClick={onNextPractice} className="px-6 bg-primary hover:opacity-90">
          <ArrowRight className="h-4 w-4 mr-2" />
          Next Practice
        </Button>
        <Button variant="outline" className="px-6">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Exit Confirmation Dialog */}
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