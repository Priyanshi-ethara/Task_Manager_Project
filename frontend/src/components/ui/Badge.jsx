import { motion } from 'framer-motion';
import { cn, STATUS_META, PRIORITY_META, PROJECT_STATUS_META } from '../../utils/helpers';

const Badge = ({ children, className, dot, color = 'bg-ink-100 text-ink-700' }) => (
  <motion.span
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={cn('chip', color, className)}
  >
    {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />}
    {children}
  </motion.span>
);

export const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.todo;
  return (
    <Badge color={meta.color} dot={meta.dot}>
      {meta.label}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }) => {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium;
  return (
    <Badge color={meta.color}>
      <span className={cn('w-1.5 h-1.5 rounded-full bg-gradient-to-r', meta.accent)} />
      {meta.label}
    </Badge>
  );
};

export const ProjectStatusBadge = ({ status }) => {
  const meta = PROJECT_STATUS_META[status] || PROJECT_STATUS_META.active;
  return (
    <Badge color={meta.color} dot={meta.dot}>
      {meta.label}
    </Badge>
  );
};

export default Badge;
