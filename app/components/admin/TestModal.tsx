'use client';

import React, { useState } from 'react';

export interface Subject {
  id: number;
  name: string;
}

interface QuestionInput {
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
}

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
  subjects: Subject[];
}

export function TestModal({ isOpen, onClose, studentId, studentName, subjects }: TestModalProps) {
  const [title, setTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [maxScore, setMaxScore] = useState<number>(100);
  const [duration, setDuration] = useState<number>(30); 

  const [testFormat, setTestFormat] = useState<'TEXT' | 'PDF'>('TEXT');
  const [mcqInputMode, setMcqInputMode] = useState<'MANUAL' | 'JSON'>('MANUAL');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [questions, setQuestions] = useState<QuestionInput[]>([
    { questionText: '', option1: '', option2: '', option3: '', option4: '', answer: 'option1' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionText: '', option1: '', option2: '', option3: '', option4: '', answer: 'option1' }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionInput, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleParseJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of questions.');
      }

      const formattedQuestions = parsed.map((q: any, index: number) => {
        if (!q.questionText || !q.option1 || !q.option2 || !q.option3 || !q.option4 || q.answer === undefined) {
          throw new Error(`Question at index ${index} is missing required fields.`);
        }

        // Determine which option the answer matches
        let answerKey = 'option1';
        const ansStr = String(q.answer);
        
        if (ansStr === String(q.option1)) answerKey = 'option1';
        else if (ansStr === String(q.option2)) answerKey = 'option2';
        else if (ansStr === String(q.option3)) answerKey = 'option3';
        else if (ansStr === String(q.option4)) answerKey = 'option4';
        else if (['option1', 'option2', 'option3', 'option4'].includes(ansStr)) answerKey = ansStr;

        return {
          questionText: String(q.questionText),
          option1: String(q.option1),
          option2: String(q.option2),
          option3: String(q.option3),
          option4: String(q.option4),
          answer: answerKey
        };
      });

      setQuestions(formattedQuestions);
      setJsonInput('');
      setMcqInputMode('MANUAL'); // Switch back to view/edit parsed questions
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSelectedSubjectId('');
    setMaxScore(100);
    setDuration(30);
    setTestFormat('TEXT');
    setMcqInputMode('MANUAL');
    setSelectedFile(null);
    setJsonInput('');
    setJsonError('');
    setQuestions([{ questionText: '', option1: '', option2: '', option3: '', option4: '', answer: 'option1' }]);
  };

  const handleAssignTest = async () => {
    setIsSubmitting(true);
    try {
      let response: Response;

      if (testFormat === 'PDF') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', 'TEST');
        formData.append('inputMode', 'PDF');
        formData.append('maxScore', maxScore.toString());
        formData.append('duration', duration.toString());
        formData.append('subjectId', selectedSubjectId);
        formData.append('studentId', studentId.toString());
        if (selectedFile) formData.append('file', selectedFile);

        response = await fetch('/api/admin/tests', {
          method: 'POST',
          body: formData,
        });
      } else {
        const payload = {
          title,
          type: 'TEST',
          inputMode: 'TEXT',
          maxScore: Number(maxScore),
          duration: Number(duration),
          subjectId: Number(selectedSubjectId),
          studentId,
          questions: questions.map((q) => ({
            questionText: q.questionText,
            option1: q.option1,
            option2: q.option2,
            option3: q.option3,
            option4: q.option4,
            answer: q[q.answer as keyof QuestionInput]
          }))
        };

        response = await fetch('/api/admin/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to create test');
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to assign test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMcqValid =
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.questionText.trim() !== '' &&
        q.option1.trim() !== '' &&
        q.option2.trim() !== '' &&
        q.option3.trim() !== '' &&
        q.option4.trim() !== ''
    );

  const isPdfValid = selectedFile !== null;

  const isFormValid =
    title.trim() !== '' &&
    selectedSubjectId !== '' &&
    duration > 0 &&
    (testFormat === 'TEXT' ? (mcqInputMode === 'MANUAL' && isMcqValid) : isPdfValid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Assign Test to {studentName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Format Selector Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Test Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTestFormat('TEXT')}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  testFormat === 'TEXT' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Interactive MCQ Test
              </button>
              <button
                type="button"
                onClick={() => setTestFormat('PDF')}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  testFormat === 'PDF' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                PDF Document Test
              </button>
            </div>
          </div>

          {/* Test Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Test Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                placeholder="e.g., Chapter 3 Quiz"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
              <select 
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="" disabled>Select subject...</option>
                {subjects?.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Duration (Minutes)</label>
              <input 
                type="number" 
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                placeholder="e.g., 30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Score</label>
              <input 
                type="number" 
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Dynamic Section based on Format */}
          {testFormat === 'PDF' ? (
            /* PDF Upload View */
            <div className="bg-gray-800/40 border border-gray-700 p-5 rounded-xl space-y-2">
              <label className="block text-sm font-medium text-gray-300">Upload Question Paper (PDF)</label>
              <p className="text-xs text-gray-400 mb-3">
                Students will download this PDF, complete the test, and submit their work.
              </p>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700 cursor-pointer"
              />
            </div>
          ) : (
            /* MCQ Questions View */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2">
                <div className="flex gap-4">
                  <button
                    onClick={() => setMcqInputMode('MANUAL')}
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                      mcqInputMode === 'MANUAL' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setMcqInputMode('JSON')}
                    className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                      mcqInputMode === 'JSON' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    JSON Upload
                  </button>
                </div>

                {mcqInputMode === 'MANUAL' && (
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Question
                  </button>
                )}
              </div>

              {mcqInputMode === 'JSON' ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">Paste your questions in a valid JSON array format.</p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                    placeholder={`[\n  {\n    "questionText": "Sample Question",\n    "option1": "A",\n    "option2": "B",\n    "option3": "C",\n    "option4": "D",\n    "answer": "B"\n  }\n]`}
                  />
                  {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
                  <button
                    onClick={handleParseJson}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold py-2 rounded-lg border border-gray-700 transition-colors"
                  >
                    Parse & Review Questions
                  </button>
                </div>
              ) : (
                <>
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-800/60 border border-gray-700 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-400">Question {idx + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Enter question prompt..."
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                      />

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {(['option1', 'option2', 'option3', 'option4'] as const).map((optKey, oIdx) => (
                          <div key={optKey} className="flex items-center gap-2 bg-gray-900 border border-gray-700/80 p-2 rounded-lg">
                            <input
                              type="radio"
                              name={`correct-ans-${idx}`}
                              checked={q.answer === optKey}
                              onChange={() => handleQuestionChange(idx, 'answer', optKey)}
                              className="accent-blue-500 cursor-pointer"
                              title="Select as correct answer"
                            />
                            <input
                              type="text"
                              placeholder={`Option ${oIdx + 1}`}
                              value={q[optKey]}
                              onChange={(e) => handleQuestionChange(idx, optKey, e.target.value)}
                              className="w-full bg-transparent text-white text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleAssignTest}
            disabled={!isFormValid || isSubmitting}
            className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              !isFormValid || isSubmitting
                ? 'bg-blue-600/50 text-white/50 border-blue-500/50 cursor-not-allowed'
                : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Assigning...' : 'Assign Test'}
          </button>
        </div>

      </div>
    </div>
  );
}