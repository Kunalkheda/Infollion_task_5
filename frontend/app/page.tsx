'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types/index';
import { DynamicForm } from '@/components/DynamicForm';
import {
  createNewQuestion,
  updateQuestionNumbers,
  deleteQuestion,
  updateQuestion,
  saveToLocalStorage,
  loadFromLocalStorage,
  addChildQuestion,
} from '@/utils/questionUtils';
import { apiClient } from '@/utils/apiClient';
import styles from './page.module.css';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved.length > 0) setQuestions(saved);
    setLoaded(true);
    checkApi();
  }, []);

  useEffect(() => {
    if (loaded) saveToLocalStorage(questions);
  }, [questions, loaded]);

  const checkApi = async () => {
    try {
      const ok = await apiClient.checkHealth();
      setApiReady(ok);
    } catch {
      setApiReady(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ = createNewQuestion('', 0, questions.length);
    const updated = [...questions, newQ];
    const numbered = updateQuestionNumbers(updated);
    setQuestions(numbered);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    const updated = updateQuestion(questions, id, updates);
    setQuestions(updated);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = deleteQuestion(questions, id);
    const numbered = updateQuestionNumbers(updated);
    setQuestions(numbered);
  };

  const handleAddChild = (parentId: string) => {
    const updated = addChildQuestion(questions, parentId);
    setQuestions(updated);
  };

  const handleSubmit = async (q: Question[]) => {
    setSubmitting(true);
    setErr('');
    setMsg('');

    try {
      if (apiReady) {
        await apiClient.submitQuestions(q);
        setMsg('Submitted to backend!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      setSubmitted(q);
      setShowSubmit(true);
    }
  };

  const handleReorderQuestions = (reordered: Question[]) => {
    const numbered = updateQuestionNumbers(reordered);
    setQuestions(numbered);
  };

  const handleReset = () => {
    setShowSubmit(false);
    setSubmitted([]);
    setMsg('');
  };

  if (!loaded) {
    return <div className={styles.container}><div>Loading...</div></div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {apiReady && <div className={styles.statusBanner}>✓ Backend connected</div>}
        {msg && <div className={styles.successMessage}>{msg}</div>}
        {err && <div className={styles.errorMessage}>{err}</div>}

        {showSubmit ? (
          <div className={styles.submissionContainer}>
            <DynamicForm
              questions={questions}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onAddQuestion={handleAddQuestion}
              onAddChild={handleAddChild}
              onSubmit={handleSubmit}
              onReorderQuestions={handleReorderQuestions}
              showSubmission={showSubmit}
              submittedQuestions={submitted}
            />
            <button onClick={handleReset} className={styles.resetBtn} disabled={submitting}>
              ← Back to Edit
            </button>
          </div>
        ) : (
          <DynamicForm
            questions={questions}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddQuestion={handleAddQuestion}
            onAddChild={handleAddChild}
            onSubmit={handleSubmit}
            onReorderQuestions={handleReorderQuestions}
            showSubmission={showSubmit}
          />
        )}
      </div>
    </main>
  );
}
