import { Calendar, Clock, Scissors, User, X, Check, AlertCircle } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'
import { useState, useEffect } from 'react'
import ConfirmModal from '../ConfirmModal'

// Normalize any date string to YYYY-MM-DD (required by <input type="date">).
// Handles YYYY-MM-DD (pass-through) and MM/DD/YYYY (legacy) without timezone shift.
const toInputDate = (dateStr) => {
    if (!dateStr) return ''
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    // MM/DD/YYYY → YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [month, day, year] = dateStr.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return ''
}

function AppointmentCards({ name, date, time, items, totalPrice, status, appointmentId, isGuest }) {
    const { cancelAppointment, rescheduleAppointment } = useAppointment()
    const { showMessage } = useMessage()

    const [isRescheduling, setIsRescheduling] = useState(false)
    const [newDate, setNewDate] = useState(toInputDate(date))
    const [newTime, setNewTime] = useState(time)
    const [isVisible, setIsVisible] = useState(false)

    const ANIM_DURATION = 300

    useEffect(() => {
        let t
        if (!isRescheduling && isVisible) {
            t = setTimeout(() => setIsVisible(false), ANIM_DURATION)
        }
        return () => {
            if (t) clearTimeout(t)
        }
    }, [isRescheduling, isVisible])

    const [confirmAction, setConfirmAction] = useState(null)

    const handleCancel = async () => {
        setConfirmAction({
            message: 'Are you sure you want to cancel this appointment?',
            onConfirm: async () => {
                const result = await cancelAppointment(appointmentId)
                if (result.success) {
                    showMessage('success', 'Appointment cancelled successfully')
                    await new Promise(resolve => setTimeout(resolve, 100))
                } else {
                    showMessage('error', `Failed to cancel appointment: ${result.error}`)
                }
                setConfirmAction(null)
            },
            onCancel: () => setConfirmAction(null)
        })
    }

    const handleschedule = async () => {
        if (!newDate || !newTime) {
            showMessage('error', 'Please select both date and time for rescheduling')
            return
        }
        const result = await rescheduleAppointment(appointmentId, newDate, newTime)
        if (result.success) {
            showMessage('success', 'Appointment rescheduled successfully')
            setIsRescheduling(false)
            await new Promise(resolve => setTimeout(resolve, 100))
        } else {
            showMessage('error', `Failed to reschedule appointment: ${result.error}`)
        }
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
            case 'pending': return 'bg-amber-950/30 text-amber-400 border-amber-900/50 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
            case 'cancelled': return 'bg-red-950/30 text-red-400 border-red-900/50 shadow-[0_0_10px_rgba(248,113,113,0.1)]'
            default: return 'bg-zinc-900 text-zinc-400 border-zinc-800'
        }
    }

    const appointmentItems = items || []
    const serviceItems = appointmentItems.map(item => item.service)
    const stylistItems = appointmentItems.map(item => item.stylist).filter(Boolean)
    const displayTotal = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0

    return (
        <div className={`group relative bg-obsidian-surface border border-[#222] rounded-2xl p-6 transition-all duration-300 shadow-md shadow-black/20 overflow-hidden ${isRescheduling ? 'min-h-105 md:min-h-78' : ''}`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg tracking-wide mb-1 flex items-center gap-2">
                        {name}
                        {isGuest && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-champagne text-black text-[10px] font-bold uppercase">
                                Guest
                            </span>
                        )}
                    </h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </div>

            {confirmAction && (
                <ConfirmModal
                    message={confirmAction.message}
                    onConfirm={confirmAction.onConfirm}
                    onCancel={confirmAction.onCancel}
                />
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian border border-[#222] group-hover:border-[#333] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-obsidian-elevated border border-[#333] flex items-center justify-center text-champagne">
                            <Calendar size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Date</p>
                            <p className="text-sm font-semibold text-gray-200">{date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian border border-[#222] group-hover:border-[#333] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-obsidian-elevated border border-[#333] flex items-center justify-center text-champagne">
                            <Clock size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Time</p>
                            <p className="text-sm font-semibold text-gray-200">{time}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-obsidian border border-[#222] group-hover:border-[#333] transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-champagne">
                            <Scissors size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777]">Services</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {serviceItems.length === 0 ? (
                                <span className="text-xs text-[#777] italic">No services</span>
                            ) : (
                                serviceItems.map((s) => (
                                    <span key={`${s.name}-${s.price}`} className="inline-flex items-center gap-1.5 bg-obsidian-elevated border border-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded-lg">
                                        <span className="text-champagne">{s.name}</span>
                                        <span className="text-[#777]">{s.price}</span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-obsidian border border-[#222] group-hover:border-[#333] transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-champagne">
                            <User size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777]">Stylists</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stylistItems.length === 0 ? (
                                <span className="text-xs text-[#777] italic">Any available</span>
                            ) : (
                                stylistItems.map((s) => (
                                    <span key={`${s.id}-${s.name}`} className="inline-flex items-center gap-1.5 bg-obsidian-elevated border border-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded-lg">
                                        <span className="text-champagne">{s.name}</span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-obsidian border border-[#222]">
                    <span className="text-[10px] text-[#777] font-bold uppercase tracking-wider">Total</span>
                    <span className="text-sm font-extrabold text-champagne">${displayTotal}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${isRescheduling ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
                <button
                    onClick={() => {
                        setIsVisible(true)
                        requestAnimationFrame(() => setIsRescheduling(true))
                    }}
                    disabled={status === 'Cancelled'}
                    className="flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 text-white hover:bg-champagne hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Reschedule
                </button>
                <button
                    onClick={handleCancel}
                    disabled={status === 'Cancelled'}
                    className="flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 text-[#777] hover:border-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Cancel
                </button>
            </div>

            {/* Reschedule Form Overlay */}
            <div
                className={`absolute inset-0 bg-obsidian-surface p-6 transition-transform duration-300 ease-in-out space-y-6 ${isRescheduling ? 'translate-y-0' : 'translate-y-full'} overflow-y-auto`}
            >
                <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14} className="text-champagne" />
                        New Time
                    </h4>
                    <button
                        onClick={() => setIsRescheduling(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-[#777] hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-[#777] uppercase tracking-wider mb-2">Select Date</label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-champagne focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-[#777] uppercase tracking-wider mb-2">Select Time</label>
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-champagne focus:outline-none transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleschedule}
                        className="w-full py-3 bg-champagne text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-champagne-dark transition-colors shadow-lg shadow-champagne/20 mt-2 flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <Check size={14} />
                        Confirm Change
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentCards
