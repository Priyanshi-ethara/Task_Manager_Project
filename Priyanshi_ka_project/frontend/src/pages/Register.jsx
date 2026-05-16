import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiZap, FiCheck } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BENEFITS = [
  'Beautiful Kanban boards out of the box',
  'Live analytics for the whole team',
  'Role-based access, secure by default',
  'Built for designers, devs and PMs',
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative grid lg:grid-cols-2 overflow-hidden">
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-white order-2 lg:order-1">
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

          <h2 className="text-3xl font-display font-bold text-ink-900">Create your account</h2>
          <p className="text-ink-500 mt-1.5">Get your team productive in under a minute.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              label="Full name"
              required
              leftIcon={<FiUser className="w-4 h-4" />}
              placeholder="Jane Cooper"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Work email"
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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              hint="Use 8+ chars with a mix of letters & numbers for best security."
            />

            <Button type="submit" loading={submitting} className="w-full mt-2" rightIcon={<FiArrowRight />}>
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden bg-ink-950 text-white order-1 lg:order-2">
        <div className="absolute inset-0 bg-aurora opacity-90" />
        <div className="absolute inset-0 bg-grid-light bg-[size:64px_64px] opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-md"
        >
          <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight">
            Start fast. <span className="gradient-text">Ship faster.</span>
          </h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            Join product teams using Stackly to organize work, track outcomes, and stay aligned —
            without the bloat.
          </p>

          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow">
                  <FiCheck className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="text-white/85">{b}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
