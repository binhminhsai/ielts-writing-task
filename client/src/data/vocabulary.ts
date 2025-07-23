import { WritingTestType } from "@/components/writing-practice/test-setup";

export interface VocabularyWord {
  word: string;
  partOfSpeech: "N" | "V" | "Adj" | "Adv" | "Phrase";
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  meaning: string;
  example: string;
}

export interface VocabularyCategory {
  name: string;
  type: "neutral" | "positive" | "negative" | "academic";
  words: VocabularyWord[];
}


// Function to fetch vocabulary from the API
export async function getVocabulary(
  testType: WritingTestType,
  topic: string
): Promise<VocabularyCategory[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-vocabulary`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: topic,
        level: 'Band 6.5', // Adjust based on your requirements, e.g., map testType or difficulty
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data?.data?.vocabulary || !result.data?.data?.collocation) {
      throw new Error('Invalid API response format');
    }

    // Map API response to VocabularyCategory format
    const vocabularyCategory: VocabularyCategory = {
      name: 'General Vocabulary',
      type: 'neutral',
      words: result.data.data.vocabulary.map((item: any) => ({
        word: item.word,
        partOfSpeech: item.type as 'N' | 'V' | 'Adj' | 'Adv',
        difficulty: item.cefr_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        meaning: item.meaning,
        example: item.example,
      })),
    };

    const collocationCategory: VocabularyCategory = {
      name: 'Collocations',
      type: 'neutral',
      words: result.data.data.collocation.map((item: any) => ({
        word: item.phrase,
        partOfSpeech: 'Phrase',
        difficulty: item.cefr_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        meaning: item.meaning,
        example: item.example,
      })),
    };

    return [vocabularyCategory, collocationCategory];
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    // Fallback to empty array or handle error as needed
    return [];
  }
}
