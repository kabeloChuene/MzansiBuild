// src/utils/formatRelativeTime.js

export function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Just now'

    // Handle Firestore Timestamp
    let date
    if (timestamp?.toDate) {
        date = timestamp.toDate()
    } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    } else {
        date = new Date(timestamp)
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    if (diffInSeconds < 60) {
        return 'Just now'
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    } else if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`
    } else if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
    } else {
        return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
    }
}