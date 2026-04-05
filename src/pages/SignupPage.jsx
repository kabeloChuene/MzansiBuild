// src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signup(email, password);
            navigate("/feed");
        } catch (err) {
            setError("Failed to sign up. Try a different email.");
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
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
                    Sign Up
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