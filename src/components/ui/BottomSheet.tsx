import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const sheetVariants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring" as const, damping: 30, stiffness: 300 } },
  exit: { y: "100%", transition: { duration: 0.2 } }
};

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'var(--safe-bottom)' }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            {title && (
              <h3 className="font-display font-bold text-lg px-5 pb-3">{title}</h3>
            )}
            <div className="px-5 pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
