import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';
import { fmtDate, daysUntil, isOverdue } from '../../utils/helpers';
import EmptyState from '../ui/EmptyState';
import Avatar from '../ui/Avatar';

const UpcomingDeadlines = ({ tasks = [] }) => (
  <div className="card-base p-5 lg:p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">
          Upcoming
        </div>
        <h3 className="text-lg font-display font-semibold mt-0.5">Deadlines</h3>
      </div>
      <Link to="/tasks" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
        View all →
      </Link>
    </div>

    {tasks.length === 0 ? (
      <EmptyState
        icon={<FiCalendar />}
        title="No upcoming deadlines"
        description="You're all caught up. Time for a coffee ☕"
      />
    ) : (
      <ul className="space-y-2">
        {tasks.map((t, i) => {
          const days = daysUntil(t.dueDate);
          const overdue = isOverdue(t.dueDate, t.status);
          return (
            <motion.li
              key={t._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/projects/${t.project?._id || t.project}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${t.project?.color || '#6366f1'}, ${
                      t.project?.color || '#6366f1'
                    }dd)`,
                  }}
                >
                  {(t.project?.title || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate group-hover:text-brand-700 transition">
                    {t.title}
                  </div>
                  <div className="text-[11px] text-ink-500 truncate flex items-center gap-1.5">
                    <FiClock className="w-3 h-3" />
                    {fmtDate(t.dueDate)} · {t.project?.title}
                  </div>
                </div>
                {t.assignedTo && <Avatar user={t.assignedTo} size="xs" />}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    overdue
                      ? 'bg-rose-100 text-rose-700'
                      : days <= 2
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {overdue && <FiAlertCircle className="w-3 h-3" />}
                  {overdue
                    ? 'Overdue'
                    : days === 0
                    ? 'Today'
                    : days === 1
                    ? '1d'
                    : `${days}d`}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    )}
  </div>
);

export default UpcomingDeadlines;
