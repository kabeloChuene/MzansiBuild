// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import NewProjectPage from './pages/NewProjectPage'
import ProtectedRoute from './components/shared/ProtectedRoute'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/projects/new" element={
          <ProtectedRoute><NewProjectPage /></ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        {/* You can add <Route path="/feed" element={<Feed />} /> later */}
      </Routes>
    </Router>
  );
}