// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { currentUser, logout } = useAuth();

    return (
        <div className="p-4">
            <h1 className="text-2xl">Welcome, {currentUser?.email}</h1>
            <button
                onClick={logout}
                className="mt-4 bg-red-600 text-white p-2 rounded"
            >
                Log Out
            </button>
        </div>
    );
}