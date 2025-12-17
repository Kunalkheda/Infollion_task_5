'use client';

import React from 'react';
import { Question } from '@/types/index';
import styles from './QuestionItem.module.css';

interface Props {
  question: Question;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onAddChild: (id: string) => void;
}

export const QuestionItem: React.FC<Props> = ({
  question,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddChild,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onUpdateQuestion(question.id, { text: e.target.value });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onUpdateQuestion(question.id, { type: e.target.value as 'short-answer' | 'true-false' });

  const handleAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onUpdateQuestion(question.id, { answer: e.target.value });

  const canAddChild = question.type === 'true-false' && question.answer === 'true';

  return (
    <div className={styles.questionItem} style={{ marginLeft: question.depth * 30 }}>
      <div className={styles.questionContent}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>{question.number}</span>
          <input
            type="text"
            placeholder="Your question here..."
            value={question.text}
            onChange={handleTextChange}
            className={styles.questionInput}
          />
        </div>

        <div className={styles.questionControls}>
          <select value={question.type} onChange={handleTypeChange} className={styles.typeSelect}>
            <option value="short-answer">Short Answer</option>
            <option value="true-false">True/False</option>
          </select>

          {question.type === 'true-false' && (
            <select
              value={question.answer || ''}
              onChange={handleAnswerChange}
              className={styles.answerSelect}
            >
              <option value="">Select Answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}

          {canAddChild && (
            <button onClick={() => onAddChild(question.id)} className={styles.addChildBtn}>
              + Add Sub-Question
            </button>
          )}

          <button onClick={() => onDeleteQuestion(question.id)} className={styles.deleteBtn}>
            ✕ Delete
          </button>
        </div>
      </div>

      {question.children.length > 0 && (
        <div className={styles.childrenContainer}>
          {question.children.map((child) => (
            <QuestionItem
              key={child.id}
              question={child}
              onUpdateQuestion={onUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};
