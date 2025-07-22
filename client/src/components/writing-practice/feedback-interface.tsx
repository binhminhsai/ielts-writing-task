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
import { useState, useEffect } from "react";
import { Link } from "wouter";

// Possible issues in essay
type IssueType = 'error' | 'suggestion' | 'good';

interface SentenceIssue {
  type: IssueType;
  original: string;
  correction?: string;
  reason?: string;
  issueDetail?: string;
}

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

// Feedback data interface
interface FeedbackData {
  task: string;
  criteria_scores: {
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
  };
  overall_assessment: {
    score: number;
    summary: string;
    specific_suggestions: string[];
    vocabulary_enhancement: string[];
    grammar_focus: string[];
    next_steps: string[];
  };
  stats?: {
    totalWords: number;
    completionTime: string;
  };
  grammarFeedback?: GrammarFeedback[];
   highlightedEssay?: string;
}
interface GrammarFeedback {
  id: string;
  type: 'error' | 'suggestion' | 'improvement';
  category: string;
  original: string;
  corrected?: string;
  improved?: string;
  suggested?: string;
  explanation: string;
  severity?: string;
  bandImpact?: string;
  rule?: string;
}

interface FeedbackInterfaceProps {
  essayContent: string;
  onTryAgain: () => void;
  onNextPractice: () => void;
}

export function FeedbackInterface({
  essayContent,
  onTryAgain,
  onNextPractice,
}: FeedbackInterfaceProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
const [completionTime, setCompletionTime] = useState<string>('N/A');
const [isEvaluationLoading, setIsEvaluationLoading] = useState(true);
const [isGrammarLoading, setIsGrammarLoading] = useState(true);
const [grammarLevel, setGrammarLevel] = useState<"Band 6.0" | "Band 6.5" | "Band 7.0" | "VC">("Band 6.5");
const [connectionError, setConnectionError] = useState(false);
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 2;
const [evaluationProgress, setEvaluationProgress] = useState(0);

// Then use it in the body:


  // Example sustainable development essay - 300 words
  const sampleEssay = `In recent years, sustainable development has become one of the most critical issues facing governments worldwide.
While some people argue that economic growth should be the primary focus, others believe environmental protection must take priority.
This essay will examine both perspectives and present my own viewpoint.
On one hand, supporters of economic growth argue that development is essential for improving living standards and reducing poverty.
They believe that industrial expansion create jobs and generate income, which allow people to meet their basic needs.
For example, developing countries like China and India have achieved significant economic progress through manufacturing and industrialization.
These nations has lifted millions of people out of poverty and improved infrastructure substantially.
Moreover, proponents claim that wealthier societies are better equipped to invest in clean technologies and environmental solutions.
On the other hand, environmentalists contend that unchecked economic growth leads to serious ecological problems.
They argue that industrial activities cause pollution, deforestation, and climate change, which threaten the planet's future.
For instance, excessive carbon emissions from factories and vehicles has contributed to global warming and extreme weather events.
Many scientists warn that without immediate action, the environmental damage will be irreversible and affect future generations severely.
Furthermore, they suggest that sustainable practices can actually boost long-term economic benefits through green technologies.
In my opinion, I believe both economic development and environmental protection are equally important for society's well-being.
However, I think governments should prioritize sustainable growth over rapid expansion.
Countries must invest in renewable energy, promote eco-friendly industries, and implement strict environmental regulations.
This approach ensures that economic progress does not compromise the planet's health for future generations.
To conclude, while economic growth remains important for human development, it must be balanced with environmental sustainability.
Only through careful planning and responsible policies can societies achieve prosperity without destroying the natural world that supports all life.`;

  // Enhanced highlighting data - 2 sentences per color type
  const highlightMapping: Record<string, HighlightData> = {
    // Red highlights (errors with tooltips)
    "They believe that industrial expansion create jobs and generate income, which allow people to meet their basic needs.": {
      type: 'red',
      tooltip: {
        category: 'Verb Tense OR Sentence Structure',
        original: 'industrial expansion create jobs and generate income',
        corrected: 'industrial expansion creates jobs and generates income',
        explanation: 'Singular subjects like "industrial expansion" require singular verbs. Use "creates" and "generates" instead of "create" and "generate".',
        rule: 'Singular subjects take singular verbs',
        severity: 'High'
      }
    },
    "These nations has lifted millions of people out of poverty and improved infrastructure substantially.": {
      type: 'red',
      tooltip: {
        category: 'Verb Tense OR Sentence Structure',
        original: 'These nations has lifted',
        corrected: 'These nations have lifted',
        explanation: 'Plural subjects like "These nations" require plural auxiliary verbs. Use "have" instead of "has".',
        rule: 'Plural subjects take plural verbs',
        severity: 'High'
      }
    },
    
    // Yellow highlights (vocabulary enhancement with tooltips)
    "For example, developing countries like China and India have achieved significant economic progress through manufacturing and industrialization.": {
      type: 'yellow',
      tooltip: {
        category: 'Vocabulary Enhancement',
        original: 'achieved significant economic progress',
        improved: 'attained substantial economic advancement',
        explanation: 'Using more sophisticated vocabulary improves the academic tone of the writing.',
        bandImpact: 'Improves Lexical Resource to Band 7+'
      }
    },
    "Many scientists warn that without immediate action, the environmental damage will be irreversible and affect future generations severely.": {
      type: 'yellow',
      tooltip: {
        category: 'Vocabulary Enhancement',
        original: 'environmental damage will be irreversible',
        improved: 'ecological deterioration will be irremediable',
        explanation: 'Academic synonyms enhance the sophistication and precision of environmental vocabulary.',
        bandImpact: 'Improves Lexical Resource to Band 7+'
      }
    },
    
    // Green highlights (good examples with suggestions)
    "In recent years, sustainable development has become one of the most critical issues facing governments worldwide.": {
      type: 'green',
      tooltip: {
        category: 'Introduction Phrasing',
        original: 'In recent years, sustainable development has become',
        improved: 'Over the past decade, sustainable development has emerged as OR In contemporary society, sustainable development represents',
        explanation: 'This opening effectively establishes the topic\'s relevance and timeliness, creating a strong foundation for the essay.',
        bandImpact: 'Improves Task Response and Coherence/Cohesion'
      }
    },
    "Only through careful planning and responsible policies can societies achieve prosperity without destroying the natural world that supports all life.": {
      type: 'green',
      tooltip: {
        category: 'Conclusion Phrasing',
        original: 'Only through careful planning and responsible policies',
        improved: 'Through strategic planning and accountable governance OR Via comprehensive planning and sustainable policies',
        explanation: 'This conclusion effectively synthesizes the main arguments while providing a clear recommendation for future action.',
        bandImpact: 'Improves Task Response and Coherence/Cohesion'
      }
    }
  };

const handleStartWriting = () => {
  setStartTime(new Date());
};

// When calculating completion time
const calculateCompletionTime = () => {
  if (!startTime) return 'N/A';
  const endTime = new Date();
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const timeStr = `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
  setCompletionTime(timeStr);
  return timeStr;
};
useEffect(() => {
  // Track mounted state to prevent state updates after unmount
  let isMounted = true;
  let controller: AbortController | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  const evaluateEssay = async (attempt = 0) => {
    const cachedFeedback = sessionStorage.getItem(`feedback-${essayContent}`);
    if (cachedFeedback) {
    setFeedbackData(JSON.parse(cachedFeedback));
    setIsLoading(false);
    return;
  }
    try {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller?.abort();
        console.log('Request timed out after 180 seconds');
      }, 180000);

      if (isMounted) {
        setIsLoading(true);
        setError(null);
        setConnectionError(false);
        setEvaluationProgress(10); // Initial progress
      }

      // Update progress when starting evaluation
      setEvaluationProgress(30);

      const [evaluationResponse, grammarResponse] = await Promise.all([
        fetch('https://agentwp-api.aihubproduction.com/evaluate-essay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: "IELTS Writing Task 2 Prompt", 
            essay: essayContent 
          }),
          signal: controller.signal
        }).then(async (res) => {
          setEvaluationProgress(50); // Progress when evaluation request completes
          return res;
        }).catch(err => {
          if (err.name === 'AbortError') {
            throw new Error('Evaluation request timed out');
          }
          throw err;
        }),
        fetch('https://agentwp-api.aihubproduction.com/check-grammar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            essay: essayContent, 
            level: grammarLevel 
          }),
          signal: controller.signal
        }).then(async (res) => {
          setEvaluationProgress(70); // Progress when grammar check completes
          return res;
        }).catch(err => {
          if (err.name === 'AbortError') {
            throw new Error('Grammar check request timed out');
          }
          throw err;
        })
      ]);

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Only proceed if component is still mounted
      if (!isMounted) return;

      // Check response statuses
      if (!evaluationResponse.ok || !grammarResponse.ok) {
        throw new Error(`HTTP error! Evaluation: ${evaluationResponse.status}, Grammar: ${grammarResponse.status}`);
      }

      setEvaluationProgress(80); // Progress before processing responses

      const [evaluationResult, grammarResult] = await Promise.all([
        evaluationResponse.json().catch(() => ({ success: false })),
        grammarResponse.json().catch(() => ({ success: false }))
      ]);

      // Process responses
      const evaluationSuccess = evaluationResult?.success;
      const grammarSuccess = grammarResult?.success;

      const feedback = evaluationSuccess 
        ? evaluationResult.data?.data || getSampleFeedbackData(essayContent)
        : getSampleFeedbackData(essayContent);

      // Handle grammar feedback from backend
      if (grammarSuccess && grammarResult.data?.feedback_items) {
        feedback.grammarFeedback = Array.isArray(grammarResult.data.feedback_items)
          ? grammarResult.data.feedback_items
          : [];
      }

      // Add highlighted essay if available
      if (grammarResult.data?.highlighted_essay) {
        feedback.highlightedEssay = grammarResult.data.highlighted_essay;
      }

      // Add stats
      feedback.stats = {
        totalWords: essayContent.split(/\s+/).filter(Boolean).length,
        completionTime: calculateCompletionTime() || 'N/A'
      };

      if (isMounted) {
        setFeedbackData(feedback);
        setEvaluationProgress(100); // Complete
      }
    } catch (err) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Only handle errors if component is still mounted
      if (!isMounted) return;

      console.error('Evaluation error:', err);
       if (feedbackData) {
    sessionStorage.setItem(`feedback-${essayContent}`, JSON.stringify(feedbackData));
  }
      let errorMessage = 'Evaluation failed';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
          // Retry logic
          if (attempt >= MAX_RETRIES) {
      errorMessage += ' Please try again later or check your internet connection.';
    }
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setConnectionError(true);
      setEvaluationProgress(0); // Reset progress on error

      // Fallback to sample data
      const sampleData = getSampleFeedbackData(essayContent);
      sampleData.stats = {
        totalWords: essayContent.split(/\s+/).filter(Boolean).length,
        completionTime: 'N/A'
      };
      setFeedbackData(sampleData);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  evaluateEssay(0); // Start with attempt 0

  // Cleanup function
  return () => {
    isMounted = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (controller) {
      controller.abort();
    }
  };
  
}, [essayContent, grammarLevel, retryCount]);



function isGrammarFeedback(data: any): data is GrammarFeedback[] {
  if (!Array.isArray(data)) return false;
  
  // Check if at least one item has the required fields
  return data.some(item => 
    item && 
    typeof item === 'object' &&
    'original' in item &&
    'explanation' in item
  );
}



  const getSampleFeedbackData = (essay: string): FeedbackData => {
    const wordCount = essay.split(/\s+/).filter(Boolean).length || 0;
    
    return {
      task: "IELTS Writing Task 2",
      criteria_scores: {
        "Task Achievement": {
          score: 7.0,
          feedback: "The essay addresses all parts of the prompt, discussing both views and providing a clear opinion. The arguments for both sides are relevant and supported with valid points and examples.",
          strengths: [
            "Strong introduction that clearly presents both viewpoints",
            "Good use of topic sentences and paragraph structure"
          ],
          areas_for_improvement: [
            "Some examples could be more specific and developed",
            "A few grammar errors in complex sentences"
          ],
          specific_suggestions: [
            "Provide more concrete examples to support arguments",
            "Ensure all examples directly relate to the main points"
          ]
        },
        "Coherence and Cohesion": {
          score: 7.0,
          feedback: "The essay presents information and ideas logically with a clear progression. A range of cohesive devices are used appropriately.",
          strengths: [
            "Uses appropriate cohesive devices to connect ideas",
            "Ideas progress logically from one viewpoint to the next"
          ],
          areas_for_improvement: [
            "Ensure clear paragraph breaks to separate different ideas"
          ],
          specific_suggestions: [
            "Use more transitional phrases between paragraphs"
          ]
        },
        "Lexical Resource": {
          score: 7.0,
          feedback: "The essay demonstrates a good range of vocabulary used flexibly and accurately. There is a sufficient range of less common lexical items.",
          strengths: [
            "Uses a good range of topic-specific vocabulary accurately",
            "Includes less common lexical items effectively"
          ],
          areas_for_improvement: [
            "Consider incorporating a wider range of sophisticated synonyms"
          ],
          vocabulary_enhancement: [
            "Consider expanding your vocabulary range for academic contexts",
            "Use more sophisticated synonyms to avoid repetition"
          ]
        },
        "Grammatical Range and Accuracy": {
          score: 7.0,
          feedback: "The essay uses a good range of complex sentence structures with a high level of accuracy. There are very few grammatical errors, and punctuation is generally correct.",
          strengths: [
            "Demonstrates consistent control over complex sentence structures",
            "High level of grammatical accuracy with very few errors"
          ],
          areas_for_improvement: [
            "Continue practicing varied sentence structures"
          ],
          grammar_focus: [
            "Continue to practice using a variety of complex sentence structures",
            "Ensure consistent use of parallel structures when listing items"
          ]
        }
      },
      overall_assessment: {
        score: 7.0,
        summary: "Overall, this is a strong essay that demonstrates good control of the English language and meets the requirements for a Band 7 score. The arguments are well-developed and supported, though some areas could benefit from more detailed examples and slightly more sophisticated vocabulary.",
        specific_suggestions: [
          "Master Paragraphing: Practice writing essays with clear paragraph structure",
          "Essay Structure Drills: Outline your paragraph structure before writing"
        ],
        vocabulary_enhancement: [
          "Review academic vocabulary lists for common IELTS topics"
        ],
        grammar_focus: [
          "Practice complex sentence structures with clauses"
        ],
        next_steps: [
          "Review Band Descriptors: Pay attention to scoring criteria",
          "Timed practice essays to improve speed and accuracy"
        ]
      }
    };
  };

  // Helper function to highlight sentences with multi-color system
  const highlightEssay = (text: string) => {
  // First check if we have pre-highlighted HTML from the backend
  if (feedbackData?.highlightedEssay) {
    return (
      <div 
        className="highlight-section bg-[#fdfdfd] border border-gray-300 rounded-lg p-6" 
        dangerouslySetInnerHTML={{ __html: feedbackData.highlightedEssay }}
      />
    );
  }

  // Early return with message if no content to analyze
  if (!text) {
    return (
      <div className="highlight-section bg-[#fdfdfd] border border-gray-300 rounded-lg p-6">
        <div className="text-gray-500 text-center">No essay content to analyze</div>
      </div>
    );
  }

  // Early return if no grammar feedback available
  if (!feedbackData?.grammarFeedback) {
    return (
      <div className="highlight-section bg-[#fdfdfd] border border-gray-300 rounded-lg p-6">
        <div className="text-gray-500 text-center">Grammar analysis not available</div>
      </div>
    );
  }

  // Create a more robust mapping from the API grammar feedback
  const apiHighlightMapping: Record<string, HighlightData> = {};

  feedbackData.grammarFeedback.forEach(item => {
    if (!item.original) return; // Skip if no original text

    const type: HighlightType = 
      item.type === 'error' ? 'red' :
      item.type === 'suggestion' ? 'green' : 'yellow';

    // Normalize the key by trimming and standardizing whitespace
    const normalizedKey = item.original.trim().replace(/\s+/g, ' ');

    apiHighlightMapping[normalizedKey] = {
      type,
      tooltip: {
        category: item.category || 'Grammar',
        original: item.original,
        corrected: item.corrected || '',
        improved: item.improved || item.suggested || '',
        explanation: item.explanation || 'No explanation provided',
        severity: item.severity || 'Medium',
        bandImpact: item.bandImpact || 'Possible impact on score',
        rule: item.rule || ''
      }
    };
  });

  // Split text into sentences with better handling of edge cases
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const result: JSX.Element[] = [];

  // Color configuration object for cleaner code
  const colorConfig = {
    red: {
      className: "inline cursor-pointer hover:opacity-80 transition-opacity px-1 rounded",
      bgColor: "bg-[#ffcdd2] text-[#c62828]"
    },
    yellow: {
      className: "inline cursor-pointer hover:opacity-80 transition-opacity px-1 rounded",
      bgColor: "bg-[#fef9c3] text-[#92400e]"
    },
    green: {
      className: "inline cursor-pointer hover:opacity-80 transition-opacity px-1 rounded",
      bgColor: "bg-[#dcfce7] text-[#166534]"
    }
  };

  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    const normalizedSentence = trimmedSentence.replace(/\s+/g, ' ');
    
    // Find matching highlight data with fallback to partial matches
    const highlightData = apiHighlightMapping[normalizedSentence] || 
      Object.entries(apiHighlightMapping).find(([key]) => 
        normalizedSentence.includes(key) || key.includes(normalizedSentence)
      )?.[1];

    if (highlightData) {
      const { className, bgColor } = colorConfig[highlightData.type] || colorConfig.yellow;

      // Only show tooltip if we have content to show
      const showTooltip = highlightData.tooltip && 
        (highlightData.tooltip.corrected || 
         highlightData.tooltip.improved || 
         highlightData.tooltip.explanation);

      if (showTooltip) {
        const tooltipContent = (
          <div className="max-w-sm space-y-3">
            {highlightData.tooltip?.category && (
              <div>
                <div className="font-semibold text-sm mb-1 text-yellow-400">Category:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.category}</div>
              </div>
            )}
            <div>
              <div className="font-semibold text-sm mb-1 text-red-400">Original:</div>
              <div className="text-xs text-gray-200">{highlightData.tooltip?.original}</div>
            </div>
            {highlightData.type === 'red' && highlightData.tooltip?.corrected && (
              <div>
                <div className="font-semibold text-sm mb-1 text-green-400">Corrected:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.corrected}</div>
              </div>
            )}
            {(highlightData.type === 'yellow' || highlightData.type === 'green') && highlightData.tooltip?.improved && (
              <div>
                <div className="font-semibold text-sm mb-1 text-green-400">
                  {highlightData.type === 'green' ? 'Suggested:' : 'Improved:'}
                </div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.improved}</div>
              </div>
            )}
            {highlightData.tooltip?.explanation && (
              <div>
                <div className="font-semibold text-sm mb-1 text-blue-400">Explanation:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.explanation}</div>
              </div>
            )}
            {highlightData.tooltip?.rule && (
              <div>
                <div className="font-semibold text-sm mb-1 text-purple-400">Rule:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.rule}</div>
              </div>
            )}
            {highlightData.tooltip?.severity && (
              <div>
                <div className="font-semibold text-sm mb-1 text-orange-400">Severity:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.severity}</div>
              </div>
            )}
            {highlightData.tooltip?.bandImpact && (
              <div>
                <div className="font-semibold text-sm mb-1 text-purple-400">Band Impact:</div>
                <div className="text-xs text-gray-200">{highlightData.tooltip.bandImpact}</div>
              </div>
            )}
          </div>
        );

        result.push(
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <span className={`${className} ${bgColor}`}>
                {sentence}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-800 text-white p-4 max-w-md">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        );
      } else {
        result.push(
          <span key={index} className={`${className} ${bgColor}`}>
            {sentence}
          </span>
        );
      }
    } else {
      result.push(<span key={index}>{sentence}</span>);
    }

    // Add space after sentence if not last
    if (index < sentences.length - 1) {
      result.push(<span key={`space-${index}`}> </span>);
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
{isLoading && (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-600">
      <span>Evaluating your essay...</span>
      <span>{evaluationProgress}%</span>
    </div>
    <Progress value={evaluationProgress} className="h-2" />
    {evaluationProgress > 50 && (
      <p className="text-xs text-gray-500">
        This is taking longer than usual. Please wait...
      </p>
    )}
  </div>
)}
  // Add loading and error states
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Evaluating your essay...</p>
      </div>
    );
  }

{error && (
  <div className="p-6 space-y-4">
    <div className="flex items-center gap-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div>
        <h3 className="text-lg font-medium">Evaluation Issue</h3>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">What you can do:</h4>
      <ul className="space-y-1 text-sm text-blue-700">
        <li>• Check your internet connection</li>
        <li>• Try again in a few minutes</li>
        <li>• Review the sample evaluation below</li>
        {connectionError && (
          <li>• Contact support if the problem persists</li>
        )}
      </ul>
    </div>
    <Button onClick={() => setRetryCount(prev => prev + 1)}>
      Try Again
    </Button>
  </div>
)}

  if (!feedbackData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg">No evaluation data available</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-semibold mb-2">Your essay has been evaluated based on the IELTS Task 2 criteria!</h2>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-[1100px] mx-auto">
        {/* Left Column */}
        <div className="column flex flex-col gap-4">
            {/* Overall Band Score */}

            {/* Score Breakdown */}
            <div className="box bg-[#FAFAFA] rounded-lg border border-black p-3 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-3">Score Breakdown</h2>

      <div className="flex flex-col justify-between flex-1 gap-3">
        {/* Task Response */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Task Response</span>
            <span className="text-[#44b9b0] font-bold">
              {feedbackData?.criteria_scores?.["Task Achievement"]?.score?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[18px]">
            <div 
              className="bg-[#44b9b0] h-[18px] rounded-full" 
              style={{ 
                width: `${getScorePercentage(
                  feedbackData?.criteria_scores?.["Task Achievement"]?.score || 0
                )}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Coherence & Cohesion */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Coherence & Cohesion</span>
            <span className="text-[#44b9b0] font-bold">
              {feedbackData?.criteria_scores?.["Coherence and Cohesion"]?.score?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[18px]">
            <div 
              className="bg-[#44b9b0] h-[18px] rounded-full" 
              style={{ 
                width: `${getScorePercentage(
                  feedbackData?.criteria_scores?.["Coherence and Cohesion"]?.score || 0
                )}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Lexical Resource */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Lexical Resource</span>
            <span className="text-[#44b9b0] font-bold">
              {feedbackData?.criteria_scores?.["Lexical Resource"]?.score?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[18px]">
            <div 
              className="bg-[#44b9b0] h-[18px] rounded-full" 
              style={{ 
                width: `${getScorePercentage(
                  feedbackData?.criteria_scores?.["Lexical Resource"]?.score || 0
                )}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Grammatical Range & Accuracy */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Grammatical Range & Accuracy</span>
            <span className="text-[#44b9b0] font-bold">
              {feedbackData?.criteria_scores?.["Grammatical Range and Accuracy"]?.score?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[18px]">
            <div 
              className="bg-[#44b9b0] h-[18px] rounded-full" 
              style={{ 
                width: `${getScorePercentage(
                  feedbackData?.criteria_scores?.["Grammatical Range and Accuracy"]?.score || 0
                )}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Overall Band Score</span>
          <span className="text-[#44b9b0] text-4xl font-extrabold">
            {feedbackData?.overall_assessment?.score?.toFixed(1) || '0.0'}
          </span>
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
                        {feedbackData?.overall_assessment?.summary || 'No summary available'}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="specific-suggestions" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-orange-50 to-transparent hover:from-orange-100">
                      <span className="text-gray-800">Specific Suggestions</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <ul className="text-gray-700 leading-relaxed space-y-1 text-sm">
                        {feedbackData.overall_assessment.specific_suggestions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vocabulary-enhancement" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-purple-50 to-transparent hover:from-purple-100">
                      <span className="text-gray-800">Vocabulary Enhancement</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <ul className="text-gray-700 leading-relaxed space-y-1 text-sm">
                        {feedbackData.overall_assessment.vocabulary_enhancement.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="grammar-focus" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-indigo-50 to-transparent hover:from-indigo-100">
                      <span className="text-gray-800">Grammar Focus</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <ul className="text-gray-700 leading-relaxed space-y-1 text-sm">
                        {feedbackData.overall_assessment.grammar_focus.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="next-steps" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 hover:no-underline bg-gradient-to-r from-green-50 to-transparent hover:from-green-100">
                      <span className="text-gray-800">Next Steps</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-3 bg-white">
                      <ul className="text-gray-700 leading-relaxed space-y-1 text-sm">
                        {feedbackData.overall_assessment.next_steps.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                  <div className={`stat-value font-bold text-2xl mt-1 ${feedbackData.stats?.totalWords && feedbackData.stats.totalWords < 250 ? 'text-red-500' : ''}`}>
                    {feedbackData.stats?.totalWords || 0}
                  </div>
                </div>
                <div className="text-center">
  <div className="stat-label font-bold">Completion Time</div>
  <div className="stat-value font-bold text-2xl mt-1">
    {feedbackData.stats?.completionTime || completionTime}
  </div>
</div>
              </div>
            </div>
        </div>
      </div>

      {/* Detailed Feedback Section */}
      <div className="container max-w-[1100px] mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>
        
        <Tabs defaultValue="task-response" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-white border border-gray-300 rounded-lg h-12 p-1">
            <TabsTrigger 
              value="task-response" 
              className="data-[state=active]:bg-[#64c4bc] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 font-medium text-sm"
            >
              Task Response
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

          <TabsContent value="task-response" className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              {/* Feedback Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {feedbackData.criteria_scores["Task Achievement"].feedback}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Task Achievement"].strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Task Achievement"].areas_for_improvement.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
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
                  {feedbackData.criteria_scores["Coherence and Cohesion"].feedback}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Coherence and Cohesion"].strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Coherence and Cohesion"].areas_for_improvement.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
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
                  {feedbackData.criteria_scores["Lexical Resource"].feedback}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Lexical Resource"].strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Lexical Resource"].areas_for_improvement.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
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
                  {feedbackData.criteria_scores["Grammatical Range and Accuracy"].feedback}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Grammatical Range and Accuracy"].strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-600">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {feedbackData.criteria_scores["Grammatical Range and Accuracy"].areas_for_improvement.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Grammar Checker Section */}
      <div className="container max-w-[1100px] mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-4">Grammar Checker</h2>
        {highlightEssay(essayContent || sampleEssay)}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          variant="outline" 
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" /> Download Feedback
        </Button>

        <Button 
          variant="secondary"
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={onTryAgain}
        >
          <Pen className="mr-2 h-4 w-4" /> Try Again
        </Button>

        <Button 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={onNextPractice}
        >
          <ArrowRight className="mr-2 h-4 w-4" /> Next Practice
        </Button>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát khỏi phần đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thoát khỏi phần đánh giá bài viết và quay lại trang thiết lập bài tập không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục xem đánh giá</AlertDialogCancel>
            <Link href="/writing-practice">
              <AlertDialogAction>
                Thoát
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </TooltipProvider>
  );
}