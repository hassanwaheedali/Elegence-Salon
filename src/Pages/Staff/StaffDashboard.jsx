import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Calendar,
    TrendingUp,
    Scissors,
    CheckCircle2
} from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'
import { useAuth } from '../../Context/AuthContext'
import StatsCard from '../../Components/AdminPanel Components/StatsCard'
import StatusBadge from '../../Components/AdminPanel Components/StatusBadge'
import StaffAppointmentMenu from '../../Components/StaffPanel Components/StaffAppointmentMenu'
// View/Edit modals form AdminPanel can be reused or custom ones later, assuming we reuse them
import EditAppointmentModal from '../../Components/AdminPanel Components/EditAppointmentModal'
import ViewAppointmentModal from '../../Components/AdminPanel Components/ViewAppointmentModal'

function StaffDashboard() {
    const { getAppointmentsForStaff } = useAppointment()
    const { currentUser } = useAuth()

    const [myAppointments, setMyAppointments] = useState([])
    const [todayAppointments, setTodayAppointments] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [pendingJobs, setPendingJobs] = useState(0)
    const [completedJobs, setCompletedJobs] = useState(0)

    const [editingAppointment, setEditingAppointment] = useState(null)
    const [viewingAppointment, setViewingAppointment] = useState(null)

    const handleEdit = (appointment) => setEditingAppointment(appointment)
    const handleView = (appointment) => setViewingAppointment(appointment)

    useEffect(() => {
        if (!currentUser) return;

        const appointments = getAppointmentsForStaff(currentUser.id)
        setMyAppointments(appointments)

        // Calculate Total Commissions Earned
        const revenue = appointments.reduce((acc, curr) => {
            const price = parseFloat(curr.price?.toString().replace('$', '') || 0)
            const commission = parseFloat(curr.commission || currentUser?.commission || 0)
            return acc + (price * commission)
        }, 0)
        setTotalRevenue(revenue)

        // Pending vs Completed Jobs
        const pending = appointments.filter(a => a.status === 'Awaiting Confirmation' || a.status === 'Confirmed' || a.status === 'Checked In').length
        const completed = appointments.filter(a => a.status === 'Completed').length
        setPendingJobs(pending)
        setCompletedJobs(completed)

        // Today's appointments (assuming date format matches `new Date().toISOString().split('T')[0]` or simple string match)
        // Since custom date format might be used, let's just use `new Date().toLocaleDateString('en-CA')` or similar. 
        // Admin Dashboard doesn't filter perfectly by today natively, but we can do our best. Let's just grab the next 4 pending for now if date is hard to parse.
        // Actually, let's just sort by id desc for "Recent".

        const sorted = [...appointments].sort((a, b) => b.id - a.id)
        setTodayAppointments(sorted)

    }, [currentUser, getAppointmentsForStaff])

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
            {/* Greeting Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Welcome back, {currentUser?.name}</h1>
                <p className="text-sm text-[#8A8A8A]">Here's what's happening with your schedule today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatsCard
                    title="Total Assigned"
                    value={myAppointments.length}
                    change={myAppointments.length > 0 ? "Active" : "None"}
                    positive={true}
                    icon={<Calendar size={24} />}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatsCard
                    title="Pending Jobs"
                    value={pendingJobs}
                    change={pendingJobs > 0 ? "Needs Action" : "All Clear"}
                    positive={pendingJobs === 0}
                    icon={<Scissors size={24} />}
                    color="text-[#FF8A00]"
                    bg="bg-[#FF8A00]/10"
                />
                <StatsCard
                    title="Completed Jobs"
                    value={completedJobs}
                    change="Great work!"
                    positive={true}
                    icon={<CheckCircle2 size={24} />}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatsCard
                    title="Total Commissions Earned"
                    value={`$${totalRevenue.toFixed(2)}`}
                    change="Estimated"
                    positive={totalRevenue > 0}
                    icon={<TrendingUp size={24} />}
                    color="text-emerald-400"
                    bg="bg-emerald-400/10"
                />
            </div>

            {/* Appointments Table Section */}
            <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#161515] px-6 py-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] flex items-center gap-3">
                        <span className="text-white">Recent</span> Appointments
                    </h2>
                    <button className="px-6 py-2 bg-[#0d0d0d] text-white border border-[#333] hover:border-[#fb9d33] hover:text-[#fb9d33] text-xs font-bold rounded-lg transition-all uppercase tracking-wider shadow-lg cursor-pointer">
                        <Link to="/staff/appointments" className="flex items-center gap-1">
                            View All My Appointments
                        </Link>
                    </button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 text-[#555] uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {todayAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-[#777]">No appointments assigned to you right now.</td>
                                </tr>
                            ) : todayAppointments.slice(0, 5).map((appointment, idx) => (
                                <tr key={appointment.id || idx} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://placehold.co/150x150/222/FFF?text=${appointment.name.charAt(0)}`} alt={appointment.name} className="w-9 h-9 rounded-full border border-white/10" />
                                            <span className="font-semibold text-white text-sm">
                                                {appointment.name}
                                                {appointment.userId == null && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[#fb9d33] text-black text-[10px] font-bold uppercase">Guest</span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#a1a1aa]">{appointment.service} - {appointment.price || ""}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium text-xs">{appointment.date}</span>
                                            <span className="text-[#939292] text-xs pl-4">{appointment.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={appointment.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <StaffAppointmentMenu
                                            appointment={appointment}
                                            onEdit={handleEdit}
                                            onView={handleView}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {todayAppointments.length === 0 ? (
                        <div className="text-center text-[#777] py-8">No appointments assigned.</div>
                    ) : todayAppointments.slice(0, 5).map((appointment, idx) => (
                        <div key={appointment.id || idx} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={`https://placehold.co/150x150/222/FFF?text=${appointment.name.charAt(0)}`} alt={appointment.name} className="w-10 h-10 rounded-full border border-white/10" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                            <span>{appointment.name}</span>
                                        </h4>
                                        <div className="text-xs text-[#777] flex items-center gap-1 mt-0.5">
                                            {appointment.service}
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={appointment.status} />
                            </div>

                            <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Calendar size={12} />
                                        <span>{appointment.date}</span>
                                        <span className="text-[#333]">|</span>
                                        <span>{appointment.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 relative">
                                    <span className="text-white font-bold text-sm">{appointment.price}</span>
                                    <StaffAppointmentMenu
                                        appointment={appointment}
                                        onEdit={handleEdit}
                                        onView={handleView}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {editingAppointment && (
                <EditAppointmentModal
                    appointment={editingAppointment}
                    onClose={() => setEditingAppointment(null)}
                />
            )}
            {viewingAppointment && (
                <ViewAppointmentModal
                    appointment={viewingAppointment}
                    onClose={() => setViewingAppointment(null)}
                />
            )}
        </div>
    )
}

export default StaffDashboard
