import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Star, BookOpen, Users, Plus, Edit } from "lucide-react";
import leftArrowIcon from "@assets/left-arrow_1750231743172.png";
import rightArrowIcon from "@assets/right-arrow_1750231743193.png";
import type { VocabularyCard, VocabularyWord } from "@shared/schema";

export default function WordcraftCardDetails() {
  const { cardId } = useParams<{ cardId: string }>();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("definition");

  const { data: card, isLoading: cardLoading } = useQuery<VocabularyCard>({
    queryKey: ["/api/vocabulary-cards", cardId],
    enabled: !!cardId,
  });

  const { data: words = [], isLoading: wordsLoading } = useQuery<VocabularyWord[]>({
    queryKey: ["/api/vocabulary-cards", cardId, "words"],
    enabled: !!cardId,
  });

  const totalWords = words.length;
  const currentWord = words[currentWordIndex];

  const navigateToWord = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentWordIndex - 1 : currentWordIndex + 1;
    if (newIndex >= 0 && newIndex < words.length) {
      setCurrentWordIndex(newIndex);
    }
  };

  const favoriteMutation = useMutation({
    mutationFn: async (isFavorited: boolean) => {
      const response = await fetch(`/api/vocabulary-cards/${cardId}/favorite`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorited }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update favorite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary-cards", cardId] });
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary-cards"] });
    },
  });

  const handleFavoriteToggle = () => {
    if (card) {
      favoriteMutation.mutate(!card.isFavorited);
    }
  };

  if (cardLoading || wordsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bộ thẻ</h2>
          <p className="text-gray-600 mb-4">Card ID: {cardId}</p>
          <Link href="/wordcraft">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có từ vựng</h2>
          <p className="text-gray-600 mb-4">Bộ thẻ này chưa có từ vựng nào.</p>
          <Link href={`/wordcraft/${cardId}/words`}>
            <Button>Quay lại danh sách từ vựng</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/wordcraft/${cardId}/words`}>
            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Trở về
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFavoriteToggle}
              disabled={favoriteMutation.isPending}
              className={`hover:bg-yellow-50 ${card?.isFavorited ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              <Star className={`h-4 w-4 ${card?.isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Card Info with beautiful design */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {card.title}
              </h1>
              {card.description && (
                <p className="text-gray-700 mb-4 leading-relaxed">{card.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Chủ đề:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                    {card.category}
                  </Badge>
                </div>
                
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Học từ vựng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Word Detail Card with Navigation */}
      <div className="max-w-4xl mx-auto relative">
        {/* Left Navigation Arrow */}
        <button
          onClick={() => navigateToWord("prev")}
          disabled={currentWordIndex <= 0}
          className="absolute left-[-100px] top-[180px] w-20 h-72 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 z-10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <img 
            src={leftArrowIcon} 
            alt="Previous" 
            className="w-12 h-12 object-contain"
          />
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => navigateToWord("next")}
          disabled={currentWordIndex >= totalWords - 1}
          className="absolute right-[-100px] top-[180px] w-20 h-72 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 z-10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <img 
            src={rightArrowIcon} 
            alt="Next" 
            className="w-12 h-12 object-contain"
          />
        </button>

        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="p-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900">{currentWord?.word || "Từ vựng"}</h2>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-500">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">({currentWord?.partOfSpeech || "N"}) (C1)</p>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("image")}
                  className={`px-3 py-1 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === "image"
                      ? "bg-blue-100 text-blue-800 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Hình ảnh
                </button>
                <button
                  onClick={() => setActiveTab("definition")}
                  className={`px-3 py-1 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === "definition"
                      ? "bg-green-100 text-green-800 border-b-2 border-green-500"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  Định nghĩa
                </button>
                <button
                  onClick={() => setActiveTab("etymology")}
                  className={`px-3 py-1 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === "etymology"
                      ? "bg-purple-100 text-purple-800 border-b-2 border-purple-500"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  Nguồn gốc
                </button>
                <button
                  onClick={() => setActiveTab("phrases")}
                  className={`px-3 py-1 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === "phrases"
                      ? "bg-orange-100 text-orange-800 border-b-2 border-orange-500"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Cụm từ thường gặp
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[250px] mt-2">
              {activeTab === "image" && (
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">Hình ảnh sẽ được cập nhật sau</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "definition" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Định nghĩa</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm">Tiếng Anh:</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {currentWord?.definition || "Định nghĩa sẽ được cập nhật sau"}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                        <h4 className="font-medium text-green-900 mb-2 text-sm">Tiếng Việt:</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {currentWord?.vietnamese || "Nghĩa tiếng Việt sẽ được cập nhật sau"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Ví dụ</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="space-y-2">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {currentWord?.example ? (
                            <>
                              "{currentWord.example}"
                            </>
                          ) : (
                            "Ví dụ sẽ được cập nhật sau"
                          )}
                        </p>
                        {currentWord?.exampleVietnamese && (
                          <p className="text-gray-600 italic text-sm">
                            ({currentWord.exampleVietnamese})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "etymology" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Nguồn gốc từ vựng</h3>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-purple-900 text-sm">Gốc Latin:</strong>
                          <span className="text-gray-700 ml-2 text-sm">"resilire" có nghĩa là "nhảy trở lại" hoặc "bật trở lại"</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-purple-900 text-sm">Tiền tố:</strong>
                          <span className="text-gray-700 ml-2 text-sm">"re-" (trở lại) + "salire" (nhảy)</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-purple-900 text-sm">Xuất hiện:</strong>
                          <span className="text-gray-700 ml-2 text-sm">Thế kỷ 17, ban đầu được sử dụng trong vật lý học để mô tả tính chất đàn hồi của vật liệu</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-purple-900 text-sm">Mở rộng nghĩa:</strong>
                          <span className="text-gray-700 ml-2 text-sm">Thế kỷ 20, được áp dụng vào tâm lý học và khoa học xã hội</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "phrases" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Cụm từ thường gặp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-blue-900 mb-1 text-sm">Emotional resilience</p>
                      <p className="text-xs text-blue-700">Sức bền cảm xúc</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-green-900 mb-1 text-sm">Build resilience</p>
                      <p className="text-xs text-green-700">Xây dựng sức bền/khả năng phục hồi</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-purple-900 mb-1 text-sm">Resilience training</p>
                      <p className="text-xs text-purple-700">Đào tạo khả năng phục hồi</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-orange-900 mb-1 text-sm">Mental resilience</p>
                      <p className="text-xs text-orange-700">Sức bền tinh thần</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-pink-900 mb-1 text-sm">Show remarkable resilience</p>
                      <p className="text-xs text-pink-700">Thể hiện khả năng phục hồi đáng kinh ngạc</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-indigo-900 mb-1 text-sm">Economic resilience</p>
                      <p className="text-xs text-indigo-700">Sức bền kinh tế</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Word Counter and Edit Button */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 px-3">
              <div></div>
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-700">
                  {currentWordIndex + 1}/{totalWords}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                Số từ vựng: <span className="text-blue-600 font-semibold ml-1">{card?.wordCount || totalWords}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Số lần học: <span className="text-blue-600 font-semibold ml-1">{card?.studyCount || 0}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link href={`/wordcraft/${cardId}/words`}>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
                  Xem danh sách từ vựng
                </Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Thêm từ vựng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}