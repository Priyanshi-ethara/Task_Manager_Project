import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-12 px-6"
  >
    <div className="relative w-24 h-24 mb-5">
      <div className="absolute inset-0 bg-brand-gradient rounded-full blur-2xl opacity-30 animate-pulse-soft" />
      <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/15 via-fuchsia-400/15 to-pink-400/15 border border-brand-200/60 flex items-center justify-center">
        <div className="text-brand-500 text-3xl">{icon || <FiInbox />}</div>
      </div>
    </div>
    <h3 className="text-lg font-display font-semibold text-ink-900">{title}</h3>
    {description && (
      <p className="text-sm text-ink-500 mt-1.5 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

export default EmptyState;
