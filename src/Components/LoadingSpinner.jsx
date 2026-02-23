import React from 'react'

function LoadingSpinner() {
    return (
        <div className="loading-spinner min-h-screen flex items-center justify-center bg-obsidian">
            <div className="animate-spin inline-block h-14 w-14 border-8 border-champagne border-t-transparent rounded-full" role="status" aria-label="Loading">
                <span className="sr-only">Loading</span>
            </div>
        </div>
    )
}

export default LoadingSpinner
