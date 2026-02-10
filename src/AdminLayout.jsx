import { Outlet } from 'react-router-dom'
import { useMessage } from './Context/MessageContext.jsx'
import { useState, useEffect } from 'react'

// Message Component (same as in Layout.jsx)
const Message = ({ type, text, visible, isClosing, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (visible && !isClosing) {
            // Start animation after component mounts
            setTimeout(() => setIsAnimating(true), 10)
        } else {
            setIsAnimating(false)
        }
    }, [visible, isClosing])

    if (!visible) return null

    const typeStyles = {
        success: 'bg-green-500 text-white border-green-600',
        error: 'bg-red-500 text-white border-red-600',
        warning: 'bg-yellow-500 text-black border-yellow-600',
        info: 'bg-blue-500 text-white border-blue-600'
    }

    return (
        <div className={`fixed top-20 right-4 z-60 p-4 rounded-lg border-l-4 shadow-2xl transition-all duration-300 ease-out ${typeStyles[type]} max-w-sm ${
            isClosing ? '-translate-y-full opacity-0' : isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
            <div className="flex items-center justify-between">
                <span className="font-semibold">{text}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-xl font-bold hover:opacity-75 transition-opacity focus:outline-none cursor-pointer"
                    aria-label="Close notification"
                >
                    ×
                </button>
            </div>
        </div>
    )
}

function AdminLayout() {
    const { message, hideMessage } = useMessage()

    return (
        <>
            <Message
                type={message.type}
                text={message.text}
                visible={message.visible}
                isClosing={message.isClosing}
                onClose={hideMessage}
            />
            <Outlet />
            {/* No Footer here - admin pages don't need it */}
        </>
    )
}

export default AdminLayout