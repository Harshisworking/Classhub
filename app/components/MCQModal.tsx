'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestApiService } from '../services/TestApiService';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  answer: string;
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
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(isCompleted);
  const [scoreStats, setScoreStats] = useState({ correct: 0, total: 0, percentage: 0 });

  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const api = TestApiService.getInstance();
        const testData = await api.getTestQuestions(testId);
        
        const qList: Question[] = testData.questions || [];
        setQuestions(qList);

        if (isCompleted || testData.isSubmitted) {
          setShowResult(true);
          const savedAnswersMap: Record<number, string> = {};
          const studentAnswersList: string[] = testData.studentAnswers || [];

          qList.forEach((q, idx) => {
            if (studentAnswersList[idx] !== undefined && studentAnswersList[idx] !== null) {
              savedAnswersMap[q.id] = String(studentAnswersList[idx]);
            }
          });

          setSelectedAnswers(savedAnswersMap);

          if (testData.score !== undefined) {
            let correctCount = 0;
            qList.forEach((q) => {
              const chosen = savedAnswersMap[q.id];
              if (chosen && String(chosen).trim() === String(q.answer).trim()) {
                correctCount++;
              }
            });
            setScoreStats({
              correct: correctCount,
              total: qList.length,
              percentage: Math.round(testData.score),
            });
          } else {
            calculateAndSetScore(qList, savedAnswersMap);
          }
        }
      } catch (error) {
        console.error("Failed to load test details", error);
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border-t sm:border border-gray-800 rounded-t-2xl sm:rounded-xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-auto sm:max-h-[90vh]">
        
        {/* Header - Stacks on small mobile, row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 sm:p-5 border-b border-gray-800 gap-2 sm:gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{title}</h3>
              <p className="text-xs text-gray-400">Test ID: #{testId}</p>
            </div>

            {/* Mobile timer display inside header right corner */}
            {!showResult && (
              <div className="sm:hidden text-sm font-mono font-bold text-yellow-400 bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {!showResult && (
            <div className="hidden sm:flex text-lg font-mono font-bold text-yellow-400 bg-gray-800 border border-gray-700 px-4 py-1.5 rounded-lg items-center gap-2 self-start sm:self-auto">
              <span>⏱️</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 text-gray-400">
              Loading test data...
            </div>
          ) : showResult ? (
            /* ==================== RESULT SUMMARY SCREEN ==================== */
            <div className="space-y-6">
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 sm:p-6 text-center flex flex-col items-center">
                <span className="text-3xl sm:text-4xl mb-2">🎉</span>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">Test Results</h4>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">Here is your performance breakdown:</p>
                
                <div className="flex justify-center gap-4 w-full max-w-sm">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex-1">
                    <p className="text-xs text-gray-400">Score</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-400">{scoreStats.percentage}%</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex-1">
                    <p className="text-xs text-gray-400">Correct Answers</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400">{scoreStats.correct} / {scoreStats.total}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-base sm:text-lg font-semibold text-white">Question Review</h5>
                {questions.map((q, idx) => {
                  const chosenText = selectedAnswers[q.id];
                  const isCorrect = chosenText && String(chosenText).trim() === String(q.answer).trim();

                  return (
                    <div 
                      key={q.id} 
                      className={`p-3.5 sm:p-4 rounded-xl border ${
                        isCorrect 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-red-500/5 border-red-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-gray-300">
                          Question {idx + 1}
                        </span>
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-white text-sm sm:text-base font-medium mb-3">{q.questionText}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                          <span className="text-[10px] text-gray-400 block mb-0.5">You Chose:</span>
                          <span className={chosenText ? (isCorrect ? 'text-green-400 font-medium' : 'text-red-400 font-medium') : 'text-gray-500 italic'}>
                            {chosenText || "Not Answered"}
                          </span>
                        </div>
                        <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                          <span className="text-[10px] text-gray-400 block mb-0.5">Correct Answer:</span>
                          <span className="text-green-400 font-medium">{q.answer}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==================== ACTIVE TEST VIEW ==================== */
            <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-blue-400">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  {selectedAnswers[currentQuestion?.id] && (
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      Answered
                    </span>
                  )}
                </div>

                <div className="bg-gray-800/40 p-4 sm:p-5 rounded-lg border border-gray-800 mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-medium text-white break-words">
                    {currentQuestion?.questionText}
                  </h4>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {currentQuestion?.options.map((optionText, optIndex) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === optionText;
                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
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
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium break-words">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Bar - Redesigned for Mobile (Prev/Next stacked or flexed cleanly) */}
              <div className="pt-3 border-t border-gray-800/80 flex flex-col gap-3">
                {/* Horizontal Question Badge Selector */}
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto w-full scrollbar-hide py-1">
                  {questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
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

                {/* Prev & Next Buttons Row */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex-1 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors text-center"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="flex-1 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors text-center"
                  >
                    Next →
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-gray-800 flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showResult ? "Close Window" : "Close & Pause"}
          </button>
          {!showResult && (
            <button
              onClick={() => processAndSubmit(false)}
              disabled={isSubmitting || isLoading}
              className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs sm:text-sm transition-colors disabled:opacity-50"
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