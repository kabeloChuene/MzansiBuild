import { useEffect, useState } from "react";
import { raiseCollaborationRequest, subscribeToRequests } from "../../utils/collabService";

export default function CollabRequests({ projectId, user }) {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsubscribe = subscribeToRequests(projectId, setRequests);
        return unsubscribe;
    }, [projectId]);

    const handleRequest = async () => {
        if (!message) return;
        await raiseCollaborationRequest(projectId, {
            userId: user.uid,
            username: user.displayName || user.email,
            message,
        });
        setMessage("");
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Collaboration Requests</h3>
            <input
                type="text"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
            />
            <button onClick={handleRequest} className="bg-black text-white px-4 py-2 rounded">
                Raise Hand
            </button>

            <ul className="mt-4">
                {requests.map((r) => (
                    <li key={r.id} className="border p-2 mb-2 rounded">
                        <strong>{r.username}</strong>: {r.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}