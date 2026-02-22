import React, { useMemo } from 'react';
import { useAppointment } from '../../Context/AppointmentContext';
import { X, Calendar, Briefcase, Mail, Phone, Star, TrendingUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StaffDetailsModal = ({ staff, onClose }) => {
    const { appointments } = useAppointment();

    // Stats calculations
    const stats = useMemo(() => {
        if (!staff || !appointments.length) return { total: 0, active: 0, revenue: 0 };

        const staffAppts = appointments.filter(app =>
            app.stylists?.some(s =>
                s.id === staff.id ||
                s.email?.toLowerCase() === staff.email?.toLowerCase() ||
                s.name?.toLowerCase() === staff.name.toLowerCase()
            )
        );

        const total = staffAppts.length;
        const active = staffAppts.filter(a => ['Confirmed', 'Pending'].includes(a.status)).length;
        // Mock revenue calculation (assuming price is string like "$50")
        const revenue = staffAppts.reduce((sum, app) => {
            if (!app.services?.length || !app.stylists?.length) return sum;
            const staffServices = app.services.filter((_, i) => {
                const stylist = app.stylists[i]
                return stylist && (stylist.id === staff.id || stylist.email?.toLowerCase() === staff.email?.toLowerCase())
            })
            const serviceTotal = staffServices.reduce((sub, svc) => sub + (parseFloat(svc.price?.replace(/[^0-9.]/g, '')) || 0), 0)
            return sum + serviceTotal;
        }, 0);

        return { total, active, revenue };
    }, [staff, appointments]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl animate-scale-in flex flex-col overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer backdrop-blur-md"
                >
                    <X size={18} />
                </button>

                {/* Cover / Profile Header */}
                <div className="h-32 bg-linear-to-r from-[#FF8A00] to-[#FF5C00] relative">
                    <div className="absolute -bottom-12 left-6">
                        <div className="w-24 h-24 rounded-full border-4 border-[#121212] bg-[#1a1a1a] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {staff.name.charAt(0)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-14 px-6 pb-6 space-y-6">

                    {/* Basic Info */}
                    <div>
                        <h2 className="text-2xl font-black text-white">{staff.name}</h2>
                        <p className="text-[#FF8A00] font-bold text-sm tracking-wide uppercase mt-1">{staff.role}</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5">
                                <Mail size={14} className="text-[#555]" />
                                {staff.email}
                            </div>
                            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/5">
                                <Phone size={14} className="text-[#555]" />
                                {staff.phone}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-xl flex flex-col items-center text-center">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Total Appts</span>
                            <span className="text-white text-xl font-black">{stats.total}</span>
                        </div>
                        <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-xl flex flex-col items-center text-center">
                            <span className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider mb-1">Active</span>
                            <span className="text-emerald-400 text-xl font-black">{stats.active}</span>
                        </div>
                        <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-xl flex flex-col items-center text-center">
                            <span className="text-[#FF8A00]/70 text-[10px] uppercase font-bold tracking-wider mb-1">Rating</span>
                            <div className="flex items-center gap-1 text-[#FF8A00] mt-0.5">
                                <Star size={14} fill="#FF8A00" />
                                <span className="text-xl font-black">{staff.rating || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl">
                            <h4 className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <Briefcase size={14} /> Specialties
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {staff.specialties?.map((skill, idx) => (
                                    <span key={idx} className="bg-[#222] text-gray-300 px-2 py-1 rounded text-xs border border-white/5">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl">
                            <h4 className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <TrendingUp size={14} /> Performance
                            </h4>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Experience</span>
                                <span className="text-white font-bold">{staff.experience}</span>
                            </div>
                            <div className="w-full h-px bg-white/5 my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Commission Rate</span>
                                <span className="text-white font-bold">{staff.commission ? `${staff.commission * 100}%` : 'Standard'}</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StaffDetailsModal;
