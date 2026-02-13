import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Search,
    Bell,
    TrendingUp,
    AlertCircle,
    Settings,
    Calendar,
    Scissors
} from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'
import StatsCard from '../../Components/AdminPanel Components/StatsCard'
import StatusBadge from '../../Components/AdminPanel Components/StatusBadge'
import InventoryItem from '../../Components/AdminPanel Components/InventoryItem'
import StaffRow from '../../Components/AdminPanel Components/StaffRow'
import AppointmentMenu from '../../Components/AdminPanel Components/AppointmentMenu'
import EditAppointmentModal from '../../Components/AdminPanel Components/EditAppointmentModal'
import ViewAppointmentModal from '../../Components/AdminPanel Components/ViewAppointmentModal'
import { getActiveStaff, staff } from '../../data/staff'

function Dashboard() {
    const { appointments } = useAppointment()

    const [todayStaff, setTodayStaff] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [viewingAppointment, setViewingAppointment] = useState(null)

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment)
    }

    const handleView = (appointment) => {
        setViewingAppointment(appointment)
    }

    // Get staff working today
    useEffect(() => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const today = days[new Date().getDay()]

        const workingStaff = staff.filter(member => {
            return member.status === 'active' && member.schedule[today]
        }).map(member => ({
            ...member,
            time: `${member.schedule[today].start} - ${member.schedule[today].end}`,
            online: true
        }))

        setTodayStaff(workingStaff)
    }, [])

    // Calculate Total Revenue
    useEffect(() => {
        const total = appointments.reduce((acc, curr) => {
            // Remove '$' and convert to number, default to 0 if invalid
            const price = parseFloat(curr.price?.replace('$', '') || 0)
            return acc + price
        }, 0)
        setTotalRevenue(total)
    }, [appointments])

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    change={totalRevenue > 0 ? `${((totalRevenue - 100) / 100 * 100).toFixed(1)}%` : "0%"}
                    positive={totalRevenue >= 100}
                    icon={<TrendingUp size={24} />}
                    color="text-[#FF8A00]"
                    bg="bg-[#FF8A00]/10"
                />
                <StatsCard
                    title="Total Appointments"
                    value={appointments.length}
                    change={appointments.length > 0 ? `${((appointments.length - 5) / 5 * 100).toFixed(1)}%` : "0%"}
                    positive={appointments.length >= 5}
                    icon={<Calendar size={24} />}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatsCard
                    title="Low Stock Items"
                    value="12"
                    change="-2 Items"
                    positive={false}
                    icon={<AlertCircle size={24} />}
                    color="text-red-500"
                    bg="bg-red-500/10"
                />
                <StatsCard
                    title="Active Stylists"
                    value={getActiveStaff().length}
                    change={getActiveStaff().length > 0 ? `${((getActiveStaff().length - 4) / 4 * 100).toFixed(1)}%` : "0%"}
                    positive={getActiveStaff().length >= 4}
                    icon={<Scissors size={24} />}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
            </div>

            {/* Appointments Table Section */}
            <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#161515] px-6 py-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] flex items-center gap-3">
                        <span className="text-white">Recent</span> Appointments
                        <span className="flex items-center justify-center text-[10px] font-bold text-[#fb9d33] bg-[#fb9d33]/10 border border-[#fb9d33]/20 px-2.5 py-1 rounded-md tracking-wider uppercase shadow-[0_0_10px_rgba(251,157,51,0.1)]">Live</span>
                    </h2>
                    <button className="px-6 py-2 bg-[#0d0d0d] text-white border border-[#333] hover:border-[#fb9d33] hover:text-[#fb9d33] text-xs font-bold rounded-lg transition-all uppercase tracking-wider shadow-lg cursor-pointer">
                        <Link to="/admin/appointments" className="flex items-center gap-1">
                            View All
                        </Link>
                    </button>
                </div>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 text-[#555] uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Stylist</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {appointments.slice(0, 4).map((appointment, idx) => (
                                <tr key={appointment.id || idx} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://placehold.co/150x150/222/FFF?text=${appointment.name.charAt(0)}`} alt={appointment.name} className="w-9 h-9 rounded-full border border-white/10" />
                                            <span className="font-semibold text-white text-sm">{appointment.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#a1a1aa]">{appointment.service} - {appointment.price || ""}</td>
                                    <td className="px-6 py-4 text-sm text-[#777]">{appointment.stylistName || 'Not assigned'}</td>
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
                                        <AppointmentMenu
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
                    {appointments.slice(0, 4).map((appointment, idx) => (
                        <div key={appointment.id || idx} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={`https://placehold.co/150x150/222/FFF?text=${appointment.name.charAt(0)}`} alt={appointment.name} className="w-10 h-10 rounded-full border border-white/10" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{appointment.name}</h4>
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
                                    <div className="flex items-center gap-1.5 text-xs text-[#FF8A00]">
                                        <Scissors size={12} />
                                        <span>{appointment.stylistName || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 relative">
                                    <span className="text-white font-bold text-sm">{appointment.price}</span>
                                    <AppointmentMenu
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

            {/* Inventory & Staff Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Inventory Card */}
                <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                    <div className="bg-[#161515] px-6 py-6 border-b border-[#333] flex justify-between items-center gap-4">
                        <h2 className="text-2xl font-extrabold text-[#fb9d33] flex items-center gap-2">
                            <span className="text-white">Inventory</span> Status
                            {/* <span className="hidden sm:inline-flex text-xs font-bold text-[#fb9d33] bg-[#fb9d33]/10 border border-[#fb9d33]/20 px-2 py-1 rounded-md tracking-wider uppercase">Real-time</span> */}
                        </h2>
                        <button className="px-4 py-2 bg-[#0d0d0d] text-white border border-[#333] hover:border-[#fb9d33] hover:text-[#fb9d33] text-xs font-bold rounded-lg transition-all uppercase tracking-wider shadow-lg cursor-pointer">
                            Manage Stock
                        </button>
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        <InventoryItem name="Premium Shampoo" stock={85} max={100} image="https://placehold.co/100x100/222/FFF?text=S" />
                        <InventoryItem name="Matte Wax" stock={35} max={100} image="https://placehold.co/100x100/222/FFF?text=W" />
                        <InventoryItem name="Beard Oil" stock={12} max={100} low image="https://placehold.co/100x100/222/FFF?text=O" />
                        <InventoryItem name="Hair Color Dye" stock={5} max={100} critical image="https://placehold.co/100x100/222/FFF?text=D" />
                    </div>
                </div>

                {/* Staff List Card */}
                <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                    <div className="bg-[#161515] px-6 py-6 border-b border-[#333] flex justify-between items-center">
                        <h2 className="text-2xl font-extrabold text-[#fb9d33] flex items-center gap-2">
                            <span className="text-white">Staff</span> Scheduling
                            {/* <span className="hidden sm:inline-flex text-xs font-bold text-[#fb9d33] bg-[#fb9d33]/10 border border-[#fb9d33]/20 px-2 py-1 rounded-md tracking-wider uppercase">Today</span> */}
                        </h2>
                        <button className="px-4 py-2 bg-[#0d0d0d] text-white border border-[#333] hover:border-[#fb9d33] hover:text-[#fb9d33] text-xs font-bold rounded-lg transition-all uppercase tracking-wider shadow-lg cursor-pointer">
                            View ALL
                        </button>
                    </div>
                    <div className="p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                        {todayStaff.length > 0 ? (
                            todayStaff.slice(0, 4).map(staffMember => (
                                <StaffRow
                                    key={staffMember.id}
                                    name={staffMember.name}
                                    role={staffMember.role}
                                    time={staffMember.time}
                                    commission={`${(staffMember.commission * 100)}%`}
                                    online={staffMember.online}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[#777] py-8">
                                <p className="text-sm">No staff scheduled for today</p>
                            </div>
                        )}
                    </div>
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

export default Dashboard
