import { useEffect } from 'react'
import {
    X,
    Calendar,
    Clock,
    User,
    Scissors,
    Mail,
    Phone,
    FileText,
    CheckCircle2,
    StickyNote
} from 'lucide-react'
import StatusBadge from './StatusBadge'

const ViewAppointmentModal = ({ appointment, onClose }) => {
    useEffect(() => {
        if (!appointment) return undefined
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('fixed')) {
                onClose();
            }
        };
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [appointment, onClose]);

    if (!appointment) return null;


    const serviceSummary = appointment.services?.length
        ? appointment.services.map(s => `${s.name} (${s.price})`).join(', ')
        : '—'
    const stylistSummary = appointment.stylists?.length
        ? appointment.stylists.map(s => s.name).join(', ')
        : 'Unassigned'
    const totalPrice = Number.isFinite(Number(appointment.totalPrice)) ? Number(appointment.totalPrice) : 0

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-obsidian-surface border border-[#333] w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="text-champagne mt-0.5" size={20} />
                        Appointment Details
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white">{serviceSummary}</h3>
                            <p className="text-champagne font-bold text-lg">${totalPrice}</p>
                        </div>
                        <div className='mt-0.5'>
                            <StatusBadge status={appointment.status} />
                        </div>
                    </div>

                    {/* Grid Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-champagne-muted uppercase flex items-center gap-1.5">
                                <Calendar size={12} /> Date
                            </label>
                            <p className="text-white font-medium">{appointment.date}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-champagne-muted uppercase flex items-center gap-1.5">
                                <Clock size={12} /> Time
                            </label>
                            <p className="text-white font-medium">{appointment.time}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-champagne-muted uppercase flex items-center gap-1.5">
                                <User size={12} /> Client
                            </label>
                            <p className="text-white font-medium">{appointment.name}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-champagne-muted uppercase flex items-center gap-1.5">
                                <Scissors size={12} /> Stylists
                            </label>
                            <p className="text-white font-medium">{stylistSummary}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-obsidian-elevated p-4 rounded-xl border border-[#333] space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail size={16} className="text-champagne-muted" />
                            <span className="text-gray-300">{appointment.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone size={16} className="text-champagne-muted" />
                            <span className="text-gray-300">{appointment.phone || 'No phone provided'}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.message && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-champagne-muted uppercase flex items-center gap-1.5">
                                <StickyNote size={12} /> Notes
                            </label>
                            <div className="bg-obsidian-elevated p-3 rounded-lg border border-[#333] text-sm text-gray-400 italic">
                                "{appointment.message}"
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#333] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-obsidian-elevated hover:bg-[#222] text-white border border-[#333] rounded-lg text-sm font-bold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewAppointmentModal
