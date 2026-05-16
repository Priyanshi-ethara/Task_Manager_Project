import { motion } from 'framer-motion';
import { FiCalendar, FiMessageCircle, FiMoreHorizontal, FiAlertCircle } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import { PriorityBadge } from '../ui/Badge';
import { fmtDate, isOverdue, cn } from '../../utils/helpers';

const TaskCard = ({ task, onClick, dragHandlers }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={() => onClick?.(task)}
      {...(dragHandlers || {})}
      className={cn(
        'group relative cursor-pointer card-base p-3.5 hover:shadow-card transition-shadow',
        'border-l-4',
        task.priority === 'urgent' && 'border-l-rose-500',
        task.priority === 'high' && 'border-l-orange-500',
        task.priority === 'medium' && 'border-l-blue-500',
        task.priority === 'low' && 'border-l-slate-400'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-700 transition">
          {task.title}
        </h4>
        <button className="opacity-0 group-hover:opacity-100 text-ink-400 hover:text-ink-900 transition p-1 -m-1">
          <FiMoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="mt-1.5 text-xs text-ink-500 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
        </div>
        {task.assignedTo ? (
          <Avatar user={task.assignedTo} size="xs" ring />
        ) : (
          <span className="w-6 h-6 rounded-full bg-ink-100 border border-dashed border-ink-300" />
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-ink-500">
        {task.dueDate && (
          <span
            className={cn(
              'inline-flex items-center gap-1',
              overdue ? 'text-rose-600 font-semibold' : ''
            )}
          >
            {overdue ? <FiAlertCircle className="w-3 h-3" /> : <FiCalendar className="w-3 h-3" />}
            {fmtDate(task.dueDate)}
          </span>
        )}
        {(task.comments?.length || 0) > 0 && (
          <span className="inline-flex items-center gap-1">
            <FiMessageCircle className="w-3 h-3" /> {task.comments.length}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
