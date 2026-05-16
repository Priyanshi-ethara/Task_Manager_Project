import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFolder,
  FiCheckSquare,
  FiAlertOctagon,
  FiClock,
  FiPlus,
  FiTrendingUp,
} from 'react-icons/fi';
import StatCard from '../components/dashboard/StatCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import ProductivityWidget from '../components/dashboard/ProductivityWidget';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAnalytics } from '../services/taskService';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAnalytics();
        if (mounted) setAnalytics(data.analytics);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  const totals = analytics?.totals || {};

  return (
    <div className="space-y-6">
      {/* Hero / greeting */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-brand-600 via-fuchsia-600 to-pink-500 text-white shadow-glow"
      >
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-xs font-medium">
              <FiTrendingUp className="w-3 h-3" />
              You've completed {totals.doneThisWeek ?? 0} tasks this week
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl font-display font-bold leading-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="mt-2 text-white/85 max-w-xl">
              Here's a quick snapshot of what your team is shipping. Let's keep the momentum going.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="!bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
              leftIcon={<FiPlus />}
              onClick={() => navigate('/projects?new=1')}
            >
              New Project
            </Button>
            <Button
              variant="outline"
              className="!bg-white !text-ink-900 !border-white hover:!bg-white/90"
              leftIcon={<FiCheckSquare />}
              onClick={() => navigate('/tasks?new=1')}
            >
              New Task
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <>
              <StatCard
                icon={FiFolder}
                label="Active projects"
                value={totals.projects ?? 0}
                color="brand"
                sub="Across all workspaces"
              />
              <StatCard
                icon={FiCheckSquare}
                label="Total tasks"
                value={totals.tasks ?? 0}
                color="sky"
                sub={`${analytics?.status?.done ?? 0} completed`}
              />
              <StatCard
                icon={FiClock}
                label="My open tasks"
                value={totals.myTasks ?? 0}
                color="amber"
                sub="Assigned to you"
              />
              <StatCard
                icon={FiAlertOctagon}
                label="Overdue"
                value={totals.overdue ?? 0}
                color="rose"
                sub="Need attention"
              />
            </>
          )}
      </section>

      {/* Chart + upcoming */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? (
            <SkeletonCard />
          ) : (
            <ProgressChart trend={analytics?.trend || []} statusCounts={analytics?.status || {}} />
          )}
        </div>
        <div>
          {loading ? (
            <SkeletonCard />
          ) : (
            <UpcomingDeadlines tasks={analytics?.upcoming || []} />
          )}
        </div>
      </section>

      {/* Activity + leaderboard */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? (
            <SkeletonCard />
          ) : (
            <ActivityTimeline items={analytics?.recent || []} />
          )}
        </div>
        <div>
          {loading ? (
            <SkeletonCard />
          ) : (
            <ProductivityWidget members={analytics?.memberProductivity || []} />
          )}
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/projects', title: 'Browse projects', sub: 'Plan, prioritize, and ship faster.', color: 'from-brand-500 to-fuchsia-500' },
          { to: '/tasks', title: 'Open task board', sub: 'A kanban view of everything in flight.', color: 'from-emerald-500 to-teal-500' },
          { to: '/members', title: 'Manage team', sub: 'Add teammates, assign roles.', color: 'from-amber-500 to-orange-500' },
        ].map((c, i) => (
          <motion.div key={c.to} whileHover={{ y: -3 }} transition={{ type: 'spring' }}>
            <Link
              to={c.to}
              className={`block relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${c.color} shadow-soft`}
            >
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest opacity-80">Quick action</div>
                <div className="font-display text-xl font-semibold mt-1">{c.title}</div>
                <div className="text-sm opacity-85 mt-1">{c.sub}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
