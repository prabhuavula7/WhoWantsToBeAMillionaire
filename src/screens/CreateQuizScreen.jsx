import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import useLocalStorage from '../hooks/useLocalStorage';

function emptyQuestion() {
  return { text: '', choices: ['', '', '', ''], correctIndex: 0, image: '' };
}

export default function CreateQuizScreen({ onBack, editingQuiz, quizzes: propQuizzes, setQuizzes: propSetQuizzes }) {
  // Prefer quizzes passed from App (single source of truth). Fall back to local hook when not provided.
  const [localQuizzes, localSetQuizzes] = useLocalStorage('quizzes', []);
  const quizzes = propQuizzes !== undefined ? propQuizzes : localQuizzes;
  const setQuizzes = propSetQuizzes !== undefined ? propSetQuizzes : localSetQuizzes;
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);

  // If editingQuiz is provided, initialize form with its data
  useEffect(() => {
    if (editingQuiz) {
      setTitle(editingQuiz.title || '');
      setQuestions(
        (editingQuiz.questions || []).map((q) => ({
          text: q.text || '',
          choices: q.choices && q.choices.length === 4 ? q.choices.slice() : ['', '', '', ''],
          correctIndex: Number(q.correctIndex || 0),
          image: q.image || q.imageUrl || ''
        }))
      );
    } else {
      // when not editing, ensure a fresh blank question exists
      setTitle('');
      setQuestions([emptyQuestion()]);
    }
  }, [editingQuiz]);

  function updateQuestion(i, patch) {
    setQuestions((q) => {
      const copy = q.slice();
      copy[i] = { ...copy[i], ...patch };
      return copy;
    });
  }

  // Accept either a URL (string) or a File object; File will be read as data URL and stored inline
  function updateImage(qIdx, fileOrUrl) {
    if (!fileOrUrl) {
      updateQuestion(qIdx, { image: '' });
      return;
    }
    if (typeof fileOrUrl === 'string') {
      updateQuestion(qIdx, { image: fileOrUrl });
      return;
    }
    // File -> read as data URL
    const f = fileOrUrl;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateQuestion(qIdx, { image: ev.target.result });
    };
    reader.readAsDataURL(f);
  }

  // Import a quiz JSON file while on the Create/Edit screen — populate title & questions for editing
  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target.result));
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        const titleVal = String(parsed.title || parsed.name || 'Imported Quiz');
        const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
        if (!rawQuestions.length) throw new Error('No questions found');

        const mapped = rawQuestions.slice(0, 15).map((q) => {
          const text = q.question || q.text || '';
          const choices = q.answers || q.choices || [];
          const normalizedChoices = Array.isArray(choices) ? choices.slice(0, 4).concat(new Array(Math.max(0, 4 - choices.length)).fill('')).slice(0,4) : ['', '', '', ''];
          const ci = Number.isFinite(Number(q.correctIndex)) ? Number(q.correctIndex) : (Number.isFinite(Number(q.correct)) ? Number(q.correct) : 0);
          return { text: String(text || '').trim(), choices: normalizedChoices.map(c => String(c || '')), correctIndex: Math.max(0, Math.min(3, Number(ci))), image: q.image || q.imageUrl || '' };
        });

        const hasValid = mapped.some(m => m.text && m.choices.every(c => c));
        if (!hasValid) throw new Error('Questions are missing text or choices');

        setTitle(titleVal);
        setQuestions(mapped.length ? mapped : [emptyQuestion()]);
        alert(`Imported ${mapped.length} question(s). You can now edit or add images before saving.`);
      } catch (err) {
        console.error('Import error', err);
        alert('Failed to import quiz JSON: ' + (err && err.message ? err.message : 'Invalid format'));
      }
    };
    reader.onerror = () => alert('Failed to read file');
    reader.readAsText(file);
  }

  function updateChoice(qIdx, cIdx, value) {
    setQuestions((q) => {
      const copy = q.slice();
      const choices = copy[qIdx].choices.slice();
      choices[cIdx] = value;
      copy[qIdx] = { ...copy[qIdx], choices };
      return copy;
    });
  }

  function addQuestion() {
    setQuestions((q) => [...q, emptyQuestion()]);
  }

  function removeQuestion(i) {
    setQuestions((q) => q.filter((_, idx) => idx !== i));
  }

  function saveQuiz() {
    const trimmedTitle = title.trim() || 'Untitled Quiz';
    const validQuestions = questions
      .map((qq) => ({
        text: qq.text.trim(),
        choices: qq.choices.map((c) => c.trim()),
        correctIndex: Number(qq.correctIndex),
        image: qq.image
      }))
      .filter((qq) => qq.text && qq.choices.every((c) => c))
      .slice(0, 15); // limit to 15

    if (!validQuestions.length) {
      alert('Please add at least one valid question (all choices filled).');
      return;
    }

    if (editingQuiz && editingQuiz.id) {
      // update existing quiz
      const updated = quizzes.map((q) => (q.id === editingQuiz.id ? { ...q, title: trimmedTitle, questions: validQuestions } : q));
      setQuizzes(updated);
      alert('Quiz updated locally.');
      if (onBack) onBack();
      return;
    }

    const id = Date.now().toString(36);
    setQuizzes([...quizzes, { id, title: trimmedTitle, questions: validQuestions }]);
    // reset form
    setTitle('');
    setQuestions([emptyQuestion()]);
    alert('Quiz saved locally.');
    if (onBack) onBack();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm font-bold bg-wwtbam-gold text-black rounded-md px-3 py-1 shadow-sm hover:shadow-md">← Back</button>
          <h2 className="text-xl font-semibold text-slate-900 mb-0">{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-md px-3 py-1 cursor-pointer hover:bg-slate-100">
            Import JSON
            <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleImportFile(f); e.currentTarget.value = ''; }} />
          </label>
        </div>
      </div>

      <div className="rounded-xl bg-white/95 shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800">Quiz Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-wwtbam-indigo focus:border-wwtbam-indigo"
            placeholder="Family Night: Capitals, Movies..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-slate-800">Questions</h3>
            <div className="text-sm text-slate-600">{questions.length} (max 15)</div>
          </div>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="border border-slate-200 rounded-md p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-slate-800">Question {qi + 1}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeQuestion(qi)}
                      disabled={questions.length === 1}
                      className="text-sm text-red-600 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                  className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-wwtbam-indigo focus:border-wwtbam-indigo"
                  placeholder="Enter the question text"
                  rows={2}
                />

                {/* Image support: URL or upload - styled upload control to avoid browser 'No file chosen' showing in low contrast */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image (optional)</label>
                  {q.image ? (
                    <div className="flex items-start gap-3">
                      <img src={q.image} alt={`Question ${qi + 1}`} className="w-40 h-28 object-contain rounded-md border border-slate-200" />
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={q.image}
                          onChange={(e) => updateQuestion(qi, { image: e.target.value })}
                          className="rounded-md border border-slate-200 px-2 py-1 text-slate-800"
                          placeholder="Image URL"
                        />
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1 cursor-pointer text-sm text-slate-800 hover:bg-slate-100">
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && updateImage(qi, e.target.files[0])} />
                          </label>
                          <button type="button" onClick={() => updateImage(qi, '')} className="text-sm text-red-600">Remove Image</button>
                          <span className="text-sm text-slate-600">(Uploaded)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={q.image}
                        onChange={(e) => updateQuestion(qi, { image: e.target.value })}
                        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-900 placeholder:text-slate-400"
                        placeholder="Paste image URL or upload below"
                      />
                      <label className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1 cursor-pointer text-sm text-slate-800 hover:bg-slate-100">
                        Choose file
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && updateImage(qi, e.target.files[0])} />
                      </label>
                      <span className="text-sm text-slate-600">No file chosen</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.choices.map((c, ci) => (
                    <label key={ci} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={Number(q.correctIndex) === ci}
                        onChange={() => updateQuestion(qi, { correctIndex: ci })}
                        className="focus:ring-wwtbam-indigo text-wwtbam-gold"
                      />
                      <input
                        value={c}
                        onChange={(e) => updateChoice(qi, ci, e.target.value)}
                        placeholder={`Choice ${ci + 1}`}
                        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-900 placeholder:text-slate-400 focus:ring-wwtbam-indigo focus:border-wwtbam-indigo"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <PrimaryButton onClick={addQuestion} variant="primary" neon className="px-4">Add Question</PrimaryButton>
            <PrimaryButton onClick={saveQuiz} variant="primary" className="px-4 bg-emerald-600 text-white shadow-md hover:bg-emerald-700">{editingQuiz ? 'Save Changes' : 'Save Quiz'}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
