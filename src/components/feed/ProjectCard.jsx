// console.log('ProjectCard.jsx file is loading');
import { Link } from 'react-router-dom'
import { MessageCircle, Hand } from 'lucide-react'
import { getStageBadgeClass } from '../../utils/stageHelpers'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import { useAuth } from '../../context/AuthContext'

export default function ProjectCard({ project }) {
    const { currentUser } = useAuth()
    const isOwner = currentUser?.uid === project.ownerId

    return (
        <div className="card p-5 flex flex-col gap-3">

            {/* Header — owner info and stage badge */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {project.ownerName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-700">{project.ownerName}</p>
                        <p className="text-xs text-gray-400">{formatRelativeTime(project.updatedAt)}</p>
                    </div>
                </div>
                <span className={getStageBadgeClass(project.stage)}>
                    {project.stage}
                </span>
            </div>

            {/* Project name and description */}
            <div>
                <Link to={`/projects/${project.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-700 transition-colors cursor-pointer">
                        {project.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
            </div>

            {/* Tech stack tags */}
            {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Support needed */}
            {project.supportNeeded?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {project.supportNeeded.map(s => (
                        <span key={s} className="text-xs bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full">
                            needs {s}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer — comments and actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MessageCircle size={13} />
                    {project.commentCount || 0} comments
                </span>

                <div className="flex items-center gap-2">
                    {isOwner && (
                        <Link
                            to={`/projects/${project.id}/edit`}
                            className="text-xs text-primary-700 hover:underline font-medium"
                        >
                            Edit
                        </Link>
                    )}
                    {!isOwner && currentUser && (
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-700 transition-colors">
                            <Hand size={13} />
                            Raise hand
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// console.log('ProjectCard.jsx exports loaded');