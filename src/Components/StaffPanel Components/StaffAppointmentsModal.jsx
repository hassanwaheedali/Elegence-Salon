import { useMemo } from 'react';
import { useAppointment } from '../../Context/AppointmentContext';
import { X, Calendar, User, Clock, Scissors, Phone, Mail } from 'lucide-react';
import StatusBadge from '../AdminPanel Components/StatusBadge';

const StaffAppointmentsModal = ({ staff, onClose }) => {
    const { appointments } = useAppointment();

    // Filter appointments for this stylist
    const stylistAppointments = useMemo(() => {
        if (!staff || !appointments.length) return [];
        return appointments.filter(app => {
            // Match by ID if available, otherwise name (case insensitive for name)
            if (app.stylistId && staff.id) return app.stylistId === staff.id;
            return app.stylistName?.toLowerCase() === staff.name.toLowerCase();
        }).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)); // Sort by date/time desc
    }, [staff, appointments]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121212] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#161515]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF8A00] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {staff.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Stylist Schedule</h2>
                            <p className="text-gray-400 text-xs mt-0.5">Appointments for <span className="text-[#FF8A00]">{staff.name}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {stylistAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                    <h4 className="text-gray-500 text-xs uppercase font-bold">Total</h4>
                                    <p className="text-white text-xl font-black mt-1">{stylistAppointments.length}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                    <h4 className="text-emerald-500/80 text-xs uppercase font-bold">Confirmed</h4>
                                    <p className="text-white text-xl font-black mt-1">{stylistAppointments.filter(a => a.status === 'Confirmed').length}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                    <h4 className="text-amber-500/80 text-xs uppercase font-bold">Pending</h4>
                                    <p className="text-white text-xl font-black mt-1">{stylistAppointments.filter(a => ['Pending', 'Awaiting Confirmation'].includes(a.status)).length}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                    <h4 className="text-rose-500/80 text-xs uppercase font-bold">Cancelled</h4>
                                    <p className="text-white text-xl font-black mt-1">{stylistAppointments.filter(a => a.status === 'Cancelled').length}</p>
                                </div>
                            </div>

                            {/* Appointments List */}
                            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                                {stylistAppointments.map((app) => (
                                    <div key={app.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 hover:border-white/10 transition-colors group">
                                        <div className="flex gap-4">
                                            {/* Date Box */}
                                            <div className="bg-[#222] rounded-lg p-2 flex flex-col items-center justify-center min-w-15 border border-white/5 group-hover:border-[#FF8A00]/30 transition-colors">
                                                <span className="text-[#FF8A00] font-bold text-xs uppercase tracking-wider">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-white font-black text-xl">{new Date(app.date).getDate()}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-white text-sm">{app.service}</h3>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={12} className="text-[#555]" />
                                                        <span className="text-gray-300">{app.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} className="text-[#555]" />
                                                        <span>{app.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[#FF8A00]">
                                                        <span className="font-bold">{app.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="bg-[#1a1a1a] p-4 rounded-full mb-4 ring-1 ring-white/5">
                                <Calendar size={48} className="text-[#333]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Appointments Yet</h3>
                            <p className="text-gray-500 max-w-sm text-sm">Use the 'Add Appointment' feature to schedule bookings for {staff.name}.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#161515] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StaffAppointmentsModal;
