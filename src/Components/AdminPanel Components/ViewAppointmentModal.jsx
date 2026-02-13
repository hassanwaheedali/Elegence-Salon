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
    if (!appointment) return null;

    useEffect(() => {
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
    }, [onClose]);


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-[#333] w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="text-[#FF8A00] mt-0.5" size={20} />
                        Appointment Details
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-white">{appointment.service}</h3>
                            <p className="text-[#FF8A00] font-bold text-lg">{appointment.price}</p>
                        </div>
                        <StatusBadge status={appointment.status} />
                    </div>

                    {/* Grid Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                <Calendar size={12} /> Date
                            </label>
                            <p className="text-white font-medium">{appointment.date}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                <Clock size={12} /> Time
                            </label>
                            <p className="text-white font-medium">{appointment.time}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                <User size={12} /> Client
                            </label>
                            <p className="text-white font-medium">{appointment.name}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                <Scissors size={12} /> Stylist
                            </label>
                            <p className="text-white font-medium">{appointment.stylistName || 'Unassigned'}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail size={16} className="text-gray-500" />
                            <span className="text-gray-300">{appointment.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone size={16} className="text-gray-500" />
                            <span className="text-gray-300">{appointment.phone || 'No phone provided'}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.message && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                <StickyNote size={12} /> Notes
                            </label>
                            <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333] text-sm text-gray-400 italic">
                                "{appointment.message}"
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#333] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] rounded-lg text-sm font-bold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewAppointmentModal
