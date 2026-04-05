import { db } from "../firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

// Add new project
export const createProject = async (projectData) => {
    const projectsCol = collection(db, "projects");
    return await addDoc(projectsCol, {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isComplete: false,
    });
};

// Update project progress
export const updateProject = async (projectId, updates) => {
    const projectRef = doc(db, "projects", projectId);
    updates.updatedAt = new Date();
    return await updateDoc(projectRef, updates);
};

// Get live feed (realtime updates)
export const subscribeToProjects = (callback) => {
    const projectsCol = collection(db, "projects");
    const q = query(projectsCol, orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(projects);
    });
};