import { useRef, useState, useEffect } from 'react'
import { useAppointment } from '../../Context/AppointmentContext.jsx'
import AppointmentCards from './AppointmentCards.jsx'

function Booking() {
    const appointmentSectionRef = useRef(null)
    const { displayAppointmentsByUser, appointments } = useAppointment()
    const [userappointments, setUserAppointments] = useState([])

    useEffect(() => {
        const fetchAppointments = async () => {
            const result = await displayAppointmentsByUser()
            if (result.success) {
                setUserAppointments(result.data)
            } else {
                setUserAppointments([])
            }
        }
        fetchAppointments()
    }, [displayAppointmentsByUser, appointments])
    return (
        <div ref={appointmentSectionRef} className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500" id='appoinments'>
            <div className="head-background bg-[#1a1a1a] w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] mt-1"><span className="text-white">My</span> Appointments</h2>
            </div>
            {userappointments.length === 0 ? (
                <div className="bg-[#0F0F0F] border border-[#333333] rounded-lg p-6 sm:p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF8A00]/15">
                        <svg className="h-7 w-7 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 7V3" />
                            <path d="M16 7V3" />
                            <path d="M3 11h18" />
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M7 15h5" />
                        </svg>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">No appointments found</h3>
                    <p className="text-[#8A8A8A] text-sm">No appointments found that match your current list.</p>
                </div>
            ) : (
                <>
                    <p className="text-[#8A8A8A] mb-8 px-1">View your upcoming and past bookings</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {userappointments.map((appointment) => (
                            <AppointmentCards
                                key={appointment.id}
                                name={appointment.name}
                                date={appointment.date}
                                time={appointment.time}
                                service={appointment.service}
                                price={appointment.price}
                                status={appointment.status}
                                appointmentId={appointment.id}
                                stylistName={appointment.stylistName}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Booking