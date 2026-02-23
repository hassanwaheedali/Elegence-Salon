import Footer from './Components/Footer.jsx'
import { Outlet } from 'react-router-dom'
import { useMessage } from './Context/MessageContext.jsx'
import { useState, useLayoutEffect } from 'react'

// Message Component
const Message = ({ type, text, visible, isClosing, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useLayoutEffect(() => {
        if (visible && !isClosing) {
            // Start animation after component mounts
            const timer = setTimeout(() => setIsAnimating(true), 10)
            return () => clearTimeout(timer)
        }
    }, [visible, isClosing])

    if (!visible) return null

    const typeStyles = {
        success: 'bg-green-800 text-white border-green-600',
        error: 'bg-red-900 text-white border-red-600',
        warning: 'bg-champagne text-obsidian border-champagne-dark',
        info: 'bg-blue-500 text-white border-blue-600'
    }

    return (
        <div className={`fixed top-20 right-4 z-60 p-4 rounded-lg border-l-4 shadow-2xl transition-all duration-300 ease-out ${typeStyles[type]} max-w-sm ${isClosing ? '-translate-y-full opacity-0' : isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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

function Layout() {
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
            {/* LENIS: Wrap <Outlet /> in <ReactLenis root> when @studio-freight/lenis is installed.
                import ReactLenis from '@studio-freight/react-lenis'
                <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
                  <Outlet />
                </ReactLenis>
            */}
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout