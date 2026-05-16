import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiLogOut, FiUser, FiMenu, FiCommand } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Topbar = ({ onOpenMobile }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center gap-3 bg-white/70 backdrop-blur-xl border-b border-ink-200/60">
      <button
        className="lg:hidden p-2 rounded-xl hover:bg-ink-100 text-ink-600"
        onClick={onOpenMobile}
      >
        <FiMenu className="w-5 h-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4" />
        <input
          placeholder="Search projects, tasks, members…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              navigate(`/tasks?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
            }
          }}
          className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-ink-200 bg-white/60 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition"
        />
        <kbd className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400 bg-ink-100 rounded">
          <FiCommand className="w-3 h-3" /> K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl hover:bg-ink-100 text-ink-600 transition">
          <FiBell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((x) => !x)}
            className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-ink-100 transition"
          >
            <Avatar user={user} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-ink-900 leading-tight">{user?.name}</div>
              <div className="text-[11px] text-ink-500 capitalize leading-tight">{user?.role}</div>
            </div>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-ink-200/70 shadow-card p-1.5 overflow-hidden"
              >
                <div className="px-3 py-2.5 border-b border-ink-100">
                  <div className="text-sm font-semibold truncate">{user?.name}</div>
                  <div className="text-xs text-ink-500 truncate">{user?.email}</div>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-700 hover:bg-ink-100"
                >
                  <FiUser className="w-4 h-4" /> Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                >
                  <FiLogOut className="w-4 h-4" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
