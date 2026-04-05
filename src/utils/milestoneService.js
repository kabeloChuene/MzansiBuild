import { db } from "../firebase/config";
import { collection, addDoc, updateDoc, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

// Add a milestone to a project
export const addMilestone = async (projectId, milestoneData) => {
    const milestonesCol = collection(db, "projects", projectId, "milestones");
    return await addDoc(milestonesCol, {
        ...milestoneData,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

// Update milestone
export const updateMilestone = async (projectId, milestoneId, updates) => {
    const milestoneRef = doc(db, "projects", projectId, "milestones", milestoneId);
    updates.updatedAt = new Date();
    return await updateDoc(milestoneRef, updates);
};

// Subscribe to milestones of a project
export const subscribeToMilestones = (projectId, callback) => {
    const milestonesCol = collection(db, "projects", projectId, "milestones");
    const q = query(milestonesCol, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const milestones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(milestones);
    });
};