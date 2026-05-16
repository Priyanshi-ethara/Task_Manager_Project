# Stackly — Team Task Manager

A modern, full-stack team task manager built with the MERN stack. Stackly delivers a **production-grade SaaS dashboard** experience — fluid animations, glassmorphism, drag-and-drop Kanban, live analytics and role-based access — without the bloat of typical CRUD admin templates.

> **Tech**: React 18 · Vite · Tailwind CSS · Framer Motion · Node.js · Express · MongoDB · JWT

---

## ✨ Highlights

- 🪄 **Premium SaaS UI** inspired by Linear, Notion and Vercel — gradients, aurora backgrounds, glass surfaces, micro-interactions.
- 📊 **Dashboard analytics** — stat cards, 7-day productivity chart, status distribution, leaderboard, activity timeline, upcoming deadlines.
- 🗂️ **Kanban board** with drag-and-drop status changes and inline add buttons per column.
- 🔍 **Powerful filters** — search, project, priority, assignee, overdue, "only mine".
- 🔐 **Role-based access** — admin & member, with first-registered user auto-promoted to admin.
- 🧑‍🤝‍🧑 **Project membership** — add/remove teammates, owner protection, scoped data access.
- 💬 **Task comments**, tags, due-date logic with overdue badges.
- 🎨 **Animated everything** — sidebar transitions, page transitions, toast notifications, skeleton loaders, empty states.
- 📱 **Fully responsive** with mobile nav drawer.
- 🛡️ Hardened backend — Helmet, CORS allow-list, rate-limiting on `/auth`, validation, structured error handling.

---

## 📸 Screenshots

> Replace the placeholders below with real screenshots after running the app locally.

| Dashboard | Kanban | Login |
|-----------|--------|-------|
| `./docs/screenshot-dashboard.png` | `./docs/screenshot-kanban.png` | `./docs/screenshot-login.png` |

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js **18+**
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Clone & install

```bash
git clone <your-repo-url> stackly
cd stackly
npm run install:all
```

### 3. Configure environment

Copy the example files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set `MONGO_URI` + `JWT_SECRET`.

### 4. Run in development

From the project root:

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

The Vite dev server proxies `/api` to the backend, so the app works out of the box.

> The **first** user that registers automatically becomes the workspace **admin**.

---

## 📁 Folder Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/           # MongoDB connection
│   │   ├── controllers/      # Auth, User, Project, Task controllers
│   │   ├── middleware/       # auth, error handler
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Token helper
│   │   └── server.js         # App entry
│   ├── .env.example
│   ├── package.json
│   └── railway.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/         # ProtectedRoute
│   │   │   ├── dashboard/    # StatCard, charts, timeline, widgets
│   │   │   ├── layout/       # Sidebar, Topbar, MainLayout
│   │   │   ├── projects/     # ProjectCard, ProjectModal
│   │   │   ├── tasks/        # KanbanBoard, TaskCard, TaskModal
│   │   │   └── ui/           # Button, Card, Modal, Avatar, Badge, Skeleton, …
│   │   ├── context/          # AuthContext, ToastContext
│   │   ├── pages/            # Login, Register, Dashboard, Projects, …
│   │   ├── services/         # axios + API services
│   │   ├── utils/            # helpers, formatters, constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── README.md
├── package.json              # Root scripts (concurrent dev)
├── railway.json              # Railway deploy descriptor
└── .gitignore
```

---

## 🔌 API Documentation

All endpoints are prefixed with `/api`. Routes marked **🔒** require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | `{ name, email, password }` | Create account (first user becomes admin) |
| `POST` | `/auth/login` | `{ email, password }` | Returns JWT + user |
| `GET`  | `/auth/me` 🔒 | – | Get current user |
| `PUT`  | `/auth/me` 🔒 | `{ name?, title?, avatarColor?, password? }` | Update profile |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/users?search=` 🔒 | List users |
| `GET`    | `/users/:id` 🔒 | Get user |
| `PUT`    | `/users/:id/role` 🔒 (admin) | Body: `{ role }` |
| `DELETE` | `/users/:id` 🔒 (admin) | Remove user |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/projects?search=&status=` 🔒 | List accessible projects with stats |
| `GET`    | `/projects/:id` 🔒 | Get a project |
| `POST`   | `/projects` 🔒 | Body: `{ title, description?, color?, icon?, members?, status? }` |
| `PUT`    | `/projects/:id` 🔒 | Update (owner or admin only) |
| `DELETE` | `/projects/:id` 🔒 | Delete (cascades tasks) |
| `POST`   | `/projects/:id/members` 🔒 | Body: `{ userId }` |
| `DELETE` | `/projects/:id/members/:userId` 🔒 | Remove member |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/tasks` 🔒 | Filters: `project, status, priority, assignedTo, search, overdue, mine, sort` |
| `GET`    | `/tasks/:id` 🔒 | Get a task |
| `POST`   | `/tasks` 🔒 | Body: `{ title, project, description?, priority?, status?, dueDate?, assignedTo?, tags? }` |
| `PUT`    | `/tasks/:id` 🔒 | Update fields |
| `DELETE` | `/tasks/:id` 🔒 | Delete |
| `POST`   | `/tasks/:id/comments` 🔒 | Body: `{ text }` |
| `GET`    | `/tasks/analytics/overview` 🔒 | Dashboard analytics payload |

### Health

| Method | Endpoint |
|--------|----------|
| `GET` | `/health` |

---

## 🗃️ Data Models

**User** — `name, email, password (hashed), role (admin | member), avatarColor, title, timestamps`

**Project** — `title, description, color, icon, status, members[User], createdBy, timestamps`

**Task** — `title, description, priority (low | medium | high | urgent), status (todo | in_progress | review | done), dueDate, completedAt, assignedTo, project, createdBy, tags[], comments[], order, timestamps` + virtual `isOverdue`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Example |
|----------|----------|---------|
| `PORT` | optional | `5000` |
| `NODE_ENV` | optional | `development` |
| `MONGO_URI` | ✅ | `mongodb+srv://...` |
| `JWT_SECRET` | ✅ | long random string |
| `JWT_EXPIRES_IN` | optional | `7d` |
| `CLIENT_URL` | optional | `http://localhost:5173` (comma-separated for multiple) |

### Frontend (`frontend/.env`)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | ✅ for production | `https://your-api.up.railway.app/api` |

---

## ☁️ Deployment

### MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a DB user with read/write access.
3. Allow connections from anywhere (`0.0.0.0/0`) while testing.
4. Copy the **connection string** and put it in `MONGO_URI`.

### Backend on Railway

1. Push this repo to GitHub.
2. On [Railway](https://railway.app), click **New Project → Deploy from GitHub repo**.
3. In **Settings**, set the **Root Directory** to `backend` (or leave at root — the bundled `railway.json` is configured to build & start it).
4. Add the env vars from the table above. Set `CLIENT_URL` to your frontend's URL.
5. Railway auto-deploys on push. The health check at `/api/health` validates rollouts.

### Frontend (Vercel / Netlify / Railway static)

The frontend is a static Vite app:

```bash
cd frontend
npm run build      # outputs dist/
```

Deploy `frontend/dist` to your provider of choice. Set `VITE_API_URL` to your Railway API URL before building.

> If you host frontend + backend on different domains, add the frontend origin to `CLIENT_URL` in the backend.

---

## 🧱 Architecture Notes

- **MVC backend** with controllers, models, routes, middleware separated cleanly.
- **JWT** is issued on login/register and read by an axios interceptor.
- **Role-based access** is enforced both at the route level (`adminOnly`) and inside controllers (project ownership + membership checks).
- **Frontend state** is handled with **Context API** (`AuthContext`, `ToastContext`) — sufficient for this scope without the Redux ceremony.
- **Vite proxy** routes `/api/*` in dev to the backend, so a single command starts everything.
- **Tailwind theme** ships custom colors, fonts (Inter + Sora), aurora gradients, and keyframes for shimmer/float/pulse animations.

---

## 🧰 Useful Scripts

```bash
# Root
npm run install:all   # installs backend + frontend deps
npm run dev           # runs both in parallel (requires `concurrently`)
npm run build         # builds frontend

# Backend
npm run dev           # nodemon
npm start             # production
```

---

## 📝 License

MIT — Build something great with it. ✨
