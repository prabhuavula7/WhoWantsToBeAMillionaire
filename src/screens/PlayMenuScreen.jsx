import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import useLocalStorage from '../hooks/useLocalStorage';

export default function PlayMenuScreen({ onBack, onStart, onEdit, quizzes: propQuizzes, setQuizzes: propSetQuizzes, onImport }) {
  // Prefer quizzes passed from App (single source of truth). Fall back to local hook when not provided.
  const [localQuizzes, localSetQuizzes] = useLocalStorage('quizzes', []);
  const quizzes = propQuizzes !== undefined ? propQuizzes : localQuizzes;
  const setQuizzes = propSetQuizzes !== undefined ? propSetQuizzes : localSetQuizzes;

  function deleteQuiz(id) {
    if (!confirm('Delete this quiz?')) return;
    setQuizzes(quizzes.filter((q) => q.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={onBack} className="text-sm font-semibold text-wwtbam-gold underline rounded px-2 py-1 hover:bg-wwtbam-gold/6">← Back</button>
        <h2 className="text-xl font-semibold text-white">Choose a Quiz</h2>
        <div className="flex items-center gap-2">
          {/* Import JSON quiz */}
          <label className="inline-flex items-center gap-2 bg-white/6 border border-white/10 text-white rounded-md px-3 py-1 cursor-pointer hover:bg-white/10">
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f && onImport) onImport(f);
                // clear the input so same file can be re-selected if needed
                e.currentTarget.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {quizzes.length === 0 && (
          <div className="glass-panel p-6 text-center text-indigo-100">
            No saved quizzes yet. Create one first.
          </div>
        )}

        {quizzes.map((quiz) => (
          <div key={quiz.id} className="glass-panel p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{quiz.title}</div>
              <div className="text-sm text-indigo-100/80">{quiz.questions.length} question(s)</div>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={() => onStart(quiz)} neon>
                Play
              </PrimaryButton>
              <PrimaryButton onClick={() => onEdit && onEdit(quiz)} variant="ghost" className="text-indigo-100/90 border-white/6">
                Edit
              </PrimaryButton>
              <PrimaryButton onClick={() => deleteQuiz(quiz.id)} variant="ghost" className="text-red-400 border-red-800/10 hover:bg-red-700/6">
                Delete
              </PrimaryButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
