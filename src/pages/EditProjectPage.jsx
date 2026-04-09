// src/pages/EditProjectPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function EditProjectPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        techStack: [],
        supportNeeded: [],
        stage: 'Idea'
    })

    const [techInput, setTechInput] = useState('')
    const [supportInput, setSupportInput] = useState('')

    const stages = ['Idea', 'Prototype', 'MVP', 'Launch', 'Growth']

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'projects', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const projectData = { id: docSnap.id, ...docSnap.data() }

                    if (projectData.ownerId !== currentUser?.uid) {
                        setError('You do not have permission to edit this project')
                        setTimeout(() => navigate('/feed'), 2000)
                        return
                    }

                    setFormData({
                        name: projectData.name || '',
                        description: projectData.description || '',
                        techStack: projectData.techStack || [],
                        supportNeeded: projectData.supportNeeded || [],
                        stage: projectData.stage || 'Idea'
                    })
                } else {
                    setError('Project not found')
                    setTimeout(() => navigate('/feed'), 2000)
                }
            } catch (err) {
                console.error('Error fetching project:', err)
                setError('Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (currentUser) {
            fetchProject()
        }
    }, [id, currentUser, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const addTechTag = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, techInput.trim()]
            }))
            setTechInput('')
        }
    }

    const removeTechTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(t => t !== tag)
        }))
    }

    const addSupportTag = () => {
        if (supportInput.trim() && !formData.supportNeeded.includes(supportInput.trim())) {
            setFormData(prev => ({
                ...prev,
                supportNeeded: [...prev.supportNeeded, supportInput.trim()]
            }))
            setSupportInput('')
        }
    }

    const removeSupportTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            supportNeeded: prev.supportNeeded.filter(s => s !== tag)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError('Project name is required')
            return
        }

        if (!formData.description.trim()) {
            setError('Project description is required')
            return
        }

        setSaving(true)
        setError(null)

        try {
            const projectRef = doc(db, 'projects', id)
            await updateDoc(projectRef, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                techStack: formData.techStack,
                supportNeeded: formData.supportNeeded,
                stage: formData.stage,
                updatedAt: new Date()
            })

            navigate(`/projects/${id}`)
        } catch (err) {
            console.error('Error updating project:', err)
            setError('Failed to update project. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this project? This action cannot be undone.')

        if (!confirmed) return

        setDeleting(true)
        setError(null)

        try {
            const projectRef = doc(db, 'projects', id)
            await deleteDoc(projectRef)
            navigate('/feed')
        } catch (err) {
            console.error('Error deleting project:', err)
            setError('Failed to delete project. Please try again.')
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={18} />
                        {deleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., MzansiBuild"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Describe your project..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Stage
                            </label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {stages.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tech Stack
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g., React, Firebase, Tailwind"
                                />
                                <button
                                    type="button"
                                    onClick={addTechTag}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.techStack.map(tag => (
                                    <span
                                        key={tag}
                                        onClick={() => removeTechTag(tag)}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                                    >
                                        {tag}
                                        <span className="text-xs">&times;</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Support Needed
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={supportInput}
                                    onChange={(e) => setSupportInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSupportTag())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g., co-founder, funding, mentorship"
                                />
                                <button
                                    type="button"
                                    onClick={addSupportTag}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.supportNeeded.map(tag => (
                                    <span
                                        key={tag}
                                        onClick={() => removeSupportTag(tag)}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-sm cursor-pointer hover:bg-primary-100"
                                    >
                                        {tag}
                                        <span className="text-xs">&times;</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 btn-primary py-2 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>

                            <Link
                                to={`/projects/${id}`}
                                className="flex-1 px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}