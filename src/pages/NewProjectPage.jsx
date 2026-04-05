import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import { STAGES, SUPPORT_OPTIONS } from '../utils/stageHelpers'

export default function NewProjectPage() {
    const { currentUser, userProfile } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        description: '',
        stage: 'idea',
        techStack: '',
        supportNeeded: [],
        repoUrl: '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Project name is required'
        if (form.name.length > 100) e.name = 'Max 100 characters'
        if (!form.description.trim()) e.description = 'Description is required'
        if (form.description.length > 500) e.description = 'Max 500 characters'
        return e
    }

    const handleSupport = (option) => {
        setForm(prev => ({
            ...prev,
            supportNeeded: prev.supportNeeded.includes(option)
                ? prev.supportNeeded.filter(s => s !== option)
                : [...prev.supportNeeded, option],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) return setErrors(errs)

        setLoading(true)
        try {
            await addDoc(collection(db, 'projects'), {
                name: form.name.trim(),
                description: form.description.trim(),
                stage: form.stage,
                techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
                supportNeeded: form.supportNeeded,
                repoUrl: form.repoUrl.trim(),
                ownerId: currentUser.uid,
                ownerName: userProfile?.displayName || currentUser.email.split('@')[0],
                ownerAvatar: userProfile?.avatarUrl || '',
                commentCount: 0,
                isComplete: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            navigate('/feed')
        } catch (err) {
            console.error(err)
            setErrors({ submit: 'Failed to create project. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-xl mx-auto px-4 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Start a new project</h1>
                    <p className="text-sm text-gray-500 mt-1">Share what you're building with the community</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

                    <div>
                        <label className="label">Project name *</label>
                        <input
                            className={`input ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                            placeholder="e.g. MzansiBuilds"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="label">Description *</label>
                        <textarea
                            className={`input resize-none h-24 ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
                            placeholder="What are you building and why?"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">{form.description.length}/500</p>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="label">Current stage *</label>
                        <select
                            className="input"
                            value={form.stage}
                            onChange={e => setForm({ ...form, stage: e.target.value })}
                        >
                            {STAGES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">Tech stack</label>
                        <input
                            className="input"
                            placeholder="React, Firebase, Tailwind (comma separated)"
                            value={form.techStack}
                            onChange={e => setForm({ ...form, techStack: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Separate each technology with a comma</p>
                    </div>

                    <div>
                        <label className="label">Support needed</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {SUPPORT_OPTIONS.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSupport(option)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.supportNeeded.includes(option)
                                        ? 'bg-primary-700 text-white border-primary-700'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">GitHub repo URL</label>
                        <input
                            className="input"
                            placeholder="https://github.com/username/repo"
                            value={form.repoUrl}
                            onChange={e => setForm({ ...form, repoUrl: e.target.value })}
                        />
                    </div>

                    {errors.submit && (
                        <p className="text-red-500 text-sm">{errors.submit}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? 'Creating...' : 'Create project'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/feed')}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}