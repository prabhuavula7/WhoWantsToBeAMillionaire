import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { motion } from 'framer-motion';
import prizeTiers from '../data/prizeTiers';

export default function HomeScreen({ onCreate, onPlay, onEdit }) {
  const topPreview = prizeTiers.slice(-6).reverse(); // show top 6 tiers as a preview

  return (
    <div className="w-full">
      <section className="min-h-[60vh] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass-panel home-panel p-8 h-full"
          >
            <div className="flex items-start gap-4">
              <img src="/wwtbam-logo.svg" alt="logo" className="h-16 w-16 logo-soften neon-glow" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Who Wants to Be a Millionaire</h1>
                <p className="text-indigo-100/80 mt-1">Family Quiz Builder — cinematic, fast, and fair.</p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/6 pt-6">
              <h2 className="text-lg font-semibold text-indigo-50 mb-3">Quick Rules</h2>
              <ul className="list-none space-y-2 text-sm text-indigo-100/80">
                <li>• Four choices per question. Pick the best answer and confirm when prompted.</li>
                <li>• Use lifelines anytime before confirming: 50:50 removes two wrong options, Ask Audience, Phone a Friend.</li>
                <li>• Correct answers advance you up the prize ladder. One incorrect answer ends the game.</li>
                <li>• Safety nets at questions 5 and 10 guarantee minimum winnings if you pass them.</li>
              </ul>

              <h3 className="mt-6 text-md font-semibold text-indigo-50">Scoring</h3>
              <div className="mt-2 text-sm text-indigo-100/80 space-y-2">
                <div>• <span className="font-semibold text-indigo-50">$1,000</span> — guaranteed when you reach tier 5.</div>
                <div>• <span className="font-semibold text-indigo-50">$32,000</span> — guaranteed when you reach tier 10.</div>
                <div>• <span className="font-semibold text-indigo-50">$1,000,000</span> — top prize on tier 15.</div>
              </div>

              <p className="mt-6 text-sm text-indigo-100/70 italic">Tip: Be deliberate. Use lifelines strategically and confirm only when you're ready — family debates encouraged!</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <PrimaryButton onClick={onCreate} className="w-full sm:w-auto" neon>
                Create Quiz
              </PrimaryButton>
              <PrimaryButton onClick={onPlay} className="w-full sm:w-auto" neon>
                Play Quiz
              </PrimaryButton>
              <PrimaryButton onClick={onEdit} className="w-full sm:w-auto" variant="ghost">
                Edit Quiz
              </PrimaryButton>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
            className="p-8 flex items-center justify-center h-full"
          >
            <div className="glass-panel home-panel w-full h-full p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-white">How to Win</h3>
              <p className="mt-3 text-sm text-indigo-100/80">Answer progressively harder questions to climb the prize ladder. Survive to the top to claim the million — teamwork and strategy win the night.</p>

              <div className="mt-6 w-full max-w-sm">
                <div className="rounded-lg p-4 bg-gradient-to-r from-black/20 to-white/2 border border-white/6">
                  <div className="text-sm text-indigo-100/80">Lifelines</div>
                  <ul className="mt-2 text-sm text-indigo-50 font-medium space-y-2">
                    <li>50:50 — removes two incorrect answers.</li>
                    <li>Ask Audience — poll the room for a majority pick.</li>
                    <li>Phone a Friend — call someone for a quick hint.</li>
                  </ul>
                </div>

                <div className="mt-5 text-xs text-indigo-100/70">Accessible, family-friendly, and stored locally in your browser. No accounts required.</div>

                <div className="mt-6">
                  <div className="text-sm text-indigo-200 font-semibold mb-2">Prize ladder preview</div>
                  <div className="space-y-1">
                    {topPreview.map(t => (
                      <div key={t.id} className={`ladder-item ${t.id === 5 || t.id === 10 ? 'safe-net' : ''} ${t.id === 15 ? 'ultimate' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="text-xs sm:text-sm" style={t.id === 5 || t.id === 10 ? { color: 'rgb(var(--gold))', fontWeight: 700 } : t.id === 15 ? { color: 'rgb(var(--emerald))', fontWeight: 800 } : undefined}>{t.label}</div>
                          <div className="text-xs sm:text-sm">{t.id === 15 ? 'TOP' : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}
