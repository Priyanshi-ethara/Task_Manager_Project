import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiSend } from 'react-icons/fi';
import Modal from '../ui/Modal';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { fmtDateTime, fromNow } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
  tags: '',
};

const toInputDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  onAddComment,
  initial,
  projects = [],
  members = [],
  defaultProjectId,
  defaultStatus,
}) => {
  const { user } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        status: initial.status || 'todo',
        priority: initial.priority || 'medium',
        dueDate: toInputDate(initial.dueDate),
        assignedTo: initial.assignedTo?._id || initial.assignedTo || '',
        tags: (initial.tags || []).join(', '),
      });
      setProjectId(initial.project?._id || initial.project || '');
    } else {
      setForm({ ...defaultForm, status: defaultStatus || 'todo' });
      setProjectId(defaultProjectId || projects[0]?._id || '');
    }
  }, [initial, open, defaultProjectId, defaultStatus, projects]);

  const handle = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim() || !projectId) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        dueDate: form.dueDate || null,
        assignedTo: form.assignedTo || null,
        project: projectId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitComment = async () => {
    if (!comment.trim() || !initial?._id) return;
    await onAddComment?.(comment.trim());
    setComment('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? initial.title : 'Create new task'}
      description={initial ? 'Update task details, status and comments.' : 'Fill in the details and assign to a teammate.'}
      size="xl"
      footer={
        <>
          {initial && (
            <Button
              variant="ghost"
              leftIcon={<FiTrash2 />}
              className="!text-rose-600 mr-auto"
              onClick={() => onDelete?.(initial)}
            >
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handle} loading={submitting}>
            {initial ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form onSubmit={handle} className="lg:col-span-3 space-y-4">
          <Input
            label="Task title"
            placeholder="Design landing page hero"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Add some context, links, acceptance criteria…"
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </Select>
            <Select
              label="Assigned to"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
            <Input
              label="Due date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <Input
            label="Tags"
            placeholder="design, frontend, v2"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            hint="Comma-separated"
          />
        </form>

        <aside className="lg:col-span-2 space-y-4">
          <div className="card-base p-4 bg-gradient-to-br from-brand-50/60 via-white to-fuchsia-50/40">
            <div className="text-xs uppercase tracking-wider font-semibold text-ink-500 mb-3">
              At a glance
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Status</span>
                <StatusBadge status={form.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Priority</span>
                <PriorityBadge priority={form.priority} />
              </div>
              {initial?.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-500">Created</span>
                  <span className="text-xs text-ink-700">{fmtDateTime(initial.createdAt)}</span>
                </div>
              )}
              {initial?.createdBy && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-500">Created by</span>
                  <div className="flex items-center gap-2">
                    <Avatar user={initial.createdBy} size="xs" />
                    <span className="text-xs text-ink-700">{initial.createdBy.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {initial && (
            <div className="card-base p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-ink-500 mb-3">
                Comments ({initial.comments?.length || 0})
              </div>
              <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                {(initial.comments || []).length === 0 && (
                  <div className="text-sm text-ink-400 text-center py-6">
                    No comments yet — be the first.
                  </div>
                )}
                {(initial.comments || []).map((c) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <Avatar user={c.user} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-ink-900">{c.user?.name}</span>
                        <span className="text-ink-400">{fromNow(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-ink-700 mt-0.5 whitespace-pre-wrap">{c.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Avatar user={user} size="xs" />
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Write a comment…"
                  className="flex-1 px-3 py-2 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
                <button
                  onClick={submitComment}
                  className="w-9 h-9 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-soft hover:shadow-glow transition"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </Modal>
  );
};

export default TaskModal;
