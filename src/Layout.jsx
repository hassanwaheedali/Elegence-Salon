import Footer from './Components/Footer.jsx'
import { Outlet, useLocation } from 'react-router-dom'
import { useMessage } from './Context/MessageContext.jsx'
import { useState, useLayoutEffect, useRef } from 'react'
import { ReactLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

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
        <div className={`fixed top-20 right-4 z-90 p-4 rounded-lg border-l-4 shadow-2xl transition-all duration-300 ease-out ${typeStyles[type]} max-w-sm ${isClosing ? '-translate-y-full opacity-0' : isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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
    const location = useLocation()
    const curtainRef = useRef(null)

    // Cinematic Route Wipe Sequence
    useGSAP(() => {
        // 1. Instantly snap to top while curtain is covering the screen
        window.scrollTo(0, 0)

        // 2. Guarantee curtain is drawn down perfectly over the new render immediately
        gsap.set(curtainRef.current, { y: '0%' })

        // 3. Smoothly unveil the new screen (sliding down)
        // setTimeout ensures React has fully painted the DOM before we drop the curtain
        setTimeout(() => {
            gsap.to(curtainRef.current, {
                y: '100%',
                duration: 1.2,
                ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // ease-luxury
                force3D: true
            })
        }, 50)
    }, { dependencies: [location.pathname] })

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true }}>
            {/* ── Obsidian Curtain (z-index highest) ── */}
            <div
                ref={curtainRef}
                className="fixed inset-0 bg-obsidian z-100 pointer-events-none flex items-center justify-center transform translate-y-0"
            >
                {/* Minimalist loading accent */}
                <div className="w-12 h-px bg-champagne/30"></div>
            </div>

            {/* Notification Layer */}
            <Message
                type={message.type}
                text={message.text}
                visible={message.visible}
                isClosing={message.isClosing}
                onClose={hideMessage}
            />

            <Outlet />
            <Footer />
        </ReactLenis>
    )
}

export default Layout