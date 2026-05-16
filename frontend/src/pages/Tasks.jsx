import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiCheckSquare, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';
import { useToast } from '../context/ToastContext';
import * as taskService from '../services/taskService';
import * as projectService from '../services/projectService';
import * as userService from '../services/userService';

const Tasks = () => {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('board');
  const [search, setSearch] = useState(params.get('q') || '');
  const [project, setProject] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const load = async () => {
    setLoading(true);
    try {
      const queryParams = {
        search: search || undefined,
        project: project || undefined,
        priority: priority || undefined,
        assignedTo: assignee || undefined,
        mine: onlyMine || undefined,
      };
      const [t, p, u] = await Promise.all([
        taskService.listTasks(queryParams),
        projectService.listProjects(),
        userService.listUsers(),
      ]);
      setTasks(t.tasks || []);
      setProjects(p.projects || []);
      setUsers(u.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, priority, assignee, onlyMine]);

  useEffect(() => {
    if (params.get('new') === '1') {
      setEditing(null);
      setModalOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const filtered = useMemo(() => {
    if (!search) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const data = await taskService.updateTask(editing._id, payload);
        setTasks((cur) => cur.map((t) => (t._id === editing._id ? data.task : t)));
        toast.success('Task updated');
      } else {
        const data = await taskService.createTask(payload);
        setTasks((cur) => [data.task, ...cur]);
        toast.success('Task created');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (t) => {
    try {
      await taskService.deleteTask(t._id);
      setTasks((cur) => cur.filter((x) => x._id !== t._id));
      toast.success('Task deleted');
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatus = async (task, status) => {
    try {
      const data = await taskService.updateTask(task._id, { status });
      setTasks((cur) => cur.map((t) => (t._id === task._id ? data.task : t)));
      toast.success(`Moved to ${status.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleAddComment = async (text) => {
    try {
      const data = await taskService.addComment(editing._id, text);
      setEditing((cur) => ({ ...cur, comments: data.comments }));
      setTasks((cur) =>
        cur.map((t) => (t._id === editing._id ? { ...t, comments: data.comments } : t))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Comment failed');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Workflow</div>
          <h1 className="text-3xl font-display font-bold text-ink-900 mt-0.5">Tasks</h1>
          <p className="text-ink-500 mt-1">A single board for everything in flight.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-ink-200 rounded-xl p-1 flex">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                view === 'board' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <FiGrid className="w-4 h-4" /> Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                view === 'list' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <FiList className="w-4 h-4" /> List
            </button>
          </div>
          <Button
            leftIcon={<FiPlus />}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            New task
          </Button>
        </div>
      </motion.div>

      <div className="card-base p-3 grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <Select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <Select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">All assignees</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </Select>
        <button
          onClick={() => setOnlyMine((x) => !x)}
          className={`md:col-span-5 mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${
            onlyMine
              ? 'bg-brand-50 border-brand-300 text-brand-700'
              : 'bg-white border-ink-200 text-ink-600 hover:bg-ink-50'
          }`}
        >
          <FiFilter className="w-3.5 h-3.5" />
          {onlyMine ? 'Showing only my tasks' : 'Show only my tasks'}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiCheckSquare />}
          title="No tasks match your filters"
          description="Try changing your filters or create a new task."
          action={
            <Button
              leftIcon={<FiPlus />}
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              Create task
            </Button>
          }
        />
      ) : view === 'board' ? (
        <KanbanBoard
          tasks={filtered}
          onTaskClick={(t) => {
            setEditing(t);
            setModalOpen(true);
          }}
          onStatusChange={handleStatus}
          onAddTask={(status) => {
            setEditing(null);
            setDefaultStatus(status);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              onClick={(task) => {
                setEditing(task);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onAddComment={handleAddComment}
        initial={editing}
        projects={projects}
        members={users}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};

export default Tasks;
