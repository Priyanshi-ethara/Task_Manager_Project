import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Members from './pages/Members';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

const RedirectIfAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <RedirectIfAuth>
          <Login />
        </RedirectIfAuth>
      }
    />
    <Route
      path="/register"
      element={
        <RedirectIfAuth>
          <Register />
        </RedirectIfAuth>
      }
    />

    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/members" element={<Members />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
