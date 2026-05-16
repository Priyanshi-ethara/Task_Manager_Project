import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const ICONS = {
  success: <FiCheckCircle className="w-5 h-5" />,
  error: <FiAlertCircle className="w-5 h-5" />,
  info: <FiInfo className="w-5 h-5" />,
};

const STYLES = {
  success: 'from-emerald-500 to-teal-500',
  error: 'from-rose-500 to-pink-500',
  info: 'from-brand-500 to-fuchsia-500',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((cur) => [...cur, { id, type, message }]);
      setTimeout(() => remove(id), opts.duration ?? 3500);
    },
    [remove]
  );

  const api = {
    success: (m, o) => push('success', m, o),
    error: (m, o) => push('error', m, o),
    info: (m, o) => push('info', m, o),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-card border border-white/40 bg-white/95 backdrop-blur-xl pl-4 pr-3 py-3 flex items-center gap-3 min-w-[280px]">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${STYLES[t.type]}`}
                />
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${STYLES[t.type]} text-white flex items-center justify-center shadow-soft`}
                >
                  {ICONS[t.type]}
                </div>
                <div className="flex-1 text-sm font-medium text-ink-800 pr-2">{t.message}</div>
                <button
                  onClick={() => remove(t.id)}
                  className="text-ink-400 hover:text-ink-700 p-1 rounded-lg transition"
                  aria-label="Dismiss"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
