import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const ProgressChart = ({ trend = [], statusCounts = {} }) => {
  const max = Math.max(1, ...trend.map((t) => t.count));
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
  const segments = [
    { key: 'done', label: 'Done', value: statusCounts.done || 0, color: '#10b981' },
    { key: 'review', label: 'Review', value: statusCounts.review || 0, color: '#0ea5e9' },
    { key: 'in_progress', label: 'In Progress', value: statusCounts.in_progress || 0, color: '#f59e0b' },
    { key: 'todo', label: 'To Do', value: statusCounts.todo || 0, color: '#94a3b8' },
  ];

  return (
    <div className="card-base p-5 lg:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">
            Productivity
          </div>
          <h3 className="text-lg font-display font-semibold mt-0.5">Last 7 days</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-ink-500">
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500" />
          Tasks completed
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-40">
        {trend.map((t, i) => {
          const height = (t.count / max) * 100;
          return (
            <div key={t.date} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full h-full flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 120 }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-brand-500 via-fuchsia-500 to-pink-400 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-ink-900 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {t.count}
                </div>
              </div>
              <div className="text-[10px] text-ink-400 font-medium">
                {format(parseISO(t.date), 'EEE')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status distribution */}
      <div className="mt-6 pt-5 border-t border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-ink-700">Status distribution</div>
          <div className="text-xs text-ink-400">{total} tasks total</div>
        </div>
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-ink-100">
          {segments.map((s) => {
            const pct = (s.value / total) * 100;
            return pct > 0 ? (
              <motion.div
                key={s.key}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ backgroundColor: s.color }}
                title={`${s.label}: ${s.value}`}
              />
            ) : null;
          })}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-ink-500">{s.label}</span>
              <span className="ml-auto font-semibold text-ink-900">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
