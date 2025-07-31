import { useState } from "react";
import { ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getOutline } from "@/data/outlines";
import { getVocabulary } from "@/data/vocabulary";
import { getPhrases } from "@/data/phrases";
import { WritingTestType } from "./test-setup";

interface SupportingResourcesProps {
  testType: WritingTestType;
  topic: string;
}

export async function SupportingResources({ testType, topic }: SupportingResourcesProps) {
  const [showOutline, setShowOutline] = useState(true);
  const [activeTab, setActiveTab] = useState("vocabulary");
  
  const outline = getOutline(testType, topic);
  const vocabulary = await getVocabulary(testType, topic);
  const phrases = getPhrases(testType);
  
  return (
    <div className="mt-6">
      {/* Outline Suggestions */}
      <Card className="mb-3">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-3 bg-gray-50">
          <h3 className="font-medium text-xs">Suggested Outline</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowOutline(!showOutline)}
          >
            <ChevronUp className={`h-3 w-3 ${!showOutline ? "rotate-180" : ""}`} />
          </Button>
        </CardHeader>
        {showOutline ? (
          <CardContent className="py-2 px-3">
            <ul className="space-y-1 text-xs">
              {outline.map((section, index) => (
                <li key={index}>
                  <span className="font-medium">{section.title}:</span>
                  <ul className="pl-3 mt-0.5 space-y-0.5 list-disc">
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        ) : (
          <CardContent className="flex justify-center items-center py-10">
            <div className="text-center text-gray-600">
              <p className="mb-1 font-medium text-xs">Hãy cố gắng hết mình nhé!</p>
              <p className="text-primary text-xs">Good things take time.</p>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Vocabulary and Phrases Tabs */}
      <Card>
        <Tabs 
          defaultValue="vocabulary" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="vocabulary" className="text-sm py-1 font-medium">Vocabulary</TabsTrigger>
            <TabsTrigger value="phrases" className="text-sm py-1 font-medium">Useful Phrases & Collocations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vocabulary" className="p-3">
            <div className="space-y-2 text-xs">
              {vocabulary.map((category, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-800 text-xs">{category.name}</h4>
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    {category.words.map((wordObject, wordIndex) => (
                      <Badge 
                        key={wordIndex} 
                        variant="secondary" 
                        className={`text-xs py-0.5 px-1.5 ${
                          category.type === "positive" 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : category.type === "negative" 
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : category.type === "academic"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                      >
                        {wordObject.word}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="phrases" className="p-3">
            <div className="space-y-3 text-xs">
              {phrases.map((category, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-800 text-xs">{category.name}</h4>
                  <ul className="mt-0.5 space-y-0.5 text-gray-600 pl-3">
                    {category.phrases.map((phrase, phraseIndex) => (
                      <li key={phraseIndex}>{phrase}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
