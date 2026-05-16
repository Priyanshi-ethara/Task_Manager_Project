import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const GRADIENTS = {
  brand: 'from-brand-500 to-fuchsia-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
  sky: 'from-sky-500 to-cyan-500',
};

const StatCard = ({ icon: Icon, label, value, sub, color = 'brand', delta }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className="relative card-base p-5 overflow-hidden group"
  >
    <div
      className={cn(
        'absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br transition-opacity group-hover:opacity-50',
        GRADIENTS[color]
      )}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider font-semibold text-ink-500">{label}</div>
        <div className="mt-2 text-3xl font-display font-bold text-ink-900">{value}</div>
        {sub && <div className="text-xs text-ink-500 mt-1">{sub}</div>}
      </div>
      <div
        className={cn(
          'w-11 h-11 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-soft',
          GRADIENTS[color]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {delta !== undefined && (
      <div
        className={cn(
          'relative mt-3 text-xs font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
          delta >= 0 ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
        )}
      >
        {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% this week
      </div>
    )}
  </motion.div>
);

export default StatCard;
