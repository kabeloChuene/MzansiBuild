// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/feed");
        } catch (err) {
            setError("Failed to log in. Check email or password.");
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Log In
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-green-600 font-semibold">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}