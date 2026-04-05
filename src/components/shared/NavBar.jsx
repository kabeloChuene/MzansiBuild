import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="bg-primary-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <Link to="/feed" className="text-xl font-bold tracking-tight">
                Mzansi<span className="text-primary-300">Builds</span>
            </Link>

            <div className="flex items-center gap-4">
                {currentUser ? (
                    <>
                        <Link to="/feed" className="text-sm hover:text-primary-300 transition-colors">
                            Feed
                        </Link>
                        <Link to="/wall" className="text-sm hover:text-primary-300 transition-colors">
                            Wall
                        </Link>
                        <Link to="/dashboard" className="text-sm hover:text-primary-300 transition-colors">
                            My Projects
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm hover:text-primary-300 transition-colors">
                            Sign in
                        </Link>
                        <Link to="/signup" className="text-sm bg-primary-700 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-colors">
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}