import clsx from 'clsx';
import { format, formatDistanceToNow, isPast, parseISO, differenceInCalendarDays } from 'date-fns';

export const cn = (...args) => clsx(...args);

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

export const fmtDate = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d) : d;
  return format(date, 'MMM d, yyyy');
};

export const fmtDateTime = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d) : d;
  return format(date, 'MMM d, yyyy · h:mm a');
};

export const fromNow = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d) : d;
  return formatDistanceToNow(date, { addSuffix: true });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isPast(date);
};

export const daysUntil = (dueDate) => {
  if (!dueDate) return null;
  const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return differenceInCalendarDays(date, new Date());
};

export const STATUS_META = {
  todo: { label: 'To Do', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  review: { label: 'Review', color: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

export const PRIORITY_META = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600', accent: 'from-slate-400 to-slate-500' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700', accent: 'from-blue-400 to-indigo-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700', accent: 'from-orange-400 to-amber-500' },
  urgent: { label: 'Urgent', color: 'bg-rose-100 text-rose-700', accent: 'from-rose-500 to-pink-500' },
};

export const PROJECT_STATUS_META = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
  archived: { label: 'Archived', color: 'bg-slate-200 text-slate-600', dot: 'bg-slate-400' },
};

export const STATUS_ORDER = ['todo', 'in_progress', 'review', 'done'];

export const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#a855f7',
];
