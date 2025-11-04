import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmModal from './ConfirmModal';
import prizeTiers from '../data/prizeTiers';

export default function GameScreen({ quiz, onBackToMenu, onExitToHome }) {
  const totalTiers = prizeTiers.length;
  const qCount = quiz.questions.length;
  const offset = Math.max(0, totalTiers - qCount);
  const [current, setCurrent] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [usedAsk, setUsedAsk] = useState(false);
  const [usedPhone, setUsedPhone] = useState(false);
  const [hiddenChoices, setHiddenChoices] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [won, setWon] = useState(false);
  // reveal feedback states for showing correct/wrong color briefly
  const [revealedIdx, setRevealedIdx] = useState(null);
  const [revealResult, setRevealResult] = useState(null); // 'correct' | 'wrong' | null

  const currentTierIndex = offset + current;
  const currentTier = prizeTiers[currentTierIndex];

  const question = quiz.questions[current];

  // compute visible choice indices (preserve original indices for correctness)
  const visibleChoiceIndices = question.choices.map((_, i) => i).filter(i => !hiddenChoices.includes(i));

  function handle5050() {
    if (used5050) return;
    const correct = question.correctIndex;
    const wrongIndices = [0,1,2,3].filter((i) => i !== correct);
    // randomly pick two wrong indices to hide
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);
    setHiddenChoices(toHide);
    setUsed5050(true);
  }

  function handleAskAudience() {
    if (usedAsk) return;
    setUsedAsk(true);
    alert('Ask the audience: Gather the room and take a quick vote — majority usually helps!');
  }
  function handlePhoneFriend() {
    if (usedPhone) return;
    setUsedPhone(true);
    alert('Phone a friend: Ask a family member or friend for their opinion.');
  }

  function openConfirm(idx) {
    if (hiddenChoices.includes(idx)) return;
    // set selection first, then open the modal on next frame so the selection render is visible
    setSelectedIdx(idx);
    requestAnimationFrame(() => setConfirmOpen(true));
  }

  // reset selection when moving to a new question so the yellow glow doesn't persist
  useEffect(() => {
    setSelectedIdx(null);
    setRevealResult(null);
    setRevealedIdx(null);
    setHiddenChoices([]);
    setConfirmOpen(false);
  }, [current]);

  function finalizeAnswer() {
    // keep the chosen index locally so we can reveal correctly after clearing selection
    const choiceIdx = selectedIdx;
    // clear selection state and close the modal so the reveal is visible in-place
    setSelectedIdx(null);
    setConfirmOpen(false);

    const isCorrect = Number(choiceIdx) === Number(question.correctIndex);
    // show feedback color (correct/wrong) before advancing
    setRevealedIdx(choiceIdx);
    setRevealResult(isCorrect ? 'correct' : 'wrong');

    // keep the reveal visible for a short split-second (700ms) then advance/end
    setTimeout(() => {
      if (isCorrect) {
        if (current + 1 >= quiz.questions.length) {
          setWon(true);
          setGameOver({ winnings: currentTier.value, reason: 'WIN' });
        } else {
          setCurrent((c) => c + 1);
          setHiddenChoices([]);
          setSelectedIdx(null);
        }
      } else {
        let fallback = 0;
        if (current >= 10) fallback = 32000;
        else if (current >= 5) fallback = 1000;
        else fallback = 0;
        setGameOver({ winnings: fallback, reason: 'WRONG' });
      }

      // After advancing/finishing, clear reveal visuals after a short delay so user sees result
      setTimeout(() => {
        setRevealResult(null);
        setRevealedIdx(null);
      }, 250);
    }, 700);
  }

  function restartSame() {
    setCurrent(0);
    setUsed5050(false);
    setUsedAsk(false);
    setUsedPhone(false);
    setHiddenChoices([]);
    setConfirmOpen(false);
    setSelectedIdx(null);
    setGameOver(null);
    setWon(false);
  }

  const displayedTiers = useMemo(() => {
    return prizeTiers.slice().reverse();
  }, []);

  const usedList = [];
  if (used5050) usedList.push('50:50');
  if (usedAsk) usedList.push('Ask Audience');
  if (usedPhone) usedList.push('Phone a Friend');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <motion.div key={`question-${current}`} className={`flex-1 glass-panel question-panel text-white`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: 'easeInOut' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button onClick={onBackToMenu} className="text-sm font-semibold bg-white text-slate-900 rounded px-3 py-1 shadow-sm hover:shadow-md">← Back</button>
              <button onClick={onExitToHome} className="text-sm font-semibold bg-white text-slate-900 rounded px-3 py-1 shadow-sm hover:shadow-md">Exit Home</button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-indigo-200/70">Question {current + 1} of {quiz.questions.length}</div>
              <div className="text-xl font-semibold text-white mt-1">{question.text}</div>
              {question.image && (
                <div className="mt-3">
                  <img src={question.image} alt={`Question ${current + 1}`} className="w-full max-h-60 object-contain rounded-md border border-white/6 bg-black/6" />
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-200">Prize: <span className="font-semibold">{currentTier.label}</span></div>
              <div className="text-xs text-indigo-200/60 mt-1">Safety nets: $1,000 & $32,000</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleChoiceIndices.map((origIdx, visiblePos) => {
                const choice = question.choices[origIdx];
                const isRevealed = revealResult && revealedIdx === origIdx;
                // compute classes and inline styles for reveal state to guarantee visibility
                const classes = ['choice-btn'];
                let revealStyle = undefined;
                if (isRevealed && revealResult === 'correct') {
                  classes.push('choice-correct');
                  revealStyle = {
                    background: 'linear-gradient(90deg, rgba(220,252,235,0.16), rgba(255,255,255,0.02))',
                    borderColor: 'rgba(16,185,129,0.95)',
                    color: '#ffffff'
                  };
                } else if (isRevealed && revealResult === 'wrong') {
                  classes.push('choice-wrong');
                  revealStyle = {
                    background: 'linear-gradient(90deg, rgba(254,226,226,0.18), rgba(255,255,255,0.02))',
                    borderColor: 'rgba(239,68,68,0.95)',
                    color: '#ffffff'
                  };
                }
                const className = classes.filter(Boolean).join(' ');

                // label choices sequentially (A, B, C...) based on visible position
                const label = String.fromCharCode(65 + visiblePos);

                return (
                  <motion.button
                    key={origIdx}
                    layout
                    onClick={() => openConfirm(origIdx)}
                    disabled={gameOver}
                    className={className}
                    style={revealStyle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                  >
                    <div
                      className={`label ${isRevealed && revealResult === 'correct' ? 'label-emerald' : (isRevealed && revealResult === 'wrong' ? 'label-wrong' : '')}`}
                      style={isRevealed ? (revealResult === 'correct' ? { borderStyle: 'solid', borderColor: 'rgba(16,185,129,0.98)', borderWidth: '2px', boxShadow: '0 0 0 10px rgba(16,185,129,0.18)', zIndex: 3 } : (revealResult === 'wrong' ? { borderStyle: 'solid', borderColor: 'rgba(239,68,68,0.98)', borderWidth: '2px', boxShadow: '0 0 0 10px rgba(239,68,68,0.18)', zIndex: 3 } : undefined)) : undefined}
                    >
                      {label}
                    </div>
                    <div className="flex-1">{choice}</div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <PrimaryButton onClick={handle5050} disabled={used5050 || gameOver} className="px-3 py-2" variant="ghost">
                50:50
              </PrimaryButton>
              <PrimaryButton onClick={handleAskAudience} disabled={usedAsk || gameOver} className={`px-3 py-2 ${usedAsk ? 'opacity-50' : ''}`} variant="ghost">
                Ask Audience
              </PrimaryButton>
              <PrimaryButton onClick={handlePhoneFriend} disabled={usedPhone || gameOver} className={`px-3 py-2 ${usedPhone ? 'opacity-50' : ''}`} variant="ghost">
                Phone a Friend
              </PrimaryButton>
            </div>

            <div className="text-sm text-indigo-100">
              Used: <span className="font-semibold">{usedList.length ? usedList.join(', ') : 'None'}</span>
            </div>
          </div>
        </motion.div>

        <aside className="w-full lg:w-72 rounded-xl glass-panel p-4">
          <div className="text-sm text-indigo-200 font-semibold mb-2">Prize Ladder</div>
          <div className="space-y-1">
            {displayedTiers.map((tier) => {
              const tierIdx = tier.id - 1;
              const isCurrent = tierIdx === currentTierIndex;
              const isReached = tierIdx < currentTierIndex;
              const isSafeNet = tier.id === 5 || tier.id === 10;
              const isUltimate = tier.id === 15;
              return (
                <motion.div
                  key={tier.id}
                  className={`ladder-item ${isCurrent ? 'active' : ''} ${isSafeNet ? 'safe-net' : ''} ${isUltimate ? 'ultimate' : ''}`}
                  animate={isCurrent ? { scale: 1.01 } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center justify-between">
                    <div className={`text-xs sm:text-sm ${isCurrent ? 'text-white font-semibold' : isReached ? 'text-indigo-200' : 'text-indigo-200/70'}`} style={isSafeNet ? { color: 'rgb(var(--gold))', fontWeight: 700 } : isUltimate ? { color: 'rgb(var(--emerald))', fontWeight: 800 } : undefined}>
                      {tier.label}
                    </div>
                    <div className="flex items-center gap-2">
                      {isSafeNet && (
                        <div
                          className="badge"
                          title={tier.id === 5 ? 'Candy safe net' : 'Burger safe net'}
                          aria-label={tier.id === 5 ? 'Candy safe net' : 'Burger safe net'}
                        >
                          {tier.id === 5 ? '🍬 SAFE' : '🍔 SAFE'}
                        </div>
                      )}
                      {isUltimate && <div className="badge">★</div>}
                      <div className="text-xs sm:text-sm">{tier.id === 15 ? 'TOP' : ''}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4">
            <button onClick={onBackToMenu} className="text-sm font-semibold bg-white text-slate-900 rounded px-2 py-1 shadow-sm hover:shadow-md">Back to quiz select</button>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={confirmOpen}
        choiceText={selectedIdx != null ? question.choices[selectedIdx] : ''}
        selectedLabel={selectedIdx != null ? String.fromCharCode(65 + visibleChoiceIndices.indexOf(selectedIdx)) : ''}
        onConfirm={finalizeAnswer}
        onCancel={() => { setConfirmOpen(false); setSelectedIdx(null); }}
      />

      {gameOver && (
        <motion.div className="fixed inset-0 z-40 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
          <motion.div className="relative glass-panel rounded-lg max-w-lg w-full p-6" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28 }}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {won ? 'Congratulations! You won!' : 'Game Over'}
            </h3>
            <div className="text-indigo-200 mb-4">
              {won ? `You earned ${gameOver.winnings ? `$${gameOver.winnings.toLocaleString()}` : 'the top prize!'}` :
                `You earned ${gameOver.winnings ? `$${gameOver.winnings.toLocaleString()}` : '$0'}`}
            </div>
            <div className="flex gap-2 justify-end">
              <PrimaryButton onClick={restartSame} className="px-3 py-2" variant="ghost">Play Again</PrimaryButton>
              <PrimaryButton onClick={onBackToMenu} className="px-4 py-2" neon>Back to Quizzes</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
