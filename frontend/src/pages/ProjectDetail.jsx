import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiUsers,
  FiCheckSquare,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskModal from '../components/tasks/TaskModal';
import ProjectModal from '../components/projects/ProjectModal';
import { AvatarStack } from '../components/ui/Avatar';
import { ProjectStatusBadge } from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const toast = useToast();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [projectEditOpen, setProjectEditOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const load = async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([
        projectService.getProject(id),
        taskService.listTasks({ project: id }),
      ]);
      setProject(p.project);
      setTasks(t.tasks || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const stats = useMemo(() => {
    const out = { total: tasks.length, done: 0, in_progress: 0, todo: 0, review: 0 };
    tasks.forEach((t) => {
      out[t.status] = (out[t.status] || 0) + 1;
    });
    return out;
  }, [tasks]);

  const handleStatusChange = async (task, status) => {
    try {
      const data = await taskService.updateTask(task._id, { status });
      setTasks((cur) => cur.map((t) => (t._id === task._id ? data.task : t)));
      toast.success(`Moved to ${status.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleSaveTask = async (payload) => {
    try {
      if (editingTask) {
        const data = await taskService.updateTask(editingTask._id, payload);
        setTasks((cur) => cur.map((t) => (t._id === editingTask._id ? data.task : t)));
        toast.success('Task updated');
      } else {
        const data = await taskService.createTask(payload);
        setTasks((cur) => [data.task, ...cur]);
        toast.success('Task created');
      }
      setTaskOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleDeleteTask = async (t) => {
    try {
      await taskService.deleteTask(t._id);
      setTasks((cur) => cur.filter((x) => x._id !== t._id));
      toast.success('Task deleted');
      setTaskOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddComment = async (text) => {
    try {
      const data = await taskService.addComment(editingTask._id, text);
      setEditingTask((cur) => ({ ...cur, comments: data.comments }));
      setTasks((cur) =>
        cur.map((t) => (t._id === editingTask._id ? { ...t, comments: data.comments } : t))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Comment failed');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted');
      window.location.href = '/projects';
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonRow />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card-base p-10 text-center">
        <h3 className="font-semibold text-lg">Project not found</h3>
        <Link to="/projects" className="text-brand-600 mt-3 inline-block">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const pct = stats.total ? (stats.done / stats.total) * 100 : 0;
  const isOwner = project.createdBy?._id === user?._id || project.createdBy === user?._id;
  const canManage = isOwner || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative card-base p-6 overflow-hidden"
      >
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25"
          style={{ background: project.color }}
        />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-soft"
              style={{
                background: `linear-gradient(135deg, ${project.color}, ${project.color}dd)`,
              }}
            >
              {project.title.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-ink-900">
                  {project.title}
                </h1>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="text-ink-500 mt-1 max-w-2xl">{project.description || 'No description'}</p>
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <AvatarStack users={project.members || []} max={5} />
                  <span className="text-xs text-ink-500 flex items-center gap-1">
                    <FiUsers className="w-3.5 h-3.5" /> {project.members?.length} members
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-500">
                  <FiCheckSquare className="w-3.5 h-3.5" /> {stats.total} tasks
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canManage && (
              <>
                <Button
                  variant="outline"
                  leftIcon={<FiEdit2 />}
                  onClick={() => setProjectEditOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<FiTrash2 />}
                  className="!text-rose-600 hover:!bg-rose-50"
                  onClick={handleDeleteProject}
                >
                  Delete
                </Button>
              </>
            )}
            <Button
              leftIcon={<FiPlus />}
              onClick={() => {
                setEditingTask(null);
                setDefaultStatus('todo');
                setTaskOpen(true);
              }}
            >
              Add task
            </Button>
          </div>
        </div>

        <div className="relative mt-6">
          <ProgressBar
            value={pct}
            label={`${stats.done} of ${stats.total} tasks completed`}
            showValue
            color="from-emerald-500 to-teal-500"
          />
        </div>
      </motion.div>

      <KanbanBoard
        tasks={tasks}
        onTaskClick={(t) => {
          setEditingTask(t);
          setTaskOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onAddTask={(status) => {
          setEditingTask(null);
          setDefaultStatus(status);
          setTaskOpen(true);
        }}
      />

      <TaskModal
        open={taskOpen}
        onClose={() => {
          setTaskOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        onDelete={handleDeleteTask}
        onAddComment={handleAddComment}
        initial={editingTask}
        projects={[project]}
        members={project.members || []}
        defaultProjectId={project._id}
        defaultStatus={defaultStatus}
      />

      <ProjectModal
        open={projectEditOpen}
        onClose={() => setProjectEditOpen(false)}
        onSubmit={async (payload) => {
          try {
            const data = await projectService.updateProject(project._id, payload);
            setProject(data.project);
            toast.success('Project updated');
            setProjectEditOpen(false);
          } catch (err) {
            toast.error(err?.response?.data?.message || 'Save failed');
          }
        }}
        initial={project}
      />
    </div>
  );
};

export default ProjectDetail;
