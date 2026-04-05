// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        {/* You can add <Route path="/feed" element={<Feed />} /> later */}
      </Routes>
    </Router>
  );
}