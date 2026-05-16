import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-8xl font-display font-bold gradient-text">404</div>
      <h1 className="mt-3 text-2xl font-display font-semibold text-ink-900">
        Page not found
      </h1>
      <p className="text-ink-500 mt-2 max-w-sm mx-auto">
        The page you're looking for has either moved or never existed.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient text-white font-medium shadow-glow hover:opacity-95 transition"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
