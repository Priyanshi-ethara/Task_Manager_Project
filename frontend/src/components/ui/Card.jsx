import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const Card = ({ children, className, hover = false, gradient = false, as = 'div', ...rest }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      whileHover={hover ? { y: -3, boxShadow: '0 18px 50px -12px rgba(15,23,42,0.18)' } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'card-base p-5',
        gradient && 'bg-gradient-to-br from-white via-white to-brand-50/40',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export default Card;
