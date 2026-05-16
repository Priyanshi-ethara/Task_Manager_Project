import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '../../utils/helpers';

const Modal = ({ open, onClose, title, description, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className={cn(
              'relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/60',
              sizes[size]
            )}
          >
            <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-fuchsia-400/10 blur-3xl pointer-events-none" />
            <div className="relative">
              {(title || onClose) && (
                <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-ink-100/70">
                  <div>
                    {title && (
                      <h3 className="text-lg font-display font-semibold text-ink-900">{title}</h3>
                    )}
                    {description && (
                      <p className="text-sm text-ink-500 mt-1">{description}</p>
                    )}
                  </div>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="text-ink-400 hover:text-ink-900 p-1.5 rounded-lg hover:bg-ink-100 transition"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">{children}</div>
              {footer && (
                <div className="px-6 py-4 bg-ink-50/60 border-t border-ink-100/70 flex items-center justify-end gap-2">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
