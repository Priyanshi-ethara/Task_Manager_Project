import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const ensureAccess = (project, user) => {
  if (!project) return false;
  if (user.role === 'admin') return true;
  if (project.createdBy._id?.equals?.(user._id) || project.createdBy.equals?.(user._id)) return true;
  return project.members.some((m) => (m._id?.equals?.(user._id) || m.equals?.(user._id)));
};

// @desc    Get all projects visible to user
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
  const { search = '', status } = req.query;
  const filter = {};

  if (req.user.role !== 'admin') {
    filter.$or = [{ createdBy: req.user._id }, { members: req.user._id }];
  }
  if (status) filter.status = status;
  if (search) {
    filter.$and = [
      filter.$or ? { $or: filter.$or } : {},
      { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] },
    ];
    delete filter.$or;
  }

  const projects = await Project.find(filter)
    .populate('members', 'name email role avatarColor title')
    .populate('createdBy', 'name email avatarColor')
    .sort({ updatedAt: -1 });

  // Attach stats
  const projectIds = projects.map((p) => p._id);
  const stats = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: { project: '$project', status: '$status' }, count: { $sum: 1 } } },
  ]);

  const statMap = {};
  stats.forEach((s) => {
    const pid = s._id.project.toString();
    if (!statMap[pid]) statMap[pid] = { total: 0, todo: 0, in_progress: 0, review: 0, done: 0 };
    statMap[pid][s._id.status] = s.count;
    statMap[pid].total += s.count;
  });

  const enriched = projects.map((p) => ({
    ...p.toObject(),
    stats: statMap[p._id.toString()] || { total: 0, todo: 0, in_progress: 0, review: 0, done: 0 },
  }));

  res.json({ success: true, projects: enriched });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email role avatarColor title')
    .populate('createdBy', 'name email avatarColor');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!ensureAccess(project, req.user)) {
    res.status(403);
    throw new Error('You do not have access to this project');
  }

  res.json({ success: true, project });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, color, icon, members = [], status } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Project title is required');
  }

  const project = await Project.create({
    title,
    description,
    color,
    icon,
    status,
    members: [...new Set([req.user._id.toString(), ...members])],
    createdBy: req.user._id,
  });

  const populated = await project.populate([
    { path: 'members', select: 'name email role avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
  ]);

  res.status(201).json({ success: true, project: populated });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isOwner = project.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only the project owner or admin can update this project');
  }

  const fields = ['title', 'description', 'color', 'icon', 'status', 'members'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) project[f] = req.body[f];
  });

  // Ensure owner stays a member
  if (!project.members.some((m) => m.equals(project.createdBy))) {
    project.members.push(project.createdBy);
  }

  await project.save();
  const populated = await project.populate([
    { path: 'members', select: 'name email role avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
  ]);

  res.json({ success: true, project: populated });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isOwner = project.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only the project owner or admin can delete this project');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ success: true, message: 'Project deleted' });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  const isOwner = project.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to add members');
  }
  if (!project.members.some((m) => m.equals(userId))) {
    project.members.push(userId);
    await project.save();
  }
  const populated = await project.populate([
    { path: 'members', select: 'name email role avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
  ]);
  res.json({ success: true, project: populated });
});

// @desc    Remove member
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  const isOwner = project.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }
  if (project.createdBy.equals(req.params.userId)) {
    res.status(400);
    throw new Error('Cannot remove the project owner');
  }
  project.members = project.members.filter((m) => !m.equals(req.params.userId));
  await project.save();
  const populated = await project.populate([
    { path: 'members', select: 'name email role avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
  ]);
  res.json({ success: true, project: populated });
});
