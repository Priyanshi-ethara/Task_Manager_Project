import { cn, initials } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const Avatar = ({ user, size = 'md', className, ring = false }) => {
  if (!user) {
    return (
      <div
        className={cn(
          'rounded-full bg-ink-200 text-ink-500 flex items-center justify-center font-semibold',
          sizes[size],
          className
        )}
      >
        ?
      </div>
    );
  }
  return (
    <div
      style={{ backgroundColor: user.avatarColor || '#6366f1' }}
      className={cn(
        'rounded-full text-white flex items-center justify-center font-semibold shadow-soft',
        sizes[size],
        ring && 'ring-2 ring-white',
        className
      )}
      title={user.name}
    >
      {initials(user.name)}
    </div>
  );
};

export const AvatarStack = ({ users = [], max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const extra = users.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((u) => (
        <Avatar key={u._id || u.id || u.name} user={u} size={size} ring />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            'rounded-full bg-ink-200 text-ink-700 flex items-center justify-center font-semibold ring-2 ring-white',
            sizes[size]
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export default Avatar;
