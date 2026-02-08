import { useAppointment } from '../../Context/AppointmentContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'
import { useState, useEffect } from 'react'

function AppointmentCards({name, date, time, service, status, appointmentId}) {
    const { cancelAppointment, resscheduleAppointment } = useAppointment()
    const { showMessage } = useMessage()

    const [isRescheduling, setIsRescheduling] = useState(false)
    const [newDate, setNewDate] = useState(date)
    const [newTime, setNewTime] = useState(time)
    const [isVisible, setIsVisible] = useState(false)

    // animation duration in ms (keep in sync with Tailwind duration-300)
    const ANIM_DURATION = 300

    useEffect(() => {
        let t
        // when closing, wait for animation to finish then unmount
        if (!isRescheduling && isVisible) {
            t = setTimeout(() => setIsVisible(false), ANIM_DURATION)
        }
        return () => {
            if (t) clearTimeout(t)
        }
    }, [isRescheduling, isVisible])
    const handleCancel = async () => {
        const result = await cancelAppointment(appointmentId)
        if (result.success) {
            showMessage('error', 'Appointment cancelled successfully')
            // Small delay to ensure message is visible before UI updates
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
        const result = await resscheduleAppointment(appointmentId, newDate, newTime)
        if (result.success) {
            showMessage('success', 'Appointment rescheduled successfully')
            setIsRescheduling(false)
            // Small delay to ensure message is visible before UI updates
            await new Promise(resolve => setTimeout(resolve, 100))
        } else {
            showMessage('error', `Failed to reschedule appointment: ${result.error}`)
        }
    }

    return (
        <>

            <div className="bg-[#0F0F0F] border border-[#333333] rounded-lg p-6 hover:border-[#FF8A00]/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{name}</h3>
                    {/* <p className="text-[#8A8A8A] text-sm">{appointmentId}</p> */}
                </div>
                <span className="px-3 py-1 bg-[#FF8A00]/20 text-[#FF8A00] text-xs font-semibold rounded-full">{status}</span>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M1 5.05a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h1a1 1 0 110 2v1h.5a2 2 0 012 2v2h1.5a1 1 0 110 2h-1.5v2h1.5a1 1 0 110 2h-1.5v.5a2 2 0 01-2 2h-2.5a1 1 0 110-2H12v-2H9v2h1.5a1 1 0 110 2h-10a1 1 0 110-2H3v-2H1.5a1 1 0 110-2H3v-2H1a1 1 0 01-1-1v-1H0V7h1V6H1V5.05z"></path>
                    </svg>
                    <span className="text-[#8A8A8A]">{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v3.102a1 1 0 00.6.894l2.4 1.2a1 1 0 10-.8 1.788l-2.4-1.2A1 1 0 009 9.602V6z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-[#8A8A8A]">{time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                    </svg>
                    <span className="text-[#8A8A8A]">{service}</span>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-[#FF8A00] text-white text-sm font-semibold rounded hover:bg-[#E67C00] transition-all duration-300 cursor-pointer"
                  onClick={() => {
                      if (isRescheduling) return
                      // mount in hidden state then trigger the reveal next frame
                      setIsVisible(true)
                      requestAnimationFrame(() => {
                          setIsRescheduling(true)
                      })
                  }}
                >
                    Reschedule
                </button>
                <button className="flex-1 px-3 py-2 bg-[#0F0F0F] text-white text-sm font-semibold cursor-pointer rounded border border-[#333333] hover:border-red-500/50 hover:text-red-500 transition-all duration-300" onClick={handleCancel}>
                    Cancel
                </button>
            </div>

            {isVisible && (
                <div
                  className={`mt-4 p-4 bg-[#1a1a1a] rounded transition-all duration-300 ease-out transform ${isRescheduling ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto shadow-md' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
                  aria-hidden={!isRescheduling}
                  style={{ transitionProperty: 'opacity, transform' }}
                >
                    <h4 className="text-white font-semibold mb-3">Reschedule Appointment</h4>
                    <div className="flex flex-col gap-3">
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="px-3 py-2 rounded bg-[#0F0F0F] text-white border border-[#333333] focus:border-[#FF8A00]/50 transition-all duration-300" />
                        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="px-3 py-2 rounded bg-[#0F0F0F] text-white border border-[#333333] focus:border-[#FF8A00]/50 transition-all duration-300" />
                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-[#FF8A00] text-white text-sm font-semibold rounded hover:bg-[#E67C00] transition-all duration-300" onClick={handleschedule}>
                                Save
                            </button>
                            <button className="flex-1 px-3 py-2 bg-[#0F0F0F] text-white text-sm font-semibold cursor-pointer rounded border border-[#333333] hover:border-red-500/50 hover:text-red-500 transition-all duration-300" onClick={() => setIsRescheduling(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}

export default AppointmentCards
