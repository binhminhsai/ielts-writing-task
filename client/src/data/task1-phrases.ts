export interface Task1PhraseCategory {
    name: string;
    phrases: string[];
}

// Task 1 specific useful phrases
const task1Phrases: Task1PhraseCategory[] = [
    {
        name: "Introduction Phrases",
        phrases: [
            "The chart/graph/table shows/illustrates/displays...",
            "The diagram depicts/demonstrates/presents...",
            "According to the data provided...",
            "The information given reveals that...",
            "As can be seen from the chart...",
            "The visual representation indicates...",
        ],
    },
    {
        name: "Describing Trends",
        phrases: [
            "There was a significant increase/decrease in...",
            "The figures rose/fell dramatically from... to...",
            "A gradual upward/downward trend can be observed...",
            "The data shows a steady rise/decline...",
            "There was a sharp spike/drop in...",
            "The numbers fluctuated between... and...",
        ],
    },
    {
        name: "Making Comparisons",
        phrases: [
            "In comparison with...",
            "Compared to/with...",
            "While... increased, ... decreased",
            "In contrast to...",
            "Similarly/Likewise...",
            "On the other hand...",
            "Whereas... showed growth, ... remained stable",
        ],
    },
    {
        name: "Describing Data Points",
        phrases: [
            "The highest figure was recorded in...",
            "The peak occurred at...",
            "The lowest point was reached in...",
            "The data peaked at... before declining to...",
            "The figures plateaued at approximately...",
            "There was a notable exception in...",
        ],
    },
    {
        name: "Time References",
        phrases: [
            "During the period from... to...",
            "Throughout the time frame...",
            "At the beginning/end of the period...",
            "Subsequently/Thereafter...",
            "Following this trend...",
            "Prior to this...",
            "In the final year/month...",
        ],
    },
    {
        name: "Approximation and Precision",
        phrases: [
            "Approximately/Roughly...",
            "Just over/under...",
            "Nearly/Almost...",
            "Exactly/Precisely...",
            "Around/About...",
            "Close to...",
            "Marginally higher/lower...",
        ],
    },
    {
        name: "Overview Statements",
        phrases: [
            "Overall, the data reveals...",
            "In general, there was...",
            "The most striking feature is...",
            "It is clear that...",
            "The main trend shows...",
            "A notable pattern emerges...",
            "The dominant feature is...",
        ],
    },
    {
        name: "Sequencing (for processes)",
        phrases: [
            "First/Initially/To begin with...",
            "Next/Subsequently/Following this...",
            "After that/Thereafter...",
            "Meanwhile/At the same time...",
            "Finally/Ultimately/In the end...",
            "The process concludes with...",
            "The final stage involves...",
        ],
    },
];

export function getTask1Phrases(): Task1PhraseCategory[] {
    return task1Phrases;
}

export const task1PhraseCategories = [
    { id: "introduction", name: "Introduction" },
    { id: "trends", name: "Describing Trends" },
    { id: "comparisons", name: "Making Comparisons" },
    { id: "data", name: "Describing Data" },
    { id: "time", name: "Time References" },
    { id: "approximation", name: "Precision" },
    { id: "overview", name: "Overview" },
    { id: "sequencing", name: "Sequencing" },
];