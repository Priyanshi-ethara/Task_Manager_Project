import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { PROJECT_COLORS } from '../../utils/helpers';
import { listUsers } from '../../services/userService';

const defaultForm = {
  title: '',
  description: '',
  color: PROJECT_COLORS[0],
  status: 'active',
  members: [],
};

const ProjectModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(defaultForm);
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    listUsers().then((d) => setUsers(d.users || [])).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        color: initial.color || PROJECT_COLORS[0],
        status: initial.status || 'active',
        members: (initial.members || []).map((m) => m._id || m),
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial, open]);

  const toggleMember = (id) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter((m) => m !== id) : [...f.members, id],
    }));
  };

  const handle = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit project' : 'Create a new project'}
      description={initial ? 'Update project details and members.' : 'Spin up a new space for your team to collaborate.'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handle} loading={submitting}>
            {initial ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handle} className="space-y-4">
        <Input
          label="Project name"
          placeholder="e.g. Apollo Mobile App"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="What is this project about?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <div className="label-base">Accent color</div>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-9 h-9 rounded-xl transition-transform border-2 ${
                  form.color === c
                    ? 'border-ink-900 scale-110 shadow-soft'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="on_hold">On hold</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </Select>

        <div>
          <div className="label-base">Members ({form.members.length})</div>
          <div className="max-h-56 overflow-y-auto scrollbar-thin border border-ink-200 rounded-xl divide-y divide-ink-100">
            {users.length === 0 ? (
              <div className="p-4 text-sm text-ink-500">No teammates yet.</div>
            ) : (
              users.map((u) => {
                const selected = form.members.includes(u._id);
                return (
                  <button
                    type="button"
                    key={u._id}
                    onClick={() => toggleMember(u._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                      selected ? 'bg-brand-50/70' : 'hover:bg-ink-50'
                    }`}
                  >
                    <Avatar user={u} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink-900 truncate">{u.name}</div>
                      <div className="text-xs text-ink-500 truncate">{u.email}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center text-white text-xs transition ${
                        selected
                          ? 'bg-brand-500 border-brand-500'
                          : 'border-ink-300'
                      }`}
                    >
                      {selected && '✓'}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
