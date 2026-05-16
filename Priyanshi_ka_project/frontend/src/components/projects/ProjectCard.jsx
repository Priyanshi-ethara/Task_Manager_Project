import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCheckSquare } from 'react-icons/fi';
import { AvatarStack } from '../ui/Avatar';
import { ProjectStatusBadge } from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { fromNow } from '../../utils/helpers';

const ProjectCard = ({ project }) => {
  const stats = project.stats || { total: 0, done: 0 };
  const pct = stats.total ? (stats.done / stats.total) * 100 : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="block relative card-base p-5 overflow-hidden group h-full"
      >
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
          style={{ background: project.color }}
        />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-soft"
                style={{
                  background: `linear-gradient(135deg, ${project.color}, ${project.color}dd)`,
                }}
              >
                {(project.title || '?').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 line-clamp-1 group-hover:text-brand-700 transition">
                  {project.title}
                </h3>
                <div className="text-[11px] text-ink-500">
                  Updated {fromNow(project.updatedAt)}
                </div>
              </div>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>

          {project.description && (
            <p className="mt-3 text-sm text-ink-500 line-clamp-2">{project.description}</p>
          )}

          <div className="mt-5">
            <ProgressBar
              value={pct}
              label={`${stats.done}/${stats.total} tasks done`}
              showValue
            />
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-ink-100">
            <div className="flex items-center gap-2">
              <AvatarStack users={project.members || []} max={4} />
              <span className="text-xs text-ink-500 flex items-center gap-1">
                <FiUsers className="w-3.5 h-3.5" />
                {(project.members || []).length}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <FiCheckSquare className="w-3.5 h-3.5" />
              {stats.total} tasks
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
