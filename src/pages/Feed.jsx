// src/pages/Feed.jsx
import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import ProjectCard from '../components/feed/ProjectCard' // ✅ Folder name matches exactly

export default function Feed() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const { currentUser } = useAuth()

    useEffect(() => {
        const q = query(
            collection(db, 'projects'),
            orderBy('updatedAt', 'desc'),
            limit(20)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            setProjects(data)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Live Feed</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            See what developers are building right now
                        </p>
                    </div>
                    {currentUser && (
                        <Link to="/projects/new" className="btn-primary text-sm">
                            + New project
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card p-5 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-4">🛠️</p>
                        <h2 className="text-lg font-semibold text-gray-700">No projects yet</h2>
                        <p className="text-sm text-gray-500 mt-1">Be the first to build in public!</p>
                        {currentUser && (
                            <Link to="/projects/new" className="btn-primary inline-block mt-4 text-sm">
                                Start a project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}