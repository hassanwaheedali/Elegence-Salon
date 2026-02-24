
import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    MoreVertical
} from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'

const AppointmentMenu = ({ appointment, onEdit, onView }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
    const menuRef = useRef(null)
    const buttonRef = useRef(null)
    const { updateAppointment, deleteAppointment, cancelAppointment } = useAppointment()

    const toggleMenu = () => {
        if (!isOpen) {
            const rect = buttonRef.current.getBoundingClientRect()
            setMenuPosition({
                top: rect.bottom + 8, // 8px spacing, relative to viewport (fixed)
                left: rect.right - 192 // 192px is w-48, align right edge
            })
        }
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is inside the menu (which is in a portal now, so we need a ref on the portal content)
            // OR if click is on the button
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        // Close on scroll to prevent detached menu
        const handleScroll = () => {
            if (isOpen) setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('scroll', handleScroll, true) // standard scroll

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [isOpen])

    const handleQuickStatusChange = async () => {
        if (confirm('Are you sure you want to verify this appointment?')) {
            await updateAppointment(appointment.id, { status: 'Confirmed' })
            setIsOpen(false)
        }
    }

    const handleCancel = async () => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            await cancelAppointment(appointment.id)
            setIsOpen(false)
        }
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            await deleteAppointment(appointment.id)
            setIsOpen(false)
        }
    }

    return (
        <div className="">
            <button
                ref={buttonRef}
                className={`text-[#555] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer ${isOpen ? 'text-white bg-white/10' : ''}`}
                onClick={toggleMenu}
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        position: 'fixed',
                        zIndex: 9999
                    }}
                    className="w-48 bg-obsidian-surface border border-[#333] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                >
                    {/* Quick Status Change */}
                    {appointment.status !== 'Confirmed' && appointment.status !== 'Cancelled' && (
                        <button
                            onClick={handleQuickStatusChange}
                            className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-[#333]/50"
                        >
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            Verify Appointment
                        </button>
                    )}

                    {/* View Details */}
                    <button
                        onClick={() => {
                            onView(appointment)
                            setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <Eye size={14} className="text-blue-400" />
                        View Details
                    </button>

                    {/* Edit Details */}
                    <button
                        onClick={() => {
                            onEdit(appointment)
                            setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-[#333]/50"
                    >
                        <Edit size={14} className="text-champagne" />
                        Edit Details
                    </button>

                    {/* Danger Zone */}
                    {appointment.status !== 'Cancelled' && (
                        <button
                            onClick={handleCancel}
                            className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                        >
                            <XCircle size={14} />
                            Cancel
                        </button>
                    )}

                    <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </div>
    )
}

export default AppointmentMenu
