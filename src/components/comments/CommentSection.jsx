// src/components/comments/CommentSection.jsx
import { useState, useEffect } from 'react'
import { collection, query, orderBy, addDoc, deleteDoc, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import { MessageCircle, Trash2, Heart } from 'lucide-react'

export default function CommentSection({ projectId }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { currentUser } = useAuth()

    // Fetch comments in real-time
    useEffect(() => {
        const q = query(
            collection(db, 'projects', projectId, 'comments'),
            orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setComments(commentsData)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [projectId])

    // Handle like/unlike comment
    const handleLike = async (commentId, likes, userId) => {
        if (!currentUser) return

        const commentRef = doc(db, 'projects', projectId, 'comments', commentId)

        if (likes?.includes(currentUser.uid)) {
            await updateDoc(commentRef, {
                likes: arrayRemove(currentUser.uid)
            })
        } else {
            await updateDoc(commentRef, {
                likes: arrayUnion(currentUser.uid)
            })
        }
    }

    // Handle delete comment
    const handleDelete = async (commentId) => {
        if (!currentUser) return

        const confirmed = window.confirm('Are you sure you want to delete this comment?')
        if (!confirmed) return

        try {
            await deleteDoc(doc(db, 'projects', projectId, 'comments', commentId))
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
    }

    // Handle submit new comment
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!currentUser) {
            alert('Please login to comment')
            return
        }

        if (!newComment.trim()) return

        setSubmitting(true)

        try {
            await addDoc(collection(db, 'projects', projectId, 'comments'), {
                text: newComment.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                userPhoto: currentUser.photoURL || null,
                createdAt: new Date(),
                likes: []
            })

            // Update comment count on project
            const projectRef = doc(db, 'projects', projectId)
            await updateDoc(projectRef, {
                commentCount: comments.length + 1
            })

            setNewComment('')
        } catch (error) {
            console.error('Error adding comment:', error)
            alert('Failed to add comment. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-20 bg-gray-100 rounded mb-3"></div>
                    <div className="h-20 bg-gray-100 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Comment Form */}
            {currentUser ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                    <p>Please <a href="/login" className="text-primary-600 hover:underline">login</a> to join the conversation</p>
                </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {comment.userName?.charAt(0).toUpperCase() || '?'}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <span className="font-medium text-gray-900">{comment.userName}</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatRelativeTime(comment.createdAt)}
                                        </span>
                                    </div>

                                    {/* Delete button (only for comment owner) */}
                                    {currentUser?.uid === comment.userId && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <p className="text-gray-700 mb-2">{comment.text}</p>

                                {/* Like button */}
                                <button
                                    onClick={() => handleLike(comment.id, comment.likes, currentUser?.uid)}
                                    className={`flex items-center gap-1 text-xs transition-colors ${comment.likes?.includes(currentUser?.uid)
                                        ? 'text-red-500'
                                        : 'text-gray-500 hover:text-red-500'
                                        }`}
                                >
                                    <Heart size={14} fill={comment.likes?.includes(currentUser?.uid) ? 'currentColor' : 'none'} />
                                    <span>{comment.likes?.length || 0} likes</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}