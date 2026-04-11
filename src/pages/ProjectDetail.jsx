// src/pages/ProjectDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import CommentSection from '../components/comments/CommentSection'
import Milestones from '../components/milestones/Milestones'  // ✅ Add this
import { MessageCircle, Hand, ArrowLeft, Edit, Users } from 'lucide-react'
import { getStageBadgeClass } from '../utils/stageHelpers'
import { formatRelativeTime } from '../utils/formatRelativeTime'

export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasRaisedHand, setHasRaisedHand] = useState(false)
    const [raisingHand, setRaisingHand] = useState(false)

    const isOwner = currentUser?.uid === project?.ownerId

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'projects', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const projectData = { id: docSnap.id, ...docSnap.data() }
                    setProject(projectData)

                    if (currentUser && projectData.raisedHands?.includes(currentUser.uid)) {
                        setHasRaisedHand(true)
                    }
                } else {
                    setError('Project not found')
                }
            } catch (err) {
                console.error('Error fetching project:', err)
                setError('Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [id, currentUser])

    const handleRaiseHand = async () => {
        if (!currentUser) {
            navigate('/login')
            return
        }

        setRaisingHand(true)
        try {
            const projectRef = doc(db, 'projects', id)

            if (hasRaisedHand) {
                await updateDoc(projectRef, {
                    raisedHands: arrayRemove(currentUser.uid)
                })
                setHasRaisedHand(false)
                setProject(prev => ({
                    ...prev,
                    raisedHands: prev.raisedHands?.filter(uid => uid !== currentUser.uid) || []
                }))
            } else {
                await updateDoc(projectRef, {
                    raisedHands: arrayUnion(currentUser.uid)
                })
                setHasRaisedHand(true)
                setProject(prev => ({
                    ...prev,
                    raisedHands: [...(prev.raisedHands || []), currentUser.uid]
                }))
            }
        } catch (err) {
            console.error('Error updating hand:', err)
        } finally {
            setRaisingHand(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link to="/feed" className="text-primary-600 hover:underline">
                        ← Back to Feed
                    </Link>
                </div>
            </div>
        )
    }

    if (!project) return null

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Feed
                </button>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white text-lg font-bold">
                                    {project.ownerName?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{project.ownerName}</p>
                                    <p className="text-sm text-gray-500">
                                        Updated {formatRelativeTime(project.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            <span className={getStageBadgeClass(project.stage)}>
                                {project.stage}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.name}</h1>
                        <p className="text-gray-700 leading-relaxed">{project.description}</p>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="space-y-3">
                            {project.techStack?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map(tag => (
                                            <span key={tag} className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.supportNeeded?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Support Needed</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.supportNeeded.map(s => (
                                            <span key={s} className="text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.raisedHands?.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users size={16} />
                                    <span>{project.raisedHands.length} developer{project.raisedHands.length !== 1 ? 's' : ''} interested</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <MessageCircle size={18} />
                                <span>{project.commentCount || 0} Comments</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isOwner ? (
                                <Link
                                    to={`/projects/${project.id}/edit`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit Project
                                </Link>
                            ) : currentUser && (
                                <button
                                    onClick={handleRaiseHand}
                                    disabled={raisingHand}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${hasRaisedHand
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    <Hand size={16} />
                                    {hasRaisedHand ? 'Hand Raised ✓' : 'Raise Hand'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ✅ Milestones Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <Milestones projectId={project.id} isOwner={isOwner} />
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
                    <CommentSection projectId={project.id} />
                </div>
            </div>
        </div>
    )
}