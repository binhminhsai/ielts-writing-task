export interface Task1OutlineSection {
    title: string;
    points: string[];
}

// Task 1 specific outlines
const task1BaseOutline: Task1OutlineSection[] = [
    {
        title: "Introduction",
        points: [
            "Paraphrase the question/task",
            "Provide a brief overview of the main trends or features",
        ],
    },
    {
        title: "Overview",
        points: [
            "Identify the most significant trends or patterns",
            "Highlight the highest and lowest values",
            "Note any exceptional or notable features",
        ],
    },
    {
        title: "Body Paragraph 1",
        points: [
            "Describe specific data points and trends",
            "Compare and contrast different categories or time periods",
            "Use precise figures and data from the visual",
        ],
    },
    {
        title: "Body Paragraph 2",
        points: [
            "Continue with detailed description of remaining data",
            "Focus on different aspects or time periods",
            "Make relevant comparisons between data points",
        ],
    },
];

// Customized outlines based on chart type
const outlinesByChartType: Record<string, Task1OutlineSection[]> = {
    "bar-charts": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the bar chart",
                "Mention what the chart compares (categories, time periods, etc.)",
            ],
        },
        {
            title: "Overview",
            points: [
                "Identify the highest and lowest values",
                "Note the overall pattern or ranking of categories",
                "Mention any significant differences between categories",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe the highest-performing categories with specific figures",
                "Compare the top categories and explain the differences",
                "Use precise data to support your descriptions",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Describe the lower-performing categories",
                "Make comparisons between all categories",
                "Highlight any notable patterns or exceptions",
            ],
        },
    ],
    "line-charts": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the line graph",
                "Mention the time period and what is being measured",
            ],
        },
        {
            title: "Overview",
            points: [
                "Describe the overall trends (increasing, decreasing, stable)",
                "Identify peak and lowest points",
                "Note any significant changes or turning points",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe the trend in the first half of the time period",
                "Include specific figures and dates",
                "Compare different lines if multiple data series exist",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Describe the trend in the second half of the time period",
                "Highlight any changes or reversals in trends",
                "Conclude with final figures and overall patterns",
            ],
        },
    ],
    "pie-charts": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the pie chart(s)",
                "Mention what the chart shows (percentages, proportions)",
            ],
        },
        {
            title: "Overview",
            points: [
                "Identify the largest and smallest segments",
                "Note any segments that are roughly equal",
                "Mention the most significant patterns or distributions",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe the largest segments with precise percentages",
                "Compare the major categories",
                "Group similar-sized segments if appropriate",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Describe the smaller segments",
                "Make final comparisons between all categories",
                "Summarize the overall distribution pattern",
            ],
        },
    ],
    "tables": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the table",
                "Mention what information the table presents",
            ],
        },
        {
            title: "Overview",
            points: [
                "Identify the highest and lowest figures",
                "Note the most significant patterns across rows/columns",
                "Highlight any notable trends or comparisons",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe data for specific categories or time periods",
                "Make comparisons using precise figures",
                "Focus on the most significant data points",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Continue with remaining data analysis",
                "Compare different categories or time periods",
                "Conclude with overall patterns or trends",
            ],
        },
    ],
    "process-diagrams": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the process/diagram",
                "Mention how many stages the process has",
            ],
        },
        {
            title: "Overview",
            points: [
                "Describe the overall process from start to finish",
                "Mention key stages or transformations",
                "Note if it's a cyclical or linear process",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe the initial stages of the process",
                "Explain the sequence and methods used",
                "Use appropriate sequencing language",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Describe the final stages of the process",
                "Explain the end result or final product",
                "Summarize the complete process",
            ],
        },
    ],
    "maps": [
        {
            title: "Introduction",
            points: [
                "Paraphrase the question about the maps",
                "Mention what changes are shown over time",
            ],
        },
        {
            title: "Overview",
            points: [
                "Describe the most significant changes",
                "Note new developments or removed features",
                "Mention overall transformation pattern",
            ],
        },
        {
            title: "Body Paragraph 1",
            points: [
                "Describe changes in one area or aspect",
                "Use appropriate location and direction language",
                "Compare the before and after states",
            ],
        },
        {
            title: "Body Paragraph 2",
            points: [
                "Describe changes in other areas",
                "Continue with spatial descriptions and comparisons",
                "Conclude with overall development pattern",
            ],
        },
    ],
};

export function getTask1Outline(questionType?: string): Task1OutlineSection[] {
    if (questionType && outlinesByChartType[questionType]) {
        return outlinesByChartType[questionType];
    }

    return task1BaseOutline;
}