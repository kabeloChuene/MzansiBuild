// src/pages/Signup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Signup from "../components/auth/Signup.jsx";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic password validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signup(email, password);
            navigate("/"); // redirect to dashboard after signup
        } catch (err) {
            console.error(err.message);
            setError("Failed to create an account");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-2 border rounded focus:outline-green-600"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-2 border rounded focus:outline-green-600"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="p-2 border rounded focus:outline-green-600"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                >
                    Create Account
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 font-semibold">
                    Log In
                </Link>
            </p>
        </div>
    );
}