import { useEffect, useState } from "react";
import { subscribeToProjects } from "../../utils/projectService";

export default function ProjectFeed() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToProjects(setProjects);
        return unsubscribe;
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Live Project Feed</h2>
            {projects.length === 0 && <p>No projects yet.</p>}
            <ul>
                {projects.map((proj) => (
                    <li key={proj.id} className="border p-4 mb-2 rounded-lg">
                        <h3 className="font-semibold">{proj.title}</h3>
                        <p>{proj.description}</p>
                        <p className="text-sm text-gray-500">Stage: {proj.stage}</p>
                        <p className="text-sm text-gray-500">Support Needed: {proj.supportNeeded.join(", ")}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}