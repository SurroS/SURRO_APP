export interface Question {
  id: number;
  text: string;
  type: 'yesno' | 'text'; // Can expand later if needed
}

export const experienceQuestions: Question[] = [
  {
    id: 1,
    text: "Did you have a positive experience?",
    type: "yesno",
  },
  {
    id: 2,
    text: "What did you enjoy most?",
    type: "text",
  },
  {
    id: 3,
    text: "Any suggestions for improvement?",
    type: "text",
  },
];
