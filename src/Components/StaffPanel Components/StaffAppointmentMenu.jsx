import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    CheckCircle2,
    XCircle,
    UserCheck,
    MoreVertical,
    Eye,
    Edit
} from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'
import { useMessage } from '../../Context/MessageContext'

const StaffAppointmentMenu = ({ appointment, onEdit, onView }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
    const [confirmAction, setConfirmAction] = useState(null)
    const [menuOrigin, setMenuOrigin] = useState('top')
    const menuRef = useRef(null)
    const buttonRef = useRef(null)
    const { updateAppointment, cancelAppointment } = useAppointment()
    const { showMessage } = useMessage()

    const toggleMenu = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setMenuPosition({
                top: rect.bottom + 8,
                left: rect.right - 192
            })
        }
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        if (isOpen && menuRef.current && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const menuRect = menuRef.current.getBoundingClientRect()
            const viewportPadding = 8
            const offset = 8
            let top = rect.bottom + offset
            let left = rect.right - menuRect.width
            let origin = 'top'

            if (top + menuRect.height > window.innerHeight - viewportPadding) {
                top = rect.top - menuRect.height - offset
                origin = 'bottom'
            }

            top = Math.max(viewportPadding, Math.min(top, window.innerHeight - menuRect.height - viewportPadding))
            left = Math.max(viewportPadding, Math.min(left, window.innerWidth - menuRect.width - viewportPadding))

            setMenuOrigin(origin)
            setMenuPosition({ top, left })
        }
        /* eslint-enable react-hooks/set-state-in-effect */

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        const handleScroll = () => {
            if (isOpen) setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('scroll', handleScroll, true)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [isOpen])
    const handleStatusChange = async (newStatus, successMsg) => {
        setConfirmAction({
            message: `Are you sure you want to mark this appointment as ${newStatus}?`,
            onConfirm: async () => {
                const result = await updateAppointment(appointment.id, { status: newStatus })
                if (result.success) {
                    showMessage('success', successMsg)
                } else {
                    showMessage('error', result.error || 'Failed to update status')
                }
                setConfirmAction(null)
            },
            // ensure Cancel button works without runtime error
            onCancel: () => setConfirmAction(null)
        })
        setIsOpen(false)
    }

    const handleCancel = async () => {
        setConfirmAction({
            message: 'Are you sure you want to cancel this appointment?',
            onConfirm: async () => {
                const result = await cancelAppointment(appointment.id)
                if (result.success) {
                    showMessage('success', 'Appointment cancelled successfully')
                } else {
                    showMessage('error', result.error || 'Failed to cancel appointment')
                }
                setConfirmAction(null)
            }
        })
        setIsOpen(false)
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
                    className={`w-48 bg-obsidian-surface border border-[#333] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 ${menuOrigin === 'bottom' ? 'origin-bottom-right' : 'origin-top-right'}`}
                >
                    {/* Check In */}
                    {appointment.status !== 'Checked In' && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                        <button
                            onClick={() => handleStatusChange('Checked In', 'Client checked in successfully')}
                            className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-[#333]/50"
                        >
                            <UserCheck size={14} className="text-blue-400" />
                            Check In Client
                        </button>
                    )}

                    {/* Mark Completed */}
                    {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                        <button
                            onClick={() => handleStatusChange('Completed', 'Appointment marked as completed')}
                            className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-[#333]/50"
                        >
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            Mark Completed
                        </button>
                    )}

                    {/* View Details */}
                    {onView && (
                        <button
                            onClick={() => {
                                onView(appointment)
                                setIsOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Eye size={14} className="text-[#a1a1aa]" />
                            View Details
                        </button>
                    )}

                    {/* Edit Details */}
                    {onEdit && (
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
                    )}

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
                </div>,
                document.body
            )}

            {/* Custom Confirmation Modal */}
            {confirmAction && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-obsidian-elevated border border-[#333] rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-white font-bold text-lg mb-2">Confirm Action</h3>
                        <p className="text-gray-400 text-sm mb-6">{confirmAction.message}</p>
                        <div className="flex justify-end gap-3 pointer-events-auto">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white bg-transparent border border-[#333] hover:border-gray-500 rounded-lg transition-all"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={confirmAction.onConfirm}
                                className="px-4 py-2 text-sm font-bold text-black bg-champagne hover:bg-champagne-dark rounded-lg shadow-lg hover:shadow-champagne/20 transition-all cursor-pointer"
                            >
                                Yes, Proceed
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default StaffAppointmentMenu
