import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import ProgressBar from '../ui/ProgressBar';
import EmptyState from '../ui/EmptyState';

const ProductivityWidget = ({ members = [] }) => (
  <div className="card-base p-5 lg:p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">
          Team
        </div>
        <h3 className="text-lg font-display font-semibold mt-0.5">Productivity leaderboard</h3>
      </div>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-soft">
        <FiAward className="w-4 h-4" />
      </div>
    </div>

    {members.length === 0 ? (
      <EmptyState
        icon={<FiAward />}
        title="No data yet"
        description="Once teammates complete tasks, the leaderboard will light up."
      />
    ) : (
      <ul className="space-y-4">
        {members.map((m, i) => {
          const pct = m.total ? (m.done / m.total) * 100 : 0;
          return (
            <motion.li
              key={m._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Avatar user={m} size="sm" />
                {i === 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[8px] text-white flex items-center justify-center font-bold shadow-soft">
                    1
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-900 truncate">{m.name}</span>
                  <span className="text-xs text-ink-500">
                    {m.done}/{m.total}
                  </span>
                </div>
                <ProgressBar value={pct} className="mt-1" />
              </div>
            </motion.li>
          );
        })}
      </ul>
    )}
  </div>
);

export default ProductivityWidget;
