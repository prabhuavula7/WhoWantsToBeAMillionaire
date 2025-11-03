import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../components/PrimaryButton';

export default function ConfirmModal({ open, choiceText, selectedLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/50" onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} />

          <motion.div
            className="relative glass-panel rounded-lg max-w-md w-full p-5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Is that your final answer?</h3>
            <p className="text-sm text-indigo-100/80 mb-4">You selected: <span className="font-medium">{choiceText}</span></p>
            {/* selected choice preview inside modal so selection is visible while overlayed */}
            <motion.div className="mb-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div className="choice-btn choice-selected" style={{ pointerEvents: 'none' }}>
                <div className={`label label-selected`}>{selectedLabel || ''}</div>
                <div className="flex-1">{choiceText}</div>
              </div>
            </motion.div>
            <div className="flex justify-end gap-2">
              <PrimaryButton onClick={onCancel} variant="danger" className="px-3 py-2">Cancel</PrimaryButton>
              <PrimaryButton onClick={onConfirm} variant="gold" className="px-4 py-2">Confirm</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
