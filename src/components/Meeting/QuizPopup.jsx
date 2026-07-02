// src/components/Meeting/QuizPopup.jsx

import { memo, useCallback, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { stopQuizSession, submitQuizAnswer } from '../../services/meetingApi';

const LETTERS = ['A', 'B', 'C', 'D'];

export const QuizPopup = memo(function QuizPopup({ sessionId, question, isInstructor, results, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selected || submitted) return;
    try {
      await submitQuizAnswer(question.id, selected);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer.');
    }
  }, [selected, submitted, question.id]);

  const handleStop = useCallback(async () => {
    try {
      await stopQuizSession(sessionId);
    } catch {
      // ignore
    }
    onClose();
  }, [sessionId, onClose]);

  const options = [
    ['A', question.optionA],
    ['B', question.optionB],
    ['C', question.optionC],
    ['D', question.optionD],
  ];

  const optionCount = {
    A: results?.optionACount ?? 0,
    B: results?.optionBCount ?? 0,
    C: results?.optionCCount ?? 0,
    D: results?.optionDCount ?? 0,
  };
  const totalAnswers = results?.totalAnswers ?? 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">
              {isInstructor ? 'AI Quiz (Live)' : 'Quick Question'}
            </p>
            <h3 className="text-white font-semibold text-lg">Answer the question</h3>
          </div>
          {isInstructor && (
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </header>

        <div className="px-5 py-4">
          <p className="text-zinc-100 text-base mb-4">{question.questionText}</p>

          <div className="space-y-2">
            {options.map(([letter, text]) => {
              const isSelected = selected === letter;
              const count = optionCount[letter];
              const pct = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
              return (
                <button
                  key={letter}
                  disabled={submitted && !isInstructor}
                  onClick={() => !submitted && setSelected(letter)}
                  className={`relative w-full text-left px-4 py-3 rounded-lg border transition-colors overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/10 bg-zinc-800 hover:bg-zinc-700'
                  } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {isInstructor && totalAnswers > 0 && (
                    <span
                      className="absolute inset-y-0 left-0 bg-indigo-500/20"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="text-sm text-zinc-100 flex-1">{text}</span>
                    {isInstructor && (
                      <span className="text-xs text-zinc-400">
                        {count} · {pct}%
                      </span>
                    )}
                    {submitted && isSelected && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
          {isInstructor ? (
            <>
              <p className="text-xs text-zinc-400">
                {totalAnswers} answer{totalAnswers === 1 ? '' : 's'} · {results?.correctAnswers ?? 0} correct
              </p>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md"
              >
                Stop & close
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-zinc-400">
                {submitted ? 'Answer submitted ✓' : 'Pick one option and submit.'}
              </p>
              <button
                disabled={!selected || submitted}
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md"
              >
                {submitted ? 'Submitted' : 'Submit answer'}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
});
