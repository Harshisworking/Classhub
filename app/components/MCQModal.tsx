'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestApiService } from '../services/TestApiService';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  answer: string; // Exact answer string
}

interface McqTestModalProps {
  testId: number;
  initialRemainingSeconds: number;
  title: string;
  isCompleted?: boolean;
  onClose: () => void;
}

export const McqTestModal: React.FC<McqTestModalProps> = ({
  testId,
  initialRemainingSeconds,
  title,
  isCompleted = false,
  onClose,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialRemainingSeconds);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stores selected string answers: { [questionId]: "Selected Option String" }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const [showResult, setShowResult] = useState(isCompleted);
  const [scoreStats, setScoreStats] = useState({ correct: 0, total: 0, percentage: 0 });

  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const api = TestApiService.getInstance();
        
        // Fetch questions response (or full submission payload if completed)
        const response = await fetch(`/api/student/tests/${testId}`);
        const data = await response.json();
        
        const qList: Question[] = data.data?.questions || [];
        setQuestions(qList);

        // If opening an already completed test, parse saved student answers
        if (isCompleted || data.data?.isSubmitted) {
          setShowResult(true);
          let savedAnswersMap: Record<number, string> = {};

          if (data.data?.studentAnswers) {
            try {
              const parsedArray: string[] = typeof data.data.studentAnswers === 'string'
                ? JSON.parse(data.data.studentAnswers)
                : data.data.studentAnswers;

              qList.forEach((q, idx) => {
                if (parsedArray[idx]) {
                  savedAnswersMap[q.id] = parsedArray[idx];
                }
              });
            } catch (e) {
              console.error("Error parsing saved student answers:", e);
            }
          }

          setSelectedAnswers(savedAnswersMap);
          calculateAndSetScore(qList, savedAnswersMap);
        }
      } catch (error) {
        console.error("Failed to load test questions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, isCompleted]);

  useEffect(() => {
    if (showResult) return;

    if (timeLeft <= 0 && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      processAndSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const calculateAndSetScore = (qList: Question[], answersMap: Record<number, string>) => {
    let correctCount = 0;
    qList.forEach((q) => {
      const chosenText = answersMap[q.id];
      if (chosenText && String(chosenText).trim() === String(q.answer).trim()) {
        correctCount++;
      }
    });

    const total = qList.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    setScoreStats({ correct: correctCount, total, percentage });
    return { correct: correctCount, total, percentage };
  };

  const processAndSubmit = async (isAuto = false) => {
    setIsSubmitting(true);
    const api = TestApiService.getInstance();
    
    const stats = calculateAndSetScore(questions, selectedAnswers);
    
    const ansList = questions.map((q) => selectedAnswers[q.id] || "");

    await api.submitTest(testId, stats.percentage, ansList);
    
    setIsSubmitting(false);
    setShowResult(true);

    if (isAuto) {
      alert("Time has expired! Your test results are shown below.");
    }
  };

  const handleOptionSelect = (questionId: number, selectedText: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedText,
    }));
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">Test ID: #{testId}</p>
          </div>
          {!showResult && (
            <div className="text-lg font-mono font-bold text-yellow-400 bg-gray-800 border border-gray-700 px-4 py-1.5 rounded-lg flex items-center gap-2">
              <span>⏱️</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 text-gray-400">
              Loading details...
            </div>
          ) : showResult ? (
            /* ==================== RESULT SUMMARY & REVIEW SCREEN ==================== */
            <div className="space-y-6">
              {/* Score Summary Box */}
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6 text-center flex flex-col items-center">
                <span className="text-4xl mb-2">🎉</span>
                <h4 className="text-2xl font-bold text-white mb-1">Test Results</h4>
                <p className="text-gray-400 text-sm mb-4">Here is your performance breakdown:</p>
                
                <div className="flex justify-center gap-6 w-full max-w-sm">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex-1">
                    <p className="text-xs text-gray-400">Score</p>
                    <p className="text-xl font-bold text-blue-400">{scoreStats.percentage}%</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex-1">
                    <p className="text-xs text-gray-400">Correct Answers</p>
                    <p className="text-xl font-bold text-green-400">{scoreStats.correct} / {scoreStats.total}</p>
                  </div>
                </div>
              </div>

              {/* Question Breakdown List */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white">Question Review</h5>
                {questions.map((q, idx) => {
                  const chosenText = selectedAnswers[q.id];
                  const isCorrect = chosenText && String(chosenText).trim() === String(q.answer).trim();

                  return (
                    <div 
                      key={q.id} 
                      className={`p-4 rounded-xl border ${
                        isCorrect 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-red-500/5 border-red-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-gray-300">
                          Question {idx + 1}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-white font-medium mb-3">{q.questionText}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                          <span className="text-xs text-gray-400 block mb-1">You Chose:</span>
                          <span className={chosenText ? (isCorrect ? 'text-green-400 font-medium' : 'text-red-400 font-medium') : 'text-gray-500 italic'}>
                            {chosenText || "Not Answered"}
                          </span>
                        </div>
                        <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                          <span className="text-xs text-gray-400 block mb-1">Correct Answer:</span>
                          <span className="text-green-400 font-medium">{q.answer}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==================== ACTIVE QUESTION SCREEN ==================== */
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-blue-400">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  {selectedAnswers[currentQuestion?.id] && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      Answered
                    </span>
                  )}
                </div>

                <div className="bg-gray-800/40 p-5 rounded-lg border border-gray-800 mb-6">
                  <h4 className="text-lg font-medium text-white">
                    {currentQuestion?.questionText}
                  </h4>
                </div>

                {/* Render Options */}
                <div className="space-y-3">
                  {currentQuestion?.options.map((optionText, optIndex) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === optionText;
                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                            : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/80 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={optionText}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(currentQuestion.id, optionText)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                        />
                        <span className="text-sm font-medium">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Page & Question Navigation */}
              <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] scrollbar-hide py-1 px-1">
                  {questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                            : isAnswered
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  Next →
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showResult ? "Close Window" : "Close & Pause"}
          </button>
          {!showResult && (
            <button
              onClick={() => processAndSubmit(false)}
              disabled={isSubmitting || isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default McqTestModal;