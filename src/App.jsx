import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";

import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import Feed from "./pages/Feed";
import NewProjectPage from "./pages/NewProjectPage";
import ProjectDetail from './pages/ProjectDetail';
import EditProjectPage from './pages/EditProjectPage';
import CelebrationWall from './pages/CelebrationWall';  // ✅ Add this import

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <NewProjectPage />
            </ProtectedRoute>
          }
        />

        {/* Edit Project Route */}
        <Route
          path="/projects/:id/edit"
          element={
            <ProtectedRoute>
              <EditProjectPage />
            </ProtectedRoute>
          }
        />

        {/* Project Detail Route */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        {/* ✅ Celebration Wall Route */}
        <Route
          path="/celebration"
          element={
            <ProtectedRoute>
              <CelebrationWall />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  );
}