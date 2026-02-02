import { useRef } from 'react'

function Booking() {
    const appointmentSectionRef = useRef(null)

    return (
        <div ref={appointmentSectionRef} className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500">
            <div className="head-background bg-[#1a1a1a] w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] mt-1"><span className="text-white">My</span> Appointments</h2>
            </div>
            <p className="text-[#8A8A8A] mb-8 px-1">View your upcoming and past bookings</p>

            {/* Appointment Tabs */}
            <div className="flex gap-4 mb-8">
                <button className="px-6 py-2 bg-[#FF8A00] text-white font-semibold rounded-lg hover:bg-[#E67C00] transition-all duration-300">
                    Upcoming
                </button>
                <button className="px-6 py-2 bg-[#0F0F0F] text-[#8A8A8A] font-semibold rounded-lg border border-[#333333] hover:border-[#FF8A00]/50 transition-all duration-300">
                    Past Bookings
                </button>
            </div>

            {/* Empty State / Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Appointment Card 1 */}
                <div className="bg-[#0F0F0F] border border-[#333333] rounded-lg p-6 hover:border-[#FF8A00]/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">Barber Service</h3>
                            <p className="text-[#8A8A8A] text-sm">#APT001</p>
                        </div>
                        <span className="px-3 py-1 bg-[#FF8A00]/20 text-[#FF8A00] text-xs font-semibold rounded-full">Confirmed</span>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M1 5.05a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h1a1 1 0 110 2v1h.5a2 2 0 012 2v2h1.5a1 1 0 110 2h-1.5v2h1.5a1 1 0 110 2h-1.5v.5a2 2 0 01-2 2h-2.5a1 1 0 110-2H12v-2H9v2h1.5a1 1 0 110 2h-10a1 1 0 110-2H3v-2H1.5a1 1 0 110-2H3v-2H1a1 1 0 01-1-1v-1H0V7h1V6H1V5.05z"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">February 15, 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v3.102a1 1 0 00.6.894l2.4 1.2a1 1 0 10-.8 1.788l-2.4-1.2A1 1 0 009 9.602V6z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">2:30 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">Premium Haircut</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-[#FF8A00] text-white text-sm font-semibold rounded hover:bg-[#E67C00] transition-all duration-300">
                            Reschedule
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#0F0F0F] text-white text-sm font-semibold rounded border border-[#333333] hover:border-red-500/50 hover:text-red-500 transition-all duration-300">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Appointment Card 2 */}
                <div className="bg-[#0F0F0F] border border-[#333333] rounded-lg p-6 hover:border-[#FF8A00]/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">Beard Trim</h3>
                            <p className="text-[#8A8A8A] text-sm">#APT002</p>
                        </div>
                        <span className="px-3 py-1 bg-[#FF8A00]/20 text-[#FF8A00] text-xs font-semibold rounded-full">Confirmed</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M1 5.05a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h2a1 1 0 011 1v1h2V5a1 1 0 011-1h1a1 1 0 110 2v1h.5a2 2 0 012 2v2h1.5a1 1 0 110 2h-1.5v2h1.5a1 1 0 110 2h-1.5v.5a2 2 0 01-2 2h-2.5a1 1 0 110-2H12v-2H9v2h1.5a1 1 0 110 2h-10a1 1 0 110-2H3v-2H1.5a1 1 0 110-2H3v-2H1a1 1 0 01-1-1v-1H0V7h1V6H1V5.05z"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">February 20, 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v3.102a1 1 0 00.6.894l2.4 1.2a1 1 0 10-.8 1.788l-2.4-1.2A1 1 0 009 9.602V6z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">10:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FF8A00]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                            </svg>
                            <span className="text-[#8A8A8A]">Beard & Hair</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-[#FF8A00] text-white text-sm font-semibold rounded hover:bg-[#E67C00] transition-all duration-300">
                            Reschedule
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#0F0F0F] text-white text-sm font-semibold rounded border border-[#333333] hover:border-red-500/50 hover:text-red-500 transition-all duration-300">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* View All Button */}
            <div className="text-center pt-4 border-t border-[#333333]">
                <button className="text-[#FF8A00] font-semibold hover:text-[#E67C00] transition-colors duration-300">
                    View All Appointments →
                </button>
            </div>
        </div>
    )
}

export default Booking