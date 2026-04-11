// src/components/milestones/Milestones.jsx
import { useEffect, useState } from 'react'
import { collection, query, orderBy, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'  // ✅ Fixed path (two levels up)
import { useAuth } from '../../context/AuthContext'  // ✅ Fixed path
import { formatRelativeTime } from '../../utils/formatRelativeTime'  // ✅ Fixed path
import { Calendar, Plus, Trash2, Target } from 'lucide-react'

export default function Milestones({ projectId, isOwner }) {
    const [milestones, setMilestones] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        achievedAt: new Date().toISOString().split('T')[0]
    })
    const [submitting, setSubmitting] = useState(false)
    const { currentUser } = useAuth()

    // Fetch milestones in real-time
    useEffect(() => {
        const q = query(
            collection(db, 'projects', projectId, 'milestones'),
            orderBy('achievedAt', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const milestonesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setMilestones(milestonesData)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [projectId])

    // Add new milestone
    const handleAddMilestone = async (e) => {
        e.preventDefault()

        if (!newMilestone.title.trim()) {
            alert('Please enter a milestone title')
            return
        }

        setSubmitting(true)

        try {
            await addDoc(collection(db, 'projects', projectId, 'milestones'), {
                title: newMilestone.title.trim(),
                description: newMilestone.description.trim(),
                achievedAt: new Date(newMilestone.achievedAt),
                createdAt: new Date(),
                userId: currentUser?.uid,
                userName: currentUser?.displayName || currentUser?.email
            })

            setNewMilestone({
                title: '',
                description: '',
                achievedAt: new Date().toISOString().split('T')[0]
            })
            setShowForm(false)
        } catch (error) {
            console.error('Error adding milestone:', error)
            alert('Failed to add milestone. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // Delete milestone
    const handleDelete = async (milestoneId) => {
        const confirmed = window.confirm('Are you sure you want to delete this milestone?')
        if (!confirmed) return

        try {
            await deleteDoc(doc(db, 'projects', projectId, 'milestones', milestoneId))
        } catch (error) {
            console.error('Error deleting milestone:', error)
            alert('Failed to delete milestone')
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-100 rounded mb-2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target size={20} className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
                    <span className="text-sm text-gray-500">({milestones.length})</span>
                </div>

                {isOwner && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                    >
                        <Plus size={16} />
                        Add Milestone
                    </button>
                )}
            </div>

            {/* Add Milestone Form */}
            {showForm && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <form onSubmit={handleAddMilestone}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Milestone Title *
                            </label>
                            <input
                                type="text"
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Completed user authentication"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (optional)
                            </label>
                            <textarea
                                value={newMilestone.description}
                                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="What did you accomplish? What challenges did you overcome?"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Achieved
                            </label>
                            <input
                                type="date"
                                value={newMilestone.achievedAt}
                                onChange={(e) => setNewMilestone({ ...newMilestone, achievedAt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? 'Adding...' : 'Add Milestone'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Milestones Timeline */}
            {milestones.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Target size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">
                        {isOwner
                            ? "No milestones yet. Click 'Add Milestone' to track your progress!"
                            : "No milestones have been added for this project yet."}
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-4">
                        {milestones.map((milestone) => (
                            <div key={milestone.id} className="relative flex gap-3">
                                {/* Timeline dot */}
                                <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>

                                {/* Milestone Card */}
                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <Calendar size={12} />
                                                <span>
                                                    {milestone.achievedAt?.toDate
                                                        ? formatRelativeTime(milestone.achievedAt.toDate())
                                                        : formatRelativeTime(milestone.achievedAt)
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {isOwner && (
                                            <button
                                                onClick={() => handleDelete(milestone.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {milestone.description && (
                                        <p className="text-gray-600 text-sm mt-2">{milestone.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}