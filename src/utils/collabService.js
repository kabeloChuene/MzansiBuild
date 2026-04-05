import { db } from "../firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Raise collaboration request
export const raiseCollaborationRequest = async (projectId, requestData) => {
    const requestsCol = collection(db, "projects", projectId, "collaborationRequests");
    return await addDoc(requestsCol, {
        ...requestData,
        createdAt: new Date(),
    });
};

// Subscribe to collaboration requests
export const subscribeToRequests = (projectId, callback) => {
    const requestsCol = collection(db, "projects", projectId, "collaborationRequests");
    const q = query(requestsCol, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(requests);
    });
};