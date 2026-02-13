
import { useRef, useEffect, useState } from 'react'
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
    const menuRef = useRef(null)
    const { updateAppointment, deleteAppointment, cancelAppointment } = useAppointment()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

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
        <div className="relative" ref={menuRef}>
            <button
                className={`text-[#555] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer ${isOpen ? 'text-white bg-white/10' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121212] border border-[#333] rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
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
                        <Edit size={14} className="text-[#fb9d33]" />
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
                </div>
            )}
        </div>
    )
}

export default AppointmentMenu
