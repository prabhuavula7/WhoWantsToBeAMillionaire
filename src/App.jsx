import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from './components/HeaderBar';
import HomeScreen from './screens/HomeScreen';
import CreateQuizScreen from './screens/CreateQuizScreen';
import PlayMenuScreen from './screens/PlayMenuScreen';
import GameScreen from './screens/GameScreen';
import './index.css';
import useLocalStorage from './hooks/useLocalStorage';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizzes, setQuizzes] = useLocalStorage('quizzes', []);

  useEffect(() => {
    // ambient spotlight follows cursor — updates CSS vars used by .theme-wwtbam::before
    let raf = null;
    function onMove(e) {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const xPct = (e.clientX / window.innerWidth) * 100;
        const yPct = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--spot-x', `${xPct}%`);
        document.documentElement.style.setProperty('--spot-y', `${yPct}%`);
      });
    }
    function onLeave() {
      document.documentElement.style.setProperty('--spot-x', `50%`);
      document.documentElement.style.setProperty('--spot-y', `20%`);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function goPlayMenu() {
    setScreen('play');
    setEditingQuiz(null);
  }
  function startCreate() {
    setEditingQuiz(null);
    setScreen('create');
  }
  function startGame(quiz) {
    setSelectedQuiz(quiz);
    setScreen('game');
    setEditingQuiz(null);
  }
  function backToHome() {
    setScreen('home');
    setEditingQuiz(null);
  }

  function handleEdit(quiz) {
    setEditingQuiz(quiz);
    setScreen('create');
  }

  // Import a quiz JSON file, validate and map to internal shape, then open Create screen for editing
  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target.result));
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        const title = String(parsed.title || parsed.name || 'Imported Quiz');
        const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
        if (!rawQuestions.length) throw new Error('No questions found');

        const mapped = rawQuestions.slice(0, 15).map((q, idx) => {
          const text = q.question || q.text || '';
          const choices = q.answers || q.choices || q.choices || [];
          const normalizedChoices = Array.isArray(choices) ? choices.slice(0, 4).concat(new Array(Math.max(0, 4 - (choices || []).length)).fill('')).slice(0,4) : ['', '', '', ''];
          const correctIndex = Number.isFinite(Number(q.correctIndex)) ? Number(q.correctIndex) : (Number.isFinite(Number(q.correct)) ? Number(q.correct) : 0);
          return { text: String(text || '').trim(), choices: normalizedChoices.map(c => String(c || '')), correctIndex: Math.max(0, Math.min(3, Number(correctIndex))), image: q.image || q.imageUrl || '' };
        });

        const hasValid = mapped.some(m => m.text && m.choices.every(c => c));
        if (!hasValid) throw new Error('Questions are missing text or choices');

        // Prepare editingQuiz (no id so it will be saved as new unless user edits)
        const editing = { title, questions: mapped };
        setEditingQuiz(editing);
        setScreen('create');
      } catch (err) {
        console.error('Import error', err);
        alert('Failed to import quiz JSON: ' + (err && err.message ? err.message : 'Invalid format'));
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen theme-wwtbam">
      <HeaderBar title="Who Wants to Be a Millionaire" subtitle="Family Quiz Builder" />
      <main className="py-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.36, ease: 'easeInOut' }}
          >
            {screen === 'home' && <HomeScreen onCreate={startCreate} onPlay={goPlayMenu} onEdit={goPlayMenu} />}
            {screen === 'create' && (
              <CreateQuizScreen
                onBack={editingQuiz ? () => { setScreen('play'); setEditingQuiz(null); } : backToHome}
                editingQuiz={editingQuiz}
                quizzes={quizzes}
                setQuizzes={setQuizzes}
              />
            )}
            {screen === 'play' && <PlayMenuScreen onBack={backToHome} onStart={(q) => startGame(q)} onEdit={(q) => handleEdit(q)} onImport={handleImportFile} quizzes={quizzes} setQuizzes={setQuizzes} />}
            {screen === 'game' && selectedQuiz && <GameScreen quiz={selectedQuiz} onBackToMenu={() => setScreen('play')} onExitToHome={backToHome} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="py-6 text-center text-xs text-indigo-100/60">
        Built for family game night — data saved locally in your browser.
      </footer>
    </div>
  );
}
