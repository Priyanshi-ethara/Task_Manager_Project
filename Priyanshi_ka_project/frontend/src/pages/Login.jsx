import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiZap } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      const to = location.state?.from?.pathname || '/';
      navigate(to, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative grid lg:grid-cols-2 overflow-hidden">
      {/* Left visual */}
      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-aurora opacity-90" />
        <div className="absolute inset-0 bg-grid-light bg-[size:64px_64px] opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-md"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs font-medium tracking-wide">
            <FiZap className="w-3 h-3 text-amber-300" /> Built for high-velocity teams
          </div>
          <h1 className="mt-6 text-4xl xl:text-5xl font-display font-bold leading-tight">
            Ship work that <span className="gradient-text">moves the team</span> forward.
          </h1>
          <p className="mt-4 text-white/70 text-base leading-relaxed">
            Stackly brings projects, tasks, and teammates into one beautifully fast workspace —
            so the only thing slowing you down is your imagination.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {['Kanban', 'Analytics', 'Realtime'].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-wider text-white/50">Feature</div>
                <div className="text-sm font-semibold mt-1">{f}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 right-12 w-44 h-44 rounded-3xl bg-gradient-to-br from-fuchsia-500/30 to-brand-500/30 blur-2xl"
        />
      </div>

      {/* Right form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <FiZap className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-lg">Stackly</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400 font-medium -mt-0.5">
                Team Workspace
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-display font-bold text-ink-900">Welcome back</h2>
          <p className="text-ink-500 mt-1.5">Sign in to keep your projects flowing.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              required
              leftIcon={<FiMail className="w-4 h-4" />}
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              required
              leftIcon={<FiLock className="w-4 h-4" />}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              loading={submitting}
              className="w-full mt-2"
              rightIcon={<FiArrowRight />}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            New to Stackly?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-ink-50 border border-ink-200/70">
            <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold mb-1">
              Tip
            </div>
            <div className="text-sm text-ink-700">
              The first account you create automatically becomes the workspace <b>Admin</b>.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
