import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/shared/Navbar";
import { STAGES, SUPPORT_OPTIONS } from "../utils/stageHelpers";

export default function NewProjectPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stage, setStage] = useState("idea");
    const [techStack, setTechStack] = useState("");
    const [supportNeeded, setSupportNeeded] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSupportToggle = (option) => {
        setSupportNeeded((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return alert("Project name is required");

        setLoading(true);

        try {
            await addDoc(collection(db, "projects"), {
                name,
                description,
                stage,
                techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
                supportNeeded,
                ownerId: currentUser.uid,
                ownerName: currentUser.email, // you can improve later
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                isComplete: false,
                commentCount: 0,
            });

            navigate("/feed"); // redirect after creation
        } catch (err) {
            console.error(err);
            alert("Failed to create project");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Project Name */}
                    <input
                        type="text"
                        placeholder="Project name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Describe your project..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded"
                        rows={4}
                    />

                    {/* Stage */}
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="p-2 border rounded"
                    >
                        {STAGES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                    {/* Tech Stack */}
                    <input
                        type="text"
                        placeholder="Tech stack (comma separated e.g React, Firebase)"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        className="p-2 border rounded"
                    />

                    {/* Support Needed */}
                    <div>
                        <p className="text-sm font-medium mb-2">Support Needed:</p>
                        <div className="flex flex-wrap gap-2">
                            {SUPPORT_OPTIONS.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    onClick={() => handleSupportToggle(option)}
                                    className={`text-xs px-3 py-1 rounded-full border ${supportNeeded.includes(option)
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}