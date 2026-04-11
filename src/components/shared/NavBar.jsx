// src/components/shared/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Home, PlusCircle, Trophy } from 'lucide-react'  // ✅ Add Trophy

export default function Navbar() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/feed" className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            MzansiBuilds
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/feed"
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <Home size={18} />
                            <span className="hidden sm:inline">Feed</span>
                        </Link>

                        {/* ✅ Celebration Wall Link */}
                        <Link
                            to="/celebration"
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <Trophy size={18} />
                            <span className="hidden sm:inline">Celebration Wall</span>
                        </Link>

                        <Link
                            to="/projects/new"
                            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <PlusCircle size={16} />
                            <span className="hidden sm:inline">New Project</span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
                                {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}