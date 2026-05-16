import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShield, FiUserX, FiUsers } from 'react-icons/fi';
import Avatar from '../components/ui/Avatar';
import { SkeletonRow } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Select } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as userService from '../services/userService';
import { fromNow } from '../utils/helpers';

const Members = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    setLoading(true);
    try {
      const data = await userService.listUsers({ search: search || undefined });
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const changeRole = async (u, role) => {
    try {
      const data = await userService.updateRole(u._id, role);
      setUsers((cur) => cur.map((x) => (x._id === u._id ? data.user : x)));
      toast.success(`${u.name} is now ${role}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Remove ${u.name}? This cannot be undone.`)) return;
    try {
      await userService.deleteUser(u._id);
      setUsers((cur) => cur.filter((x) => x._id !== u._id));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">People</div>
        <h1 className="text-3xl font-display font-bold text-ink-900 mt-0.5">Members</h1>
        <p className="text-ink-500 mt-1">Everyone who can collaborate on this workspace.</p>
      </motion.div>

      <div className="card-base p-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
      </div>

      <div className="card-base p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<FiUsers />}
            title="No members yet"
            description="As people sign up, they'll appear here."
          />
        ) : (
          <ul className="divide-y divide-ink-100">
            {users.map((u, i) => (
              <motion.li
                key={u._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-3 py-3 hover:bg-ink-50/60 rounded-xl transition"
              >
                <Avatar user={u} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-900 truncate">{u.name}</span>
                    {u._id === user?._id && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-brand-600">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-500 truncate">{u.email}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">
                    Joined {fromNow(u.createdAt)}
                  </div>
                </div>

                <div className="hidden sm:block w-36">
                  {isAdmin && u._id !== user?._id ? (
                    <Select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="!py-2 !text-sm"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </Select>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-ink-100 text-ink-600'
                      }`}
                    >
                      <FiShield className="w-3 h-3" /> {u.role}
                    </span>
                  )}
                </div>

                {isAdmin && u._id !== user?._id && (
                  <button
                    onClick={() => removeUser(u)}
                    className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition"
                    title="Remove member"
                  >
                    <FiUserX className="w-4 h-4" />
                  </button>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Members;
