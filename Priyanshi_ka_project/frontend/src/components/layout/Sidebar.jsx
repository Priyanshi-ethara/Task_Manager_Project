import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiSettings,
  FiZap,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const items = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/projects', label: 'Projects', icon: FiFolder },
  { to: '/tasks', label: 'My Tasks', icon: FiCheckSquare },
  { to: '/members', label: 'Members', icon: FiUsers },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <aside className="h-full w-64 flex flex-col bg-white/80 backdrop-blur-xl border-r border-ink-200/60 relative overflow-hidden">
      <div className="absolute -top-24 -left-16 w-64 h-64 bg-brand-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-fuchsia-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220 }}
            className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow"
          >
            <FiZap className="text-white w-5 h-5" />
          </motion.div>
          <div>
            <div className="font-display font-bold text-lg tracking-tight">Stackly</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400 font-medium -mt-0.5">
              Team Workspace
            </div>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 px-3 mt-2 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'text-brand-700'
                  : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-brand-100 via-brand-50 to-fuchsia-50 rounded-xl border border-brand-200/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`relative w-[18px] h-[18px] transition-colors ${
                    isActive ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-700'
                  }`}
                />
                <span className="relative">{item.label}</span>
                {isActive && (
                  <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative p-3 border-t border-ink-100/70 mt-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-ink-50/70">
          <Avatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-ink-500 truncate capitalize">{user?.role}</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
