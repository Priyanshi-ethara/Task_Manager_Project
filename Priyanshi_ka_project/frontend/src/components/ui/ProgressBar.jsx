import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const ProgressBar = ({ value = 0, max = 100, className, color = 'from-brand-500 to-fuchsia-500', label, showValue }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          {label && <span className="font-medium text-ink-600">{label}</span>}
          {showValue && <span className="text-ink-500">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
