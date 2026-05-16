import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const variants = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'btn-danger',
};

const Button = ({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  ...rest
}) => {
  const sizeCls =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : size === 'lg'
      ? 'px-6 py-3.5 text-base'
      : 'px-4 py-2.5 text-sm';

  const Comp = motion[as] || motion.button;

  return (
    <Comp
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: variant === 'primary' ? -1 : 0 }}
      className={cn(variants[variant], sizeCls, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span>Loading…</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </Comp>
  );
};

export default Button;
