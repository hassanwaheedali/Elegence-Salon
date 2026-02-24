import { Outlet, useNavigate } from 'react-router-dom'
import { useMessage } from './Context/MessageContext.jsx'
import { useState, useLayoutEffect } from 'react'
import { useAuth } from './Context/AuthContext.jsx'
import StaffSidebar from './Components/StaffPanel Components/StaffSidebar.jsx'
import { Menu, Bell } from 'lucide-react'

// Message Component (reused from AdminLayout)
const Message = ({ type, text, visible, isClosing, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useLayoutEffect(() => {
        if (visible && !isClosing) {
            const timer = setTimeout(() => setIsAnimating(true), 10)
            return () => clearTimeout(timer)
        }
    }, [visible, isClosing])

    if (!visible) return null

    const typeStyles = {
        success: 'bg-green-500 text-white border-green-600',
        error: 'bg-red-500 text-white border-red-600',
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

function StaffLayout() {
    const { message, hideMessage } = useMessage()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const { logout, currentUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-obsidian overflow-hidden text-white/70 font-sans">
            <Message
                type={message.type}
                text={message.text}
                visible={message.visible}
                isClosing={message.isClosing}
                onClose={hideMessage}
            />

            <StaffSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                handleLogout={handleLogout}
                currentUser={currentUser}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-14 sm:h-16 lg:h-20 bg-obsidian/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-30 top-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-champagne-muted hover:text-champagne hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right mr-4">
                            <div className="text-sm font-bold text-white">{currentUser?.name}</div>
                            <div className="text-xs text-champagne uppercase tracking-wider">{currentUser?.role || 'Staff'}</div>
                        </div>
                        <button className="relative p-2 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer hover:bg-white/5 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-champagne rounded-full ring-2 ring-obsidian"></span>
                        </button>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default StaffLayout
