import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const hasProjectAccess = (project, user) => {
  if (!project) return false;
  if (user.role === 'admin') return true;
  if (project.createdBy.equals(user._id)) return true;
  return project.members.some((m) => m.equals(user._id));
};

// @desc    Get tasks (with filtering)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const {
    project,
    status,
    priority,
    assignedTo,
    search,
    overdue,
    sort = '-createdAt',
    mine,
  } = req.query;

  const filter = {};

  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (mine === 'true') filter.assignedTo = req.user._id;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (overdue === 'true') {
    filter.dueDate = { $lt: new Date() };
    filter.status = { $ne: 'done' };
  }

  // Restrict to projects user has access to (unless admin)
  if (req.user.role !== 'admin') {
    const accessibleProjects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).select('_id');
    const ids = accessibleProjects.map((p) => p._id);
    filter.project = filter.project
      ? { $in: ids.filter((id) => id.equals(filter.project)) }
      : { $in: ids };
  }

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email avatarColor title')
    .populate('createdBy', 'name email avatarColor')
    .populate('project', 'title color icon')
    .sort(sort);

  res.json({ success: true, tasks });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatarColor title')
    .populate('createdBy', 'name email avatarColor')
    .populate('project', 'title color icon members createdBy')
    .populate('comments.user', 'name email avatarColor');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project._id || task.project);
  if (!hasProjectAccess(project, req.user)) {
    res.status(403);
    throw new Error('You do not have access to this task');
  }

  res.json({ success: true, task });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate, assignedTo, project, tags } = req.body;

  if (!title || !project) {
    res.status(400);
    throw new Error('Task title and project are required');
  }

  const projectDoc = await Project.findById(project);
  if (!projectDoc) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (!hasProjectAccess(projectDoc, req.user)) {
    res.status(403);
    throw new Error('You cannot create tasks in this project');
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate: dueDate || null,
    assignedTo: assignedTo || null,
    project,
    tags,
    createdBy: req.user._id,
  });

  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
    { path: 'project', select: 'title color icon' },
  ]);

  res.status(201).json({ success: true, task: populated });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  const projectDoc = await Project.findById(task.project);
  if (!hasProjectAccess(projectDoc, req.user)) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const fields = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo', 'tags', 'order'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) task[f] = req.body[f];
  });

  await task.save();
  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email avatarColor title' },
    { path: 'createdBy', select: 'name email avatarColor' },
    { path: 'project', select: 'title color icon' },
  ]);
  res.json({ success: true, task: populated });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  const projectDoc = await Project.findById(task.project);
  const isOwner = task.createdBy.equals(req.user._id);
  const isProjectOwner = projectDoc?.createdBy?.equals(req.user._id);
  if (!isOwner && !isProjectOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }
  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});

// @desc    Add comment
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  const projectDoc = await Project.findById(task.project);
  if (!hasProjectAccess(projectDoc, req.user)) {
    res.status(403);
    throw new Error('Not authorized');
  }
  task.comments.push({ user: req.user._id, text });
  await task.save();
  const populated = await task.populate('comments.user', 'name email avatarColor');
  res.status(201).json({ success: true, comments: populated.comments });
});

// @desc    Dashboard analytics
// @route   GET /api/tasks/analytics/overview
// @access  Private
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const projectFilter = isAdmin
    ? {}
    : { $or: [{ createdBy: userId }, { members: userId }] };
  const accessibleProjects = await Project.find(projectFilter).select('_id title color');
  const projectIds = accessibleProjects.map((p) => p._id);

  const baseMatch = { project: { $in: projectIds } };

  const [statusAgg, priorityAgg, totalTasks, overdueCount, myTasks, doneThisWeek] = await Promise.all([
    Task.aggregate([{ $match: baseMatch }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: baseMatch }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Task.countDocuments(baseMatch),
    Task.countDocuments({ ...baseMatch, dueDate: { $lt: new Date() }, status: { $ne: 'done' } }),
    Task.countDocuments({ ...baseMatch, assignedTo: userId, status: { $ne: 'done' } }),
    Task.countDocuments({
      ...baseMatch,
      status: 'done',
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  // 7-day completion trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const trendAgg = await Task.aggregate([
    {
      $match: {
        ...baseMatch,
        completedAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const trend = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const found = trendAgg.find((t) => t._id === key);
    trend.push({ date: key, count: found ? found.count : 0 });
  }

  // Upcoming deadlines
  const upcoming = await Task.find({
    ...baseMatch,
    dueDate: { $gte: new Date() },
    status: { $ne: 'done' },
  })
    .sort({ dueDate: 1 })
    .limit(6)
    .populate('assignedTo', 'name avatarColor')
    .populate('project', 'title color');

  // Recent activity (latest tasks updated)
  const recent = await Task.find(baseMatch)
    .sort({ updatedAt: -1 })
    .limit(8)
    .populate('assignedTo', 'name avatarColor')
    .populate('createdBy', 'name avatarColor')
    .populate('project', 'title color');

  // Per-member productivity
  const memberProductivity = await Task.aggregate([
    { $match: { ...baseMatch, assignedTo: { $ne: null } } },
    {
      $group: {
        _id: '$assignedTo',
        total: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        avatarColor: '$user.avatarColor',
        total: 1,
        done: 1,
      },
    },
    { $sort: { done: -1 } },
    { $limit: 6 },
  ]);

  const statusMap = { todo: 0, in_progress: 0, review: 0, done: 0 };
  statusAgg.forEach((s) => (statusMap[s._id] = s.count));
  const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
  priorityAgg.forEach((p) => (priorityMap[p._id] = p.count));

  res.json({
    success: true,
    analytics: {
      totals: {
        projects: projectIds.length,
        tasks: totalTasks,
        overdue: overdueCount,
        myTasks,
        doneThisWeek,
      },
      status: statusMap,
      priority: priorityMap,
      trend,
      upcoming,
      recent,
      memberProductivity,
    },
  });
});
