import { motion } from 'framer-motion';
import { FiActivity } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import { StatusBadge } from '../ui/Badge';
import { fromNow } from '../../utils/helpers';
import EmptyState from '../ui/EmptyState';

const ActivityTimeline = ({ items = [] }) => (
  <div className="card-base p-5 lg:p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">
          Activity
        </div>
        <h3 className="text-lg font-display font-semibold mt-0.5">Recent updates</h3>
      </div>
      <span className="text-xs text-ink-400">live</span>
    </div>

    {items.length === 0 ? (
      <EmptyState
        icon={<FiActivity />}
        title="Nothing happening yet"
        description="Once your team creates tasks, you'll see updates here."
      />
    ) : (
      <ol className="relative space-y-4">
        <span className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-200 via-ink-200 to-transparent" />
        {items.map((t, i) => (
          <motion.li
            key={t._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative flex items-start gap-3 pl-1"
          >
            <Avatar user={t.assignedTo || t.createdBy} size="sm" ring />
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-sm text-ink-800">
                <span className="font-semibold">
                  {(t.assignedTo || t.createdBy)?.name || 'Someone'}
                </span>{' '}
                updated <span className="font-semibold">{t.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={t.status} />
                {t.project?.title && (
                  <span className="text-[11px] text-ink-500">in {t.project.title}</span>
                )}
                <span className="text-[11px] text-ink-400">· {fromNow(t.updatedAt)}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    )}
  </div>
);

export default ActivityTimeline;
