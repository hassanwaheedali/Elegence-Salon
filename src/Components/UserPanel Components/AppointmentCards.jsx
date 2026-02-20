import { Calendar, Clock, Scissors, User, X, Check, AlertCircle } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'
import { useState, useEffect } from 'react'

// Convert MM/DD/YYYY to YYYY-MM-DD for date input
const convertToInputFormat = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Convert YYYY-MM-DD to MM/DD/YYYY for storage
const convertToStorageFormat = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
}

function AppointmentCards({ name, date, time, service, price, status, appointmentId, stylistName }) {
    const { cancelAppointment, rescheduleAppointment } = useAppointment()
    const { showMessage } = useMessage()

    const [isRescheduling, setIsRescheduling] = useState(false)
    const [newDate, setNewDate] = useState(convertToInputFormat(date))
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

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return

        const result = await cancelAppointment(appointmentId)
        if (result.success) {
            showMessage('success', 'Appointment cancelled successfully')
            await new Promise(resolve => setTimeout(resolve, 100))
        } else {
            showMessage('error', `Failed to cancel appointment: ${result.error}`)
        }
    }

    const handleschedule = async () => {
        if (!newDate || !newTime) {
            showMessage('error', 'Please select both date and time for rescheduling')
            return
        }
        // Convert date back to MM/DD/YYYY format for storage
        const formattedDate = convertToStorageFormat(newDate)
        const result = await rescheduleAppointment(appointmentId, formattedDate, newTime)
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

    return (
        <div className={`group relative bg-[#121212] border border-[#222] rounded-2xl p-6 transition-all duration-300 shadow-md shadow-black/20 overflow-hidden ${isRescheduling ? 'min-h-105 md:min-h-78' : ''}`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg tracking-wide mb-1">{name}</h3>
                    {/* <p className="text-[#777] text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                        ID: <span className="font-mono text-[#555]">{appointmentId?.slice(-6) || '...'}</span>
                    </p> */}
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-[#222] group-hover:border-[#333] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#FF8A00]">
                        <Calendar size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Date</p>
                        <p className="text-sm font-semibold text-gray-200">{date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-[#222] group-hover:border-[#333] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#FF8A00]">
                        <Clock size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Time</p>
                        <p className="text-sm font-semibold text-gray-200">{time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-[#222] group-hover:border-[#333] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#FF8A00]">
                        <User size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Stylist</p>
                        <p className="text-sm font-semibold text-gray-200 truncate max-w-20">{stylistName || 'Any'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-[#222] group-hover:border-[#333] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#FF8A00]">
                        <Scissors size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Service</p>
                        <p className="text-sm font-semibold text-gray-200 truncate max-w-20">{price} {service}</p>
                    </div>
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
                    className="flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 text-white hover:bg-[#FF8A00] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                className={`absolute inset-0 bg-[#121212] p-6 transition-transform duration-300 ease-in-out space-y-6 ${isRescheduling ? 'translate-y-0' : 'translate-y-full'} overflow-y-auto`}
            >
                <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14} className="text-[#FF8A00]" />
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
                            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF8A00] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-[#777] uppercase tracking-wider mb-2">Select Time</label>
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF8A00] focus:outline-none transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleschedule}
                        className="w-full py-3 bg-[#FF8A00] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e67c00] transition-colors shadow-lg shadow-orange-500/20 mt-2 flex justify-center items-center gap-2 cursor-pointer"
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
