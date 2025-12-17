'use client';

import React from 'react';
import { Question } from '@/types/index';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { QuestionItem } from './QuestionItem';
import styles from './DynamicForm.module.css';

interface Props {
  questions: Question[];
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onAddQuestion: () => void;
  onAddChild: (id: string) => void;
  onSubmit: (questions: Question[]) => void;
  onReorderQuestions: (questions: Question[]) => void;
  showSubmission: boolean;
  submittedQuestions?: Question[];
}

export const DynamicForm: React.FC<Props> = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onAddChild,
  onSubmit,
  onReorderQuestions,
  showSubmission,
  submittedQuestions,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId))
      return;

    const reordered = Array.from(questions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    onReorderQuestions(reordered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(questions);
  };

  if (showSubmission && submittedQuestions) {
    return (
      <div className={styles.submissionView}>
        <h2>Submitted!</h2>
        <SubmissionViewer questions={submittedQuestions} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Questions</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided, snapshot) => (
            <div
              className={`${styles.questionsContainer} ${
                snapshot.isDraggingOver ? styles.draggingOver : ''
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {questions.length === 0 ? (
                <p>No questions yet</p>
              ) : (
                questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${styles.draggableQuestion} ${
                          snapshot.isDragging ? styles.dragging : ''
                        }`}
                      >
                        <QuestionItem
                          question={question}
                          onUpdateQuestion={onUpdateQuestion}
                          onDeleteQuestion={onDeleteQuestion}
                          onAddChild={onAddChild}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className={styles.formActions}>
        <button type="button" onClick={onAddQuestion} className={styles.addQuestionBtn}>
          + Add Question
        </button>
        <button type="submit" className={styles.submitBtn} disabled={questions.length === 0}>
          Submit
        </button>
      </div>
    </form>
  );
};


interface Props2 {
  questions: Question[];
}

const SubmissionViewer: React.FC<Props2> = ({ questions }) => (
  <div className={styles.submissionViewer}>
    {questions.map((q) => (
      <QViewer key={q.id} question={q} />
    ))}
  </div>
);

interface Props3 {
  question: Question;
}

const QViewer: React.FC<Props3> = ({ question }) => (
  <div className={styles.questionViewer} style={{ marginLeft: `${question.depth * 30}px` }}>
    <div className={styles.questionDisplay}>
      <span>{question.number}</span>
      <span>{question.text}</span>
    </div>
    {question.answer && (
      <div className={styles.answer}>
        <strong>Answer:</strong> {question.answer}
      </div>
    )}
    {question.children.length > 0 && (
      <div>
        {question.children.map((child) => (
          <QViewer key={child.id} question={child} />
        ))}
      </div>
    )}
  </div>
);
