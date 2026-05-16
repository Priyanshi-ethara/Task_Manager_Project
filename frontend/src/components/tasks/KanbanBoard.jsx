import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { STATUS_ORDER, STATUS_META, cn } from '../../utils/helpers';

const COLUMN_GRADIENTS = {
  todo: 'from-slate-100 to-slate-50',
  in_progress: 'from-amber-100/70 to-amber-50',
  review: 'from-sky-100/70 to-sky-50',
  done: 'from-emerald-100/70 to-emerald-50',
};

const KanbanBoard = ({ tasks = [], onTaskClick, onStatusChange, onAddTask }) => {
  const [draggingId, setDraggingId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const groups = STATUS_ORDER.map((status) => ({
    status,
    items: tasks.filter((t) => t.status === status),
  }));

  const handleDrop = (status) => {
    if (draggingId) {
      const task = tasks.find((t) => t._id === draggingId);
      if (task && task.status !== status) {
        onStatusChange?.(task, status);
      }
    }
    setDraggingId(null);
    setOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {groups.map(({ status, items }) => {
        const meta = STATUS_META[status];
        const isOver = overCol === status;
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(status);
            }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={() => handleDrop(status)}
            className={cn(
              'rounded-2xl border border-ink-200/70 bg-gradient-to-b p-3 transition-shadow',
              COLUMN_GRADIENTS[status],
              isOver && 'ring-2 ring-brand-400 ring-offset-2 ring-offset-transparent shadow-glow'
            )}
          >
            <div className="flex items-center justify-between px-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', meta.dot)} />
                <span className="text-sm font-semibold text-ink-900">{meta.label}</span>
                <span className="text-xs text-ink-500 bg-white px-1.5 py-0.5 rounded-full border border-ink-200/70">
                  {items.length}
                </span>
              </div>
              {onAddTask && (
                <button
                  onClick={() => onAddTask(status)}
                  className="text-ink-400 hover:text-brand-600 p-1 rounded-lg hover:bg-white transition"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2.5 min-h-[120px]">
              <AnimatePresence>
                {items.map((t) => (
                  <TaskCard
                    key={t._id}
                    task={t}
                    onClick={onTaskClick}
                    dragHandlers={{
                      draggable: true,
                      onDragStart: () => setDraggingId(t._id),
                      onDragEnd: () => {
                        setDraggingId(null);
                        setOverCol(null);
                      },
                    }}
                  />
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-ink-400 py-8 border-2 border-dashed border-ink-200 rounded-xl"
                >
                  Drop tasks here
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
