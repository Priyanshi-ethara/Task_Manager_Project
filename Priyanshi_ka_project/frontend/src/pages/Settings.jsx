import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { PROJECT_COLORS } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    title: user?.title || '',
    avatarColor: user?.avatarColor || PROJECT_COLORS[0],
  });
  const [password, setPassword] = useState({ current: '', next: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profile);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (password.next.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPw(true);
    try {
      await updateProfile({ password: password.next });
      setPassword({ current: '', next: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Account</div>
        <h1 className="text-3xl font-display font-bold text-ink-900 mt-0.5">Settings</h1>
        <p className="text-ink-500 mt-1">Manage your profile and security.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleProfile}
          className="lg:col-span-2 card-base p-6 space-y-5"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white flex items-center justify-center">
              <FiUser className="w-4 h-4" />
            </div>
            Profile
          </div>

          <div className="flex items-center gap-4 pb-4 border-b border-ink-100">
            <Avatar user={{ ...user, ...profile }} size="xl" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-900">{user?.email}</div>
              <div className="text-xs text-ink-500 mt-0.5 capitalize">Role: {user?.role}</div>
            </div>
          </div>

          <Input
            label="Full name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Job title"
            placeholder="Senior Product Designer"
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          />

          <div>
            <div className="label-base">Avatar color</div>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setProfile({ ...profile, avatarColor: c })}
                  className={`w-9 h-9 rounded-xl transition-transform border-2 ${
                    profile.avatarColor === c
                      ? 'border-ink-900 scale-110 shadow-soft'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" leftIcon={<FiSave />} loading={savingProfile}>
              Save profile
            </Button>
          </div>
        </motion.form>

        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handlePassword}
          className="card-base p-6 space-y-5 h-fit"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
              <FiLock className="w-4 h-4" />
            </div>
            Security
          </div>

          <Input
            label="New password"
            type="password"
            placeholder="At least 6 characters"
            value={password.next}
            onChange={(e) => setPassword({ ...password, next: e.target.value })}
          />

          <Button type="submit" loading={savingPw} className="w-full">
            Update password
          </Button>

          <div className="text-xs text-ink-500 pt-2 border-t border-ink-100">
            Use a strong password you don't reuse anywhere else.
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Settings;
