import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Search, Settings, Star, BookOpen, Users, Plus, Edit, Volume2, X, ChevronDown, Minus, Check, ChevronsUpDown } from "lucide-react";
import closeIcon from "@assets/close_1750834202412.png";
import leftArrowIcon from "@assets/left-arrow_1750231743172.png";
import rightArrowIcon from "@assets/right-arrow_1750231743193.png";
import type { VocabularyCard, VocabularyWord } from "@shared/schema";

export default function WordcraftWords() {
  const { cardId } = useParams<{ cardId: string }>();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Check URL params for initial view mode
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialViewMode = urlParams.get('view') === 'detail' ? 'detail' : 'list';
  
  const [viewMode, setViewMode] = useState<"list" | "detail">(initialViewMode);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("images");
  const [wordImages, setWordImages] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Editable content state
  const [editableDefinitions, setEditableDefinitions] = useState([
    {
      title: "Định nghĩa 1:",
      definition: "The ability to recover quickly from difficulties; toughness",
      vietnamese: "Khả năng phục hồi nhanh chóng từ khó khăn; sức bền",
      examples: [
        {
          english: "She showed great resilience in overcoming the challenges at work.",
          vietnamese: "Cô ấy đã thể hiện khả năng phục hồi tuyệt vời trong việc vượt qua những thử thách tại nơi làm việc."
        },
        {
          english: "The company's resilience helped it survive the economic downturn.",
          vietnamese: "Khả năng phục hồi của công ty đã giúp nó tồn tại qua cuộc suy thoái kinh tế."
        },
        {
          english: "Building emotional resilience is crucial for mental health.",
          vietnamese: "Xây dựng khả năng phục hồi cảm xúc là rất quan trọng cho sức khỏe tâm thần."
        }
      ]
    },
    {
      title: "Định nghĩa 2:",
      definition: "The ability of a material to return to its original shape after being bent or stretched",
      vietnamese: "Khả năng của vật liệu trở lại hình dạng ban đầu sau khi bị uốn cong hoặc kéo giãn",
      examples: [
        {
          english: "The rubber ball demonstrated excellent resilience when it bounced back perfectly.",
          vietnamese: "Quả bóng cao su thể hiện độ đàn hồi tuyệt vời khi nó nảy trở lại hoàn hảo."
        },
        {
          english: "The bridge's design incorporates materials with high resilience to withstand earthquakes.",
          vietnamese: "Thiết kế cây cầu kết hợp các vật liệu có độ đàn hồi cao để chịu được động đất."
        }
      ]
    }
  ]);
  
  const [editablePhrases, setEditablePhrases] = useState([
    {
      phrase: "Show resilience",
      vietnamese: "Thể hiện sự kiên cường",
      example: "The team showed remarkable resilience during the crisis.",
      exampleVietnamese: "Nhóm đã thể hiện sự kiên cường đáng chú ý trong suốt cuộc khủng hoảng."
    },
    {
      phrase: "Build resilience",
      vietnamese: "Xây dựng khả năng phục hồi",
      example: "Regular exercise helps build physical and mental resilience.",
      exampleVietnamese: "Tập thể dục thường xuyên giúp xây dựng khả năng phục hồi về thể chất và tinh thần."
    },
    {
      phrase: "Emotional resilience",
      vietnamese: "Sự kiên cường về cảm xúc",
      example: "Developing emotional resilience is key to handling stress effectively.",
      exampleVietnamese: "Phát triển sự kiên cường về cảm xúc là chìa khóa để xử lý căng thẳng một cách hiệu quả."
    },
    {
      phrase: "Physical resilience",
      vietnamese: "Sự bền bỉ về thể chất",
      example: "Athletes train to improve their physical resilience and endurance.",
      exampleVietnamese: "Các vận động viên tập luyện để cải thiện sự bền bỉ về thể chất và sức bền."
    },
    {
      phrase: "Develop resilience",
      vietnamese: "Phát triển khả năng chống chịu",
      example: "Children develop resilience through facing and overcoming challenges.",
      exampleVietnamese: "Trẻ em phát triển khả năng chống chịu thông qua việc đối mặt và vượt qua thử thách."
    }
  ]);
  
  const [editableSynonyms, setEditableSynonyms] = useState([
    { word: "toughness", example: "The toughness of the material made it perfect for construction" },
    { word: "strength", example: "Her mental strength helped her overcome challenges" },
    { word: "endurance", example: "Marathon runners need great endurance" },
    { word: "durability", example: "The phone's durability impressed all users" },
    { word: "flexibility", example: "Mental flexibility is key to problem-solving" }
  ]);
  
  const [editableAntonyms, setEditableAntonyms] = useState([
    { word: "fragility", example: "The glass showed its fragility when it broke easily" },
    { word: "weakness", example: "His weakness became apparent under pressure" },
    { word: "vulnerability", example: "The system's vulnerability was exposed by hackers" },
    { word: "brittleness", example: "The old wood's brittleness made it unsafe" }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCardValue, setSelectedCardValue] = useState<string>("");
  const [searchCardValue, setSearchCardValue] = useState<string>("");
  const [isCardSelectOpen, setIsCardSelectOpen] = useState<boolean>(false);
  
  // Vocabulary entries for accordion-style popup
  const [vocabEntries, setVocabEntries] = useState([
    { id: 1, word: "", content: "", isExpanded: false }
  ]);
  
  const queryClient = useQueryClient();

  const resetVocabForm = () => {
    setVocabEntries([{ id: 1, word: "", content: "", isExpanded: false }]);
  };

  const addVocabEntry = () => {
    const newId = Math.max(...vocabEntries.map(e => e.id)) + 1;
    setVocabEntries([...vocabEntries, { id: newId, word: "", content: "", isExpanded: false }]);
  };

  const removeVocabEntry = (id: number) => {
    if (vocabEntries.length > 1) {
      setVocabEntries(vocabEntries.filter(entry => entry.id !== id));
    }
  };

  const updateVocabEntry = (id: number, field: string, value: string) => {
    setVocabEntries(vocabEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const toggleVocabExpansion = (id: number) => {
    setVocabEntries(vocabEntries.map(entry => 
      entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
    ));
  };

  const resetForm = () => {
    resetVocabForm();
    setSelectedCardValue("");
    setSearchCardValue("");
  };

  // Game state for quiz
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Sample quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "The use of _____ technologies helps ensure sustainable development for future generations.",
      options: [
        { value: "A", text: "renewable" },
        { value: "B", text: "harmful" },
        { value: "C", text: "wasteful" },
        { value: "D", text: "outdated" }
      ],
      correctAnswer: "A",
      explanation: "Renewable technologies như năng lượng mặt trời, gió giúp phát triển bền vững."
    },
    {
      id: 2,
      question: "Companies must adopt _____ practices to contribute to sustainable business models.",
      options: [
        { value: "A", text: "destructive" },
        { value: "B", text: "eco-friendly" },
        { value: "C", text: "polluting" },
        { value: "D", text: "wasteful" }
      ],
      correctAnswer: "B",
      explanation: "Eco-friendly practices (thân thiện với môi trường) giúp doanh nghiệp phát triển bền vững."
    },
    {
      id: 3,
      question: "Sustainable agriculture focuses on _____ farming methods that protect the environment.",
      options: [
        { value: "A", text: "chemical-intensive" },
        { value: "B", text: "organic" },
        { value: "C", text: "harmful" },
        { value: "D", text: "toxic" }
      ],
      correctAnswer: "B",
      explanation: "Organic farming (nông nghiệp hữu cơ) bảo vệ môi trường và phát triển bền vững."
    }
  ];

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      // Reset to first question
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };



  const { data: card, isLoading: cardLoading } = useQuery<VocabularyCard>({
    queryKey: [`/api/vocabulary-cards/${cardId}`],
    enabled: !!cardId,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (isFavorited: boolean) => {
      return await apiRequest("PATCH", `/api/vocabulary-cards/${cardId}/favorite`, { isFavorited });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vocabulary-cards/${cardId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary-cards"] });
    }
  });

  const addWordMutation = useMutation({
    mutationFn: async (wordEntries: any[]) => {
      const promises = wordEntries.map(entry => 
        apiRequest("POST", "/api/vocabulary-words", {
          word: entry.word,
          definition: entry.content || "",
          vietnamese: "",
          example: "",
          exampleVietnamese: "",
          pronunciation: "",
          partOfSpeech: "N",
          cardId: parseInt(cardId!)
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vocabulary-cards/${cardId}/words`] });
      queryClient.invalidateQueries({ queryKey: [`/api/vocabulary-cards/${cardId}`] });
      setIsAddDialogOpen(false);
      resetForm();
    }
  });

  const handleFavoriteToggle = () => {
    const newFavoriteState = !card?.isFavorited;
    favoriteMutation.mutate(newFavoriteState);
  };

  const handleAddVocab = () => {
    const validEntries = vocabEntries.filter(entry => entry.word.trim());
    if (validEntries.length === 0) return;
    
    addWordMutation.mutate(validEntries);
  };

  const { data: words = [], isLoading: wordsLoading } = useQuery<VocabularyWord[]>({
    queryKey: [`/api/vocabulary-cards/${cardId}/words`],
    enabled: !!cardId,
  });

  // Query for all vocabulary cards for the dropdown
  const { data: allCards = [] } = useQuery<VocabularyCard[]>({
    queryKey: ["/api/vocabulary-cards"],
  });

  const getSelectedCardLabel = () => {
    if (!selectedCardValue) return "Chưa chọn bộ thẻ";
    if (selectedCardValue === "new") return "Bộ thẻ mới";
    const selectedCard = allCards.find(card => card.id.toString() === selectedCardValue);
    return selectedCard ? selectedCard.title : "Chưa chọn bộ thẻ";
  };

  const filteredCards = allCards.filter(card =>
    card.title.toLowerCase().includes(searchCardValue.toLowerCase())
  );

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentWord = filteredWords[currentWordIndex];

  const navigateToWord = (direction: "prev" | "next") => {
    if (direction === "prev" && currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    } else if (direction === "next" && currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handleDetailViewClick = () => {
    if (filteredWords.length > 0) {
      setViewMode("detail");
      setCurrentWordIndex(0);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const getPartOfSpeechColor = (partOfSpeech: string) => {
    const colors: { [key: string]: string } = {
      "N": "bg-blue-100 text-blue-800 border-blue-200",
      "V": "bg-green-100 text-green-800 border-green-200",
      "Adj": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Adv": "bg-purple-100 text-purple-800 border-purple-200",
      "Prep": "bg-pink-100 text-pink-800 border-pink-200",
      "Conj": "bg-gray-100 text-gray-800 border-gray-200",
      "Phrase": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[partOfSpeech] || colors["N"];
  };

  if (cardLoading || wordsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-3">
        {/* Header - Back Button */}
        <div className="mb-4">
          <Link href="/wordcraft">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Card Info Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            {/* Card Title and Star */}
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">{card?.title || "Tên bộ thẻ"}</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-yellow-500 p-1"
                onClick={handleFavoriteToggle}
                disabled={favoriteMutation.isPending}
              >
                <Star className={`h-5 w-5 ${card?.isFavorited ? 'text-yellow-500 fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
            {card?.description || "Mô tả bộ thẻ sẽ được cập nhật sau"}
          </p>
          
          {/* Info Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Topic */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Chủ đề:</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {card?.category || "Business"}
                </Badge>
              </div>
              
              {/* Word Count */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Số từ:</span>
                <span className="font-medium text-gray-900">{filteredWords.length} từ vựng</span>
              </div>
            </div>
            
            {/* Study Count */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Đã học:</span>
              <span className="font-medium text-gray-900">{card?.studyCount || 4} lần</span>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        {viewMode === "list" && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-9"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="h-3 w-3 mr-1" />
                Tìm
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDetailViewClick}
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 h-9 text-sm px-3"
                disabled={filteredWords.length === 0}
              >
                Xem chi tiết
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                if (!addWordMutation.isPending) {
                  setIsAddDialogOpen(open);
                  if (open) {
                    resetForm();
                  }
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-9 text-sm px-3">
                    <Plus className="h-4 w-4 mr-1" />
                  <DialogTitle className="sr-only">Thêm từ vựng</DialogTitle>
                  <DialogDescription className="sr-only">Thêm từ vựng mới vào bộ thẻ học tập</DialogDescription>
                    Thêm từ vựng
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0"
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => {
                    if (!addWordMutation.isPending) {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }
                  }}
                >
                  {/* Header - Fixed */}
                  <div className="flex items-center justify-center relative p-4 border-b border-gray-200 bg-white flex-shrink-0 pt-[4px] pb-[4px]">
                    <DialogTitle className="text-lg font-semibold text-gray-900">Thêm từ vựng</DialogTitle>
                    <DialogDescription className="sr-only">Thêm từ vựng mới vào bộ thẻ học tập</DialogDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => {
                        if (!addWordMutation.isPending) {
                          setIsAddDialogOpen(false);
                          resetForm();
                        }
                      }}
                    >
                      <img src={closeIcon} alt="Close" className="h-4 w-4" />
                    </Button>
                  </div>

                  {addWordMutation.isPending ? (
                    /* Loading State */
                    (<div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                      <p className="text-emerald-700 font-medium">Đang thêm từ vựng...</p>
                      <p className="text-emerald-600 text-sm">
                        {Math.round((100 / vocabEntries.filter(e => e.word.trim()).length) * 50)}%
                      </p>
                    </div>)
                  ) : (
                    <>
                      {/* Content - Scrollable */}
                      <div className="flex-1 overflow-y-auto p-3">
                        <div className="space-y-2">
                          {vocabEntries.map((entry, index) => (
                            <div key={entry.id} className="flex items-start gap-2">
                              {/* Sequence number outside card - left */}
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium mt-2 flex-shrink-0 shadow-sm">
                                {index + 1}
                              </span>
                              
                              {/* Card content */}
                              <div className="flex-1 border border-emerald-200 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50">
                                <div className="p-0">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="block text-xs font-medium text-emerald-700">
                                        Từ vựng <span className="text-red-500">*</span>
                                      </label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center gap-1 h-5 px-1 hover:bg-emerald-100 flex-shrink-0"
                                        onClick={() => toggleVocabExpansion(entry.id)}
                                      >
                                        <span className="text-xs text-emerald-600">Thêm nội dung</span>
                                        {entry.isExpanded ? (
                                          <div className="h-3 w-3 bg-emerald-600" style={{
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                          }}></div>
                                        ) : (
                                          <div className="h-3 w-3 bg-emerald-600" style={{
                                            clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)'
                                          }}></div>
                                        )}
                                      </Button>
                                    </div>
                                    <Input
                                      value={entry.word}
                                      onChange={(e) => updateVocabEntry(entry.id, "word", e.target.value)}
                                      placeholder="Nhập từ vựng ở đây (Ví dụ: illuminate)"
                                      className="bg-white h-8 text-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
                                    />
                                  </div>

                                  {/* Expanded Content */}
                                  {entry.isExpanded && (
                                    <div className="mt-3">
                                      <label className="block text-xs font-medium text-emerald-700 mb-2">
                                        Nội dung
                                      </label>
                                      <Textarea
                                        value={entry.content}
                                        onChange={(e) => updateVocabEntry(entry.id, "content", e.target.value)}
                                        placeholder="Nhập nội dung liên quan đến từ vựng ở đây như định nghĩa, ví dụ,...."
                                        rows={3}
                                        className="bg-white text-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Delete button outside card - right */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full mt-2 flex-shrink-0"
                                onClick={() => removeVocabEntry(entry.id)}
                                disabled={vocabEntries.length === 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Add Word Button */}
                        <Button
                          variant="outline"
                          onClick={addVocabEntry}
                          className="w-auto flex items-center gap-2 border-dashed border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 h-8 text-sm transition-colors mt-2"
                        >
                          <Plus className="h-3 w-3" />
                          Thêm từ
                        </Button>
                      </div>

                      {/* Footer - Fixed */}
                      <div className="border-t border-emerald-200 p-3 flex-shrink-0 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-end justify-between">
                          {/* Card Selection - Left */}
                          <div>
                            <label className="block text-xs font-medium text-emerald-700 mb-1">
                              Bộ thẻ <span className="text-red-500">*</span>
                            </label>
                            <Button
                              variant="outline"
                              disabled
                              className="w-[200px] justify-start h-8 text-sm border-2 border-emerald-400 bg-emerald-100 text-emerald-900 font-semibold cursor-not-allowed opacity-90"
                            >
                              {card?.title || "Đang tải..."}
                            </Button>
                          </div>

                          {/* Word Count - Center */}
                          <div className="text-xs text-emerald-700 font-medium self-end pb-1">
                            Số từ: {vocabEntries.filter(entry => entry.word.trim()).length} từ
                          </div>

                          {/* Submit Button - Right */}
                          <Button 
                            onClick={handleAddVocab}
                            disabled={vocabEntries.filter(entry => entry.word.trim()).length === 0}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 h-8 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Thêm từ vựng
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Words Content - List or Detail View */}
        {viewMode === "list" ? (
          /* Words Accordion Cards */
          (<div className="space-y-2">
            <Accordion type="multiple" className="w-full">
              {filteredWords.map((word, index) => (
                <AccordionItem 
                  key={word.id} 
                  value={`word-${word.id}`}
                  className="border border-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 [&>svg]:h-4 [&>svg]:w-4">
                    <div className="flex items-center justify-between w-full pr-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 min-w-[2rem]">#{index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-semibold text-gray-900">{word.word}</h3>
                          <span className="text-gray-400 hover:text-blue-500 p-1 cursor-pointer">
                            <Volume2 className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-gray-600 italic">{word.pronunciation}</span>
                          <Badge variant="secondary" className={`text-xs ${getPartOfSpeechColor(word.partOfSpeech)}`}>
                            {word.partOfSpeech}
                          </Badge>
                        </div>
                      </div>
                      <span
                        className="h-7 px-3 py-1 text-xs border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-full cursor-pointer inline-flex items-center justify-center bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentWordIndex(index);
                          setViewMode("detail");
                        }}
                      >
                        Chi tiết
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="space-y-3">
                      {/* Definition 1 */}
                      <div>
                        <p className="text-gray-900 text-sm leading-relaxed mb-2">
                          <span className="font-semibold">Định nghĩa 1:</span> {word.definition || "The ability to recover quickly from difficulties; toughness"}{" "}
                          <span className="italic text-gray-700">({word.vietnamese || "Khả năng phục hồi nhanh chóng từ khó khăn; sức bền"})</span>
                        </p>
                        
                        <div className="ml-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            1. {word.example || "She showed great resilience in overcoming the challenges at work."}{" "}
                            <span className="italic text-gray-600">
                              ({word.exampleVietnamese || "Cô ấy đã thể hiện khả năng phục hồi tuyệt vời trong việc vượt qua những thử thách tại nơi làm việc."})
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Definition 2 (if word has multiple meanings) */}
                      {word.word === "Resilience" && (
                        <div>
                          <p className="text-gray-900 text-sm leading-relaxed mb-2">
                            <span className="font-semibold">Định nghĩa 2:</span> The ability of a material to return to its original shape after being bent or stretched{" "}
                            <span className="italic text-gray-700">(Khả năng của vật liệu trở lại hình dạng ban đầu sau khi bị uốn cong hoặc kéo giãn)</span>
                          </p>
                          
                          <div className="ml-4">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              1. The rubber ball demonstrated excellent resilience when it bounced back perfectly.{" "}
                              <span className="italic text-gray-600">
                                (Quả bóng cao su thể hiện độ đàn hồi tuyệt vời khi nó nảy trở lại hoàn hảo.)
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>)
        ) : (
          /* Word Detail View */
          (<div className="w-full mx-auto">
            {/* Action Buttons for Detail View */}
            <div className="mb-4 flex items-center justify-end gap-2">
              <Button 
                onClick={handleBackToList}
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 h-9 text-sm px-3"
              >
                Xem danh sách từ
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                if (!addWordMutation.isPending) {
                  setIsAddDialogOpen(open);
                  if (open) {
                    resetForm();
                  }
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-9 text-sm px-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm từ vựng
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0"
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => {
                    if (!addWordMutation.isPending) {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }
                  }}
                >
                  {/* Header - Fixed */}
                  <div className="flex items-center justify-center relative p-4 border-b border-gray-200 bg-white flex-shrink-0 pt-[3.2px] pb-[3.2px] pl-[14.2px] pr-[14.2px]">
                    <DialogTitle className="text-lg font-semibold text-gray-900">Thêm từ vựng</DialogTitle>
                    <DialogDescription className="sr-only">Thêm từ vựng mới vào bộ thẻ học tập</DialogDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => {
                        if (!addWordMutation.isPending) {
                          setIsAddDialogOpen(false);
                          resetForm();
                        }
                      }}
                    >
                      <img src={closeIcon} alt="Close" className="h-4 w-4" />
                    </Button>
                  </div>

                  {addWordMutation.isPending ? (
                    /* Loading State */
                    (<div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                      <p className="text-emerald-700 font-medium">Đang thêm từ vựng...</p>
                      <p className="text-emerald-600 text-sm">
                        {Math.round((100 / vocabEntries.filter(e => e.word.trim()).length) * 50)}%
                      </p>
                    </div>)
                  ) : (
                    <>
                      {/* Content - Scrollable */}
                      <div className="flex-1 overflow-y-auto p-3">
                        <div className="space-y-2">
                          {vocabEntries.map((entry, index) => (
                            <div key={entry.id} className="flex items-start gap-2">
                              {/* Sequence number outside card - left */}
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium mt-2 flex-shrink-0 shadow-sm">
                                {index + 1}
                              </span>
                              
                              {/* Card content */}
                              <div className="flex-1 border border-emerald-200 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50">
                                <div className="p-0">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="block text-xs font-medium text-emerald-700">
                                        Từ vựng <span className="text-red-500">*</span>
                                      </label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center gap-1 h-5 px-1 hover:bg-emerald-100 flex-shrink-0"
                                        onClick={() => toggleVocabExpansion(entry.id)}
                                      >
                                        <span className="text-xs text-emerald-600">Thêm nội dung</span>
                                        {entry.isExpanded ? (
                                          <div className="h-3 w-3 bg-emerald-600" style={{
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                          }}></div>
                                        ) : (
                                          <div className="h-3 w-3 bg-emerald-600" style={{
                                            clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)'
                                          }}></div>
                                        )}
                                      </Button>
                                    </div>
                                    <Input
                                      value={entry.word}
                                      onChange={(e) => updateVocabEntry(entry.id, "word", e.target.value)}
                                      placeholder="Nhập từ vựng ở đây (Ví dụ: illuminate)"
                                      className="bg-white h-8 text-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
                                    />
                                  </div>

                                  {/* Expanded Content */}
                                  {entry.isExpanded && (
                                    <div className="mt-3">
                                      <label className="block text-xs font-medium text-emerald-700 mb-2">
                                        Nội dung
                                      </label>
                                      <Textarea
                                        value={entry.content}
                                        onChange={(e) => updateVocabEntry(entry.id, "content", e.target.value)}
                                        placeholder="Nhập nội dung liên quan đến từ vựng ở đây như định nghĩa, ví dụ,...."
                                        rows={3}
                                        className="bg-white text-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Delete button outside card - right */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full mt-2 flex-shrink-0"
                                onClick={() => removeVocabEntry(entry.id)}
                                disabled={vocabEntries.length === 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}

                          {/* Add Word Button */}
                          <Button
                            variant="outline"
                            onClick={addVocabEntry}
                            className="w-auto flex items-center gap-2 border-dashed border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 h-8 text-sm transition-colors mt-2"
                          >
                            <Plus className="h-3 w-3" />
                            Thêm từ
                          </Button>
                        </div>
                      </div>

                      {/* Footer - Fixed */}
                      <div className="border-t border-emerald-200 p-3 flex-shrink-0 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-end justify-between">
                          {/* Card Selection - Left */}
                          <div>
                            <label className="block text-xs font-medium text-emerald-700 mb-1">
                              Bộ thẻ <span className="text-red-500">*</span>
                            </label>
                            <Button
                              variant="outline"
                              disabled
                              className="w-[200px] justify-start h-8 text-sm border-2 border-emerald-400 bg-emerald-100 text-emerald-900 font-semibold cursor-not-allowed opacity-90"
                            >
                              {card?.title || "Đang tải..."}
                            </Button>
                          </div>

                          {/* Word Count - Center */}
                          <div className="text-xs text-emerald-700 font-medium self-end pb-1">
                            Số từ: {vocabEntries.filter(entry => entry.word.trim()).length} từ
                          </div>

                          {/* Submit Button - Right */}
                          <Button 
                            onClick={handleAddVocab}
                            disabled={vocabEntries.filter(entry => entry.word.trim()).length === 0}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 h-8 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Thêm từ vựng
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-stretch gap-2 md:gap-4">
              {/* Left Navigation Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => navigateToWord("prev")}
                  disabled={currentWordIndex <= 0}
                  className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg"
                >
                  <img 
                    src={leftArrowIcon} 
                    alt="Previous" 
                    className="w-5 h-5 md:w-8 md:h-8 object-contain"
                  />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
                <div className="p-0">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900">{currentWord?.word || "Resilience"}</h2>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-500 p-1">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <span className="text-sm md:text-base text-gray-600 italic">{currentWord?.pronunciation || "/rɪˈzɪljəns/"}</span>
                      <Badge variant="secondary" className={getPartOfSpeechColor(currentWord?.partOfSpeech || "N")}>
                        {currentWord?.partOfSpeech || "N"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-500">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-2 md:mb-3">
                    {/* Tab Navigation */}
                    <div className="flex items-center justify-between border-b border-gray-200">
                      <div className="flex gap-1 overflow-x-auto">
                        <button
                          onClick={() => setActiveTab("images")}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-t-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === "images"
                              ? "bg-blue-100 text-blue-800 border-b-2 border-blue-500"
                              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          Hình ảnh
                        </button>
                        <button
                          onClick={() => setActiveTab("definition")}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-t-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === "definition"
                              ? "bg-green-100 text-green-800 border-b-2 border-green-500"
                              : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                          }`}
                        >
                          Định nghĩa
                        </button>
                        <button
                          onClick={() => setActiveTab("phrases")}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-t-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === "phrases"
                              ? "bg-orange-100 text-orange-800 border-b-2 border-orange-500"
                              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                        >
                          Cụm từ thường gặp
                        </button>
                        <button
                          onClick={() => setActiveTab("synonyms")}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-t-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === "synonyms"
                              ? "bg-purple-100 text-purple-800 border-b-2 border-purple-500"
                              : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                          }`}
                        >
                          Từ đồng nghĩa và trái nghĩa
                        </button>
                        <button
                          onClick={() => setActiveTab("games")}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-t-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === "games"
                              ? "bg-indigo-100 text-indigo-800 border-b-2 border-indigo-500"
                              : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                        >
                          Trò chơi
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 mb-1 md:mb-2">
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="relative h-[400px] mt-4 overflow-y-auto pr-2">
                    {activeTab === "images" && (
                      <div className="h-full flex flex-col">
                        {/* Header with title and add button */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Hình ảnh minh họa</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            disabled={wordImages.length >= 2}
                            onClick={() => {
                              if (wordImages.length < 2) {
                                setWordImages([...wordImages, `new-image-${wordImages.length + 1}`]);
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Thêm hình ảnh
                          </Button>
                        </div>
                        
                        {/* Content area centered vertically */}
                        <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-2 sm:px-4">
                          {wordImages.length === 0 ? (
                            // No images - show placeholder
                            <div 
                              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] bg-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                              style={{ aspectRatio: '16/9' }}
                            >
                              <span className="text-gray-500 text-sm">Chưa thêm hình ảnh</span>
                            </div>
                          ) : wordImages.length === 1 ? (
                            // One image - center it
                            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]">
                              <div 
                                className="w-full bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300"
                                style={{ aspectRatio: '16/9' }}
                              >
                                <span className="text-gray-500 text-sm">Hình ảnh 1</span>
                              </div>
                              
                              {/* Edit mode controls */}
                              {isEditMode && (
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50 h-6 w-6 p-0"
                                    onClick={() => {
                                      // Replace image
                                      const newImages = [...wordImages];
                                      newImages[0] = `updated-image-1`;
                                      setWordImages(newImages);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50 h-6 w-6 p-0"
                                    onClick={() => {
                                      // Remove image
                                      setWordImages([]);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            // Two images - professional responsive layout
                            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 xl:gap-8">
                              {wordImages.slice(0, 2).map((image, index) => (
                                <div key={index} className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[300px] xl:max-w-[340px] 2xl:max-w-[380px]">
                                  <div 
                                    className="w-full bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300"
                                    style={{ aspectRatio: '16/9' }}
                                  >
                                    <span className="text-gray-500 text-sm">Hình ảnh {index + 1}</span>
                                  </div>
                                  
                                  {/* Edit mode controls */}
                                  {isEditMode && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 h-6 w-6 p-0"
                                        onClick={() => {
                                          // Replace image
                                          const newImages = [...wordImages];
                                          newImages[index] = `updated-image-${index + 1}`;
                                          setWordImages(newImages);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50 h-6 w-6 p-0"
                                        onClick={() => {
                                          // Remove image
                                          const newImages = wordImages.filter((_, i) => i !== index);
                                          setWordImages(newImages);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Centered question text */}
                          <div className="text-center px-2">
                            <p className="text-gray-700 text-sm sm:text-base">Nghĩa của từ vựng này là gì?</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "definition" && (
                      <div className="space-y-4">
                        <div className="space-y-4">
                          {editableDefinitions.map((def, defIndex) => (
                            <div key={defIndex}>
                              {!isEditMode ? (
                                // View mode
                                <div>
                                  <p className="text-gray-900 text-sm leading-relaxed mb-3">
                                    <span className="font-semibold">{def.title}</span> {def.definition}{" "}
                                    <span className="italic text-gray-700">({def.vietnamese})</span>
                                  </p>
                                  
                                  <div className="ml-4 space-y-2">
                                    <p className="text-gray-700 text-sm font-medium mb-2">Ví dụ:</p>
                                    <div className="space-y-2">
                                      {def.examples.map((example, exIndex) => (
                                        <p key={exIndex} className="text-gray-700 text-sm leading-relaxed">
                                          {exIndex + 1}. {example.english}{" "}
                                          <span className="italic text-gray-600">
                                            ({example.vietnamese})
                                          </span>
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // Edit mode
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium">
                                        {def.title} <span className="text-red-500">*</span>
                                      </Label>
                                      {defIndex > 0 && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-red-600"
                                          onClick={() => {
                                            const newDefs = editableDefinitions.filter((_, i) => i !== defIndex);
                                            setEditableDefinitions(newDefs);
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Textarea
                                        value={def.definition && def.vietnamese ? `${def.definition} (${def.vietnamese})` : ''}
                                        onChange={(e) => {
                                          const newDefs = [...editableDefinitions];
                                          const value = e.target.value;
                                          
                                          // Parse combined bilingual content
                                          const match = value.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
                                          if (match) {
                                            newDefs[defIndex].definition = match[1].trim();
                                            newDefs[defIndex].vietnamese = match[2].trim();
                                          } else {
                                            newDefs[defIndex].definition = value;
                                            newDefs[defIndex].vietnamese = '';
                                          }
                                          setEditableDefinitions(newDefs);
                                        }}
                                        className="min-h-[60px] text-sm"
                                        placeholder="The ability to recover quickly from difficulties; toughness (Khả năng phục hồi nhanh chóng từ khó khăn; sức bền)"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-xs text-gray-600">Ví dụ:</Label>
                                      <Textarea
                                        value={def.examples.map((ex, idx) => 
                                          `${idx + 1}. ${ex.english} (${ex.vietnamese})`
                                        ).join('\n')}
                                        onChange={(e) => {
                                          const newDefs = [...editableDefinitions];
                                          const value = e.target.value;
                                          
                                          // Parse numbered examples
                                          const examples = value.split('\n').filter(line => line.trim()).map(line => {
                                            const match = line.match(/^\d+\.\s*(.*?)\s*\(([^)]+)\)\s*$/);
                                            if (match) {
                                              return {
                                                english: match[1].trim(),
                                                vietnamese: match[2].trim()
                                              };
                                            }
                                            return {
                                              english: line.replace(/^\d+\.\s*/, '').trim(),
                                              vietnamese: ''
                                            };
                                          });
                                          
                                          newDefs[defIndex].examples = examples;
                                          setEditableDefinitions(newDefs);
                                          
                                          // Auto-resize
                                          const target = e.target as HTMLTextAreaElement;
                                          setTimeout(() => {
                                            target.style.height = 'auto';
                                            target.style.height = Math.min(target.scrollHeight, 400) + 'px';
                                          }, 0);
                                        }}
                                        className="min-h-[120px] text-sm resize-none"
                                        placeholder="1. She showed great resilience in overcoming the challenges at work. (Cô ấy đã thể hiện khả năng phục hồi tuyệt vời trong việc vượt qua những thử thách tại nơi làm việc.)&#10;2. The company's resilience helped it survive the economic downturn. (Khả năng phục hồi của công ty đã giúp nó tồn tại qua cuộc suy thoái kinh tế.)&#10;3. Building emotional resilience is crucial for mental health. (Xây dựng khả năng phục hồi cảm xúc là rất quan trọng cho sức khỏe tâm thần.)"
                                        style={{
                                          height: 'auto',
                                          minHeight: '120px',
                                          maxHeight: '400px',
                                          overflowY: 'auto'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {isEditMode && (
                            <Button
                              variant="outline"
                              className="text-blue-600 border-blue-300"
                              onClick={() => {
                                setEditableDefinitions([...editableDefinitions, {
                                  title: `Định nghĩa ${editableDefinitions.length + 1}:`,
                                  definition: "",
                                  vietnamese: "",
                                  examples: []
                                }]);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Thêm định nghĩa
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "phrases" && (
                      <div className="space-y-3 phrases-tab">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg">Cụm từ thường gặp</h3>
                        <div className="space-y-2">
                          {editablePhrases.map((phrase, phraseIndex) => (
                            <div key={phraseIndex} className="bg-orange-50 p-2 rounded-lg border border-orange-200">
                              {!isEditMode ? (
                                // View mode
                                <div>
                                  <p className="text-gray-700 text-sm font-medium mb-2">
                                    {phrase.phrase} - {phrase.vietnamese}
                                  </p>
                                  <p className="text-gray-700 text-sm leading-relaxed ml-2">
                                    → {phrase.example}{" "}
                                    <span className="italic text-gray-600">
                                      ({phrase.exampleVietnamese})
                                    </span>
                                  </p>
                                </div>
                              ) : (
                                // Edit mode
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">Cụm từ {phraseIndex + 1}:</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-600"
                                      onClick={() => {
                                        const newPhrases = editablePhrases.filter((_, i) => i !== phraseIndex);
                                        setEditablePhrases(newPhrases);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={`${phrase.phrase}${phrase.vietnamese ? ' - ' + phrase.vietnamese : ''}`}
                                    onChange={(e) => {
                                      const newPhrases = [...editablePhrases];
                                      const value = e.target.value;
                                      const parts = value.split(' - ');
                                      newPhrases[phraseIndex].phrase = parts[0] || '';
                                      newPhrases[phraseIndex].vietnamese = parts[1] || '';
                                      setEditablePhrases(newPhrases);
                                    }}
                                    placeholder="Show resilience - Thể hiện sự kiên cường"
                                    className="h-8 text-sm"
                                  />
                                  <Input
                                    value={`${phrase.example}${phrase.exampleVietnamese ? ' (' + phrase.exampleVietnamese + ')' : ''}`}
                                    onChange={(e) => {
                                      const newPhrases = [...editablePhrases];
                                      const value = e.target.value;
                                      const match = value.match(/^(.*?)\s*\((.*?)\)\s*$/);
                                      if (match) {
                                        newPhrases[phraseIndex].example = match[1].trim();
                                        newPhrases[phraseIndex].exampleVietnamese = match[2].trim();
                                      } else {
                                        newPhrases[phraseIndex].example = value;
                                        newPhrases[phraseIndex].exampleVietnamese = '';
                                      }
                                      setEditablePhrases(newPhrases);
                                    }}
                                    placeholder="The team showed remarkable resilience during the crisis. (Nhóm đã thể hiện sự kiên cường đáng chú ý trong suốt cuộc khủng hoảng.)"
                                    className="h-8 text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {isEditMode && (
                            <Button
                              variant="outline"
                              className="text-blue-600 border-blue-300"
                              onClick={() => {
                                setEditablePhrases([...editablePhrases, {
                                  phrase: "",
                                  vietnamese: "",
                                  example: "",
                                  exampleVietnamese: ""
                                }]);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Thêm cụm từ
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "synonyms" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">Từ đồng nghĩa và trái nghĩa</h3>
                        <div className="space-y-3">
                          {/* Synonyms Section */}
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-green-900">Từ đồng nghĩa:</h4>
                              {isEditMode && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 h-6"
                                  onClick={() => {
                                    setEditableSynonyms([...editableSynonyms, { word: "", example: "" }]);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Thêm
                                </Button>
                              )}
                            </div>
                            
                            {!isEditMode ? (
                              // View mode
                              <div className="space-y-2">
                                {editableSynonyms.map((synonym, index) => (
                                  <div key={index} className="text-sm text-gray-700">
                                    <span className="font-medium text-green-800">{synonym.word}</span>
                                    <span className="text-gray-600"> - {synonym.example}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Edit mode
                              <div className="space-y-2">
                                {editableSynonyms.map((synonym, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={synonym.word}
                                      onChange={(e) => {
                                        const newSynonyms = [...editableSynonyms];
                                        newSynonyms[index].word = e.target.value;
                                        setEditableSynonyms(newSynonyms);
                                      }}
                                      placeholder="strength"
                                      className="text-sm w-32 h-8"
                                    />
                                    <Input
                                      value={synonym.example}
                                      onChange={(e) => {
                                        const newSynonyms = [...editableSynonyms];
                                        newSynonyms[index].example = e.target.value;
                                        setEditableSynonyms(newSynonyms);
                                      }}
                                      placeholder="Her mental strength helped her overcome challenges"
                                      className="text-sm flex-1 h-8"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600"
                                      onClick={() => {
                                        const newSynonyms = editableSynonyms.filter((_, i) => i !== index);
                                        setEditableSynonyms(newSynonyms);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Antonyms Section */}
                          <div className="bg-red-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-red-900">Từ trái nghĩa:</h4>
                              {isEditMode && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 h-6"
                                  onClick={() => {
                                    setEditableAntonyms([...editableAntonyms, { word: "", example: "" }]);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Thêm
                                </Button>
                              )}
                            </div>
                            
                            {!isEditMode ? (
                              // View mode
                              <div className="space-y-2">
                                {editableAntonyms.map((antonym, index) => (
                                  <div key={index} className="text-sm text-gray-700">
                                    <span className="font-medium text-red-800">{antonym.word}</span>
                                    <span className="text-gray-600"> - {antonym.example}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Edit mode
                              <div className="space-y-2">
                                {editableAntonyms.map((antonym, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={antonym.word}
                                      onChange={(e) => {
                                        const newAntonyms = [...editableAntonyms];
                                        newAntonyms[index].word = e.target.value;
                                        setEditableAntonyms(newAntonyms);
                                      }}
                                      placeholder="weakness"
                                      className="text-sm w-32 h-8"
                                    />
                                    <Input
                                      value={antonym.example}
                                      onChange={(e) => {
                                        const newAntonyms = [...editableAntonyms];
                                        newAntonyms[index].example = e.target.value;
                                        setEditableAntonyms(newAntonyms);
                                      }}
                                      placeholder="His weakness became apparent under pressure"
                                      className="text-sm flex-1 h-8"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600"
                                      onClick={() => {
                                        const newAntonyms = editableAntonyms.filter((_, i) => i !== index);
                                        setEditableAntonyms(newAntonyms);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "games" && (
                      <div className="h-full flex flex-col">
                        <div className="space-y-6">
                          <div className="text-center mb-6">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">Trò chơi gợi nhớ</h3>
                            <p className="text-gray-600 text-sm">Câu hỏi {currentQuestionIndex + 1} / {quizQuestions.length}</p>
                          </div>

                          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                            <p className="text-gray-800 text-base leading-relaxed mb-6">
                              {currentQuestion.question}
                            </p>

                            <div className="space-y-3">
                              {currentQuestion.options.map((option) => (
                                <label
                                  key={option.value}
                                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    selectedAnswer === option.value
                                      ? "bg-indigo-200 border-2 border-indigo-500"
                                      : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                                  } ${
                                    showResult
                                      ? option.value === currentQuestion.correctAnswer
                                        ? "bg-green-100 border-green-500"
                                        : option.value === selectedAnswer && option.value !== currentQuestion.correctAnswer
                                          ? "bg-red-100 border-red-500"
                                          : "bg-gray-100 border-gray-300"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="answer"
                                    value={option.value}
                                    checked={selectedAnswer === option.value}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                    disabled={showResult}
                                    className="mr-3"
                                  />
                                  <span className="font-medium text-gray-800 mr-2">{option.value}.</span>
                                  <span className="text-gray-700">{option.text}</span>
                                </label>
                              ))}
                            </div>

                            {!showResult ? (
                              <div className="mt-6 text-center">
                                <Button
                                  onClick={handleAnswerSubmit}
                                  disabled={!selectedAnswer}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
                                >
                                  Trả lời
                                </Button>
                              </div>
                            ) : (
                              <div className="mt-6">
                                <div className={`p-4 rounded-lg mb-4 ${
                                  selectedAnswer === currentQuestion.correctAnswer
                                    ? "bg-green-100 border border-green-300"
                                    : "bg-red-100 border border-red-300"
                                }`}>
                                  <p className={`font-medium mb-2 ${
                                    selectedAnswer === currentQuestion.correctAnswer
                                      ? "text-green-800"
                                      : "text-red-800"
                                  }`}>
                                    {selectedAnswer === currentQuestion.correctAnswer
                                      ? "Chính xác! 🎉"
                                      : "Chưa đúng rồi"}
                                  </p>
                                  <p className="text-gray-700 text-sm">
                                    <strong>Đáp án đúng:</strong> {currentQuestion.correctAnswer}. {currentQuestion.options.find(opt => opt.value === currentQuestion.correctAnswer)?.text}
                                  </p>
                                  <p className="text-gray-600 text-sm mt-2">
                                    <strong>Giải thích:</strong> {currentQuestion.explanation}
                                  </p>
                                </div>
                                
                                <div className="text-center">
                                  <Button
                                    onClick={handleNextQuestion}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
                                  >
                                    {currentQuestionIndex < quizQuestions.length - 1 ? "Câu tiếp theo" : "Chơi lại"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-center text-sm text-gray-500">
                            <p>Thực hành từ vựng về phát triển bền vững</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Navigation Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => navigateToWord("next")}
                  disabled={currentWordIndex >= filteredWords.length - 1}
                  className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg"
                >
                  <img 
                    src={rightArrowIcon} 
                    alt="Next" 
                    className="w-5 h-5 md:w-8 md:h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Footer for Detail View */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{currentWordIndex + 1}/{filteredWords.length} từ vựng</span>
              </div>
              <Button
                variant="outline"
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                onClick={() => {
                  if (isEditMode) {
                    // Filter out empty definitions when saving
                    const filteredDefinitions = editableDefinitions.filter(def => 
                      def.definition.trim() !== '' || def.vietnamese.trim() !== ''
                    );
                    setEditableDefinitions(filteredDefinitions);
                    
                    // Filter out empty phrases
                    const filteredPhrases = editablePhrases.filter(phrase => 
                      phrase.phrase.trim() !== '' || phrase.vietnamese.trim() !== ''
                    );
                    setEditablePhrases(filteredPhrases);
                    
                    // Filter out empty synonyms and antonyms
                    setEditableSynonyms(editableSynonyms.filter(item => item.word.trim() !== '' || item.example.trim() !== ''));
                    setEditableAntonyms(editableAntonyms.filter(item => item.word.trim() !== '' || item.example.trim() !== ''));
                  }
                  setIsEditMode(!isEditMode);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? "Hoàn thành" : "Chỉnh sửa"}
              </Button>
            </div>
          </div>)
        )}
      </div>
    </div>
  );
}