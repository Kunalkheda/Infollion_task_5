import { Question } from '@/types/index';

const generateQuestionNumber = (parentNumber: string, childIndex: number) => {
  if (!parentNumber) return `Q${childIndex + 1}`;
  return `${parentNumber}.${childIndex + 1}`;
};

const generateId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createNewQuestion = (parentNumber = '', depth = 0, childIndex = 0): Question => ({
  id: generateId(),
  number: generateQuestionNumber(parentNumber, childIndex),
  text: '',
  type: 'short-answer',
  answer: '',
  children: [],
  depth,
});

const updateChildNumbers = (questions: Question[], parentNum: string): Question[] =>
  questions.map((q, i) => ({
    ...q,
    number: generateQuestionNumber(parentNum, i),
    children: updateChildNumbers(q.children, q.number),
  }));

export const updateQuestionNumbers = (questions: Question[]): Question[] =>
  questions.map((q, i) => ({
    ...q,
    number: generateQuestionNumber('', i),
    children: updateChildNumbers(q.children, `Q${i + 1}`),
  }));

export const saveToLocalStorage = (data: Question[]) => {
  try {
    localStorage.setItem('dynamicFormData', JSON.stringify(data));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
};

export const loadFromLocalStorage = (): Question[] => {
  try {
    const data = localStorage.getItem('dynamicFormData');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Storage load failed:', e);
    return [];
  }
};

export const deleteQuestion = (questions: Question[], qId: string): Question[] =>
  questions
    .filter((q) => q.id !== qId)
    .map((q) => ({
      ...q,
      children: deleteQuestion(q.children, qId),
    }));

export const updateQuestion = (questions: Question[], qId: string, updates: Partial<Question>): Question[] =>
  questions.map((q) => {
    if (q.id === qId) return { ...q, ...updates };
    return { ...q, children: updateQuestion(q.children, qId, updates) };
  });

export const flattenQuestions = (questions: Question[]): Question[] => {
  const result: Question[] = [];
  questions.forEach((q) => {
    result.push(q);
    if (q.children.length > 0) result.push(...flattenQuestions(q.children));
  });
  return result;
};

export const addChildQuestion = (questions: Question[], parentId: string): Question[] =>
  questions.map((q) => {
    if (q.id === parentId) {
      return {
        ...q,
        children: [...q.children, createNewQuestion(q.number, q.depth + 1, q.children.length)],
      };
    }
    return {
      ...q,
      children: addChildQuestion(q.children, parentId),
    };
  });
