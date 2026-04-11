// src/pages/CelebrationWall.jsx - Fixed for lowercase stage names
import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import { Trophy, Sparkles, Rocket, Calendar, Users, CheckCircle } from 'lucide-react'
import { formatRelativeTime } from '../utils/formatRelativeTime'

export default function CelebrationWall() {
    const [completedProjects, setCompletedProjects] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch completed projects - using lowercase stage names
    useEffect(() => {
        const q = query(
            collection(db, 'projects'),
            where('stage', 'in', ['completed', 'shipped'])
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            // Sort on client side by updatedAt
            projects.sort((a, b) => {
                if (a.updatedAt?.toDate && b.updatedAt?.toDate) {
                    return b.updatedAt.toDate() - a.updatedAt.toDate()
                }
                return 0
            })
            setCompletedProjects(projects)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const getCelebrationMessage = (stage) => {
        if (stage === 'shipped') return '🚀 Just Shipped!'
        if (stage === 'completed') return '🎉 Project Complete!'
        return '🎉 Celebration!'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading celebration wall...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                        <Trophy size={20} />
                        <span className="font-semibold">Celebration Wall</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        🎉 Builders Who Made It! 🎉
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        These amazing developers took their ideas from concept to completion.
                        Join them on the wall of fame!
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <Trophy className="text-green-600" size={24} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{completedProjects.length}</div>
                        <div className="text-sm text-gray-500">Projects Completed</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {new Set(completedProjects.map(p => p.ownerId)).size}
                        </div>
                        <div className="text-sm text-gray-500">Happy Builders</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <Rocket className="text-green-600" size={24} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {completedProjects.filter(p => p.stage === 'shipped').length}
                        </div>
                        <div className="text-sm text-gray-500">Shipped Projects</div>
                    </div>
                </div>

                {completedProjects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Completed Projects Yet</h2>
                        <p className="text-gray-500 mb-6">Projects with stage "completed" or "shipped" will appear here.</p>
                        <Link to="/projects/new" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                            Start Your Project
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedProjects.map((project, index) => {
                            const gradients = [
                                'from-green-400 to-emerald-600',
                                'from-emerald-400 to-teal-600',
                                'from-green-500 to-lime-600',
                                'from-teal-400 to-green-600',
                                'from-lime-400 to-emerald-600'
                            ]
                            const gradient = gradients[index % gradients.length]

                            return (
                                <div
                                    key={project.id}
                                    className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

                                    <div className="p-6">
                                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full mb-3">
                                            <Sparkles size={12} />
                                            <span>{getCelebrationMessage(project.stage)}</span>
                                        </div>

                                        <Link to={`/projects/${project.id}`}>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                                                {project.name}
                                            </h3>
                                        </Link>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                                                {project.ownerName?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-xs text-gray-500">{project.ownerName}</span>
                                        </div>

                                        {project.techStack?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {project.techStack.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {project.techStack.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{project.techStack.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar size={12} />
                                                <span>{formatRelativeTime(project.updatedAt)}</span>
                                            </div>
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                            >
                                                Celebrate <span>→</span>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-green-500 rounded-full p-1">
                                            <CheckCircle size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">Ready to Join the Wall of Fame?</h3>
                        <p className="text-green-100 mb-4">Build something amazing and get celebrated by the community!</p>
                        <Link to="/projects/new" className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Start Your Journey 🚀
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}