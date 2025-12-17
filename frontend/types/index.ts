export interface Question {
  id: string;
  number: string;
  text: string;
  type: 'short-answer' | 'true-false';
  answer?: string;
  children: Question[];
  depth: number;
}

export interface FormData {
  questions: Question[];
}

export interface SubmittedQuestion extends Question {
  isSubmitted: boolean;
}
