import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged, signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)

            if (user) {
                const profileRef = doc(db, 'users', user.uid)
                const profileSnap = await getDoc(profileRef)

                if (!profileSnap.exists()) {
                    // First sign-in — create the Firestore profile document
                    const newProfile = {
                        uid: user.uid,
                        displayName: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        bio: '',
                        avatarUrl: user.photoURL || '',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    }
                    await setDoc(profileRef, newProfile)
                    setUserProfile(newProfile)
                } else {
                    setUserProfile(profileSnap.data())
                }
            } else {
                setUserProfile(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password)

    const signup = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password)

    const logout = () => signOut(auth)

    return (
        <AuthContext.Provider value={{ currentUser, userProfile, setUserProfile, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}