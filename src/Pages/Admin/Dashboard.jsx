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
import StaffRow from '../../Components/StaffPanel Components/StaffRow'
import AppointmentMenu from '../../Components/AdminPanel Components/AppointmentMenu'
import EditAppointmentModal from '../../Components/AdminPanel Components/EditAppointmentModal'
import ViewAppointmentModal from '../../Components/AdminPanel Components/ViewAppointmentModal'
import { useStaff } from '../../Context/StaffContext'

function Dashboard() {
    const { appointments } = useAppointment()
    const { staff, getActiveStaff } = useStaff()

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

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTodayStaff(workingStaff)
    }, [staff])

    const getTotalPrice = (appointment) => {
        if (Number.isFinite(Number(appointment.totalPrice))) {
            return Number(appointment.totalPrice)
        }
        return appointment.items?.reduce((sum, item) => sum + parseFloat(item.service.price?.replace('$', '') || 0), 0) || 0
    }

    const getServiceSummary = (appointment) =>
        appointment.items?.map(item => item.service.name).join(', ') || appointment.service || '—'

    const getStylistSummary = (appointment) =>
        appointment.items?.map(item => item.stylist?.name).filter(Boolean).join(', ') || appointment.stylistName || 'Unassigned'

    // Calculate Total Revenue
    useEffect(() => {
        const total = appointments.reduce((acc, curr) => acc + getTotalPrice(curr), 0)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTotalRevenue(total)
    }, [appointments])

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-0 sm:px-2 lg:px-8 py-2 sm:py-4 lg:py-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    change={totalRevenue > 0 ? `${((totalRevenue - 100) / 100 * 100).toFixed(1)}%` : "0%"}
                    positive={totalRevenue >= 100}
                    icon={<TrendingUp size={24} />}
                    color="text-champagne"
                    bg="bg-champagne/10"
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
            <div className="bg-obsidian-surface/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-obsidian-surface px-4 sm:px-6 py-4 sm:py-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-champagne flex items-center gap-2 sm:gap-3">
                        <span className="text-white">Recent</span> Appointments
                        <span className="flex items-center justify-center text-[10px] font-bold text-champagne bg-champagne/10 border border-champagne/20 px-2.5 py-1 rounded-md tracking-wider uppercase shadow-[0_0_10px_rgba(251,157,51,0.1)]">Live</span>
                    </h2>
                    <button className="px-4 sm:px-6 py-2 border border-champagne/60 bg-transparent text-champagne font-sans font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-champagne/20 active:scale-95 transition-all duration-500 ease-luxury hover:bg-champagne hover:text-white hover:border-champagne cursor-pointer">
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
                                            <span className="font-semibold text-white text-sm">
                                                {appointment.name}
                                                {appointment.userId == null && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-champagne text-black text-[10px] font-bold uppercase">Guest</span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#a1a1aa]">{getServiceSummary(appointment)}</td>
                                    <td className="px-6 py-4 text-sm text-[#777]">{getStylistSummary(appointment)}</td>
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
                <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {appointments.slice(0, 4).map((appointment, idx) => (
                        <div key={appointment.id || idx} className="bg-obsidian-elevated p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={`https://placehold.co/150x150/222/FFF?text=${appointment.name.charAt(0)}`} alt={appointment.name} className="w-10 h-10 rounded-full border border-white/10" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                            <span>{appointment.name}</span>
                                            {appointment.userId == null && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-champagne text-black text-[10px] font-bold uppercase">Guest</span>
                                            )}
                                        </h4>
                                        <div className="text-xs text-[#777] flex items-center gap-1 mt-0.5">
                                            {getServiceSummary(appointment)}
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
                                    <div className="flex items-center gap-1.5 text-xs text-champagne">
                                        <Scissors size={12} />
                                        <span>{getStylistSummary(appointment)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 relative">
                                    <span className="text-white font-bold text-sm">${getTotalPrice(appointment)}</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Inventory Card */}
                <div className="bg-obsidian-surface/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                    <div className="bg-obsidian-surface px-4 sm:px-6 py-4 sm:py-6 border-b border-[#333] flex justify-between items-center gap-3 sm:gap-4">
                        <h2 className="text-lg sm:text-2xl font-extrabold text-champagne flex items-center gap-2">
                            <span className="text-white">Inventory</span> Status
                            {/* <span className="hidden sm:inline-flex text-xs font-bold text-champagne bg-champagne/10 border border-champagne/20 px-2 py-1 rounded-md tracking-wider uppercase">Real-time</span> */}
                        </h2>
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-champagne/60 bg-transparent text-champagne font-sans font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-champagne/20 active:scale-95 transition-all duration-500 ease-luxury hover:bg-champagne hover:text-white hover:border-champagne cursor-pointer whitespace-nowrap">
                            Manage Stock
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
                        <InventoryItem name="Premium Shampoo" stock={85} max={100} image="https://placehold.co/100x100/222/FFF?text=S" />
                        <InventoryItem name="Matte Wax" stock={35} max={100} image="https://placehold.co/100x100/222/FFF?text=W" />
                        <InventoryItem name="Beard Oil" stock={12} max={100} low image="https://placehold.co/100x100/222/FFF?text=O" />
                        <InventoryItem name="Hair Color Dye" stock={5} max={100} critical image="https://placehold.co/100x100/222/FFF?text=D" />
                    </div>
                </div>

                {/* Staff List Card */}
                <div className="bg-obsidian-surface/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                    <div className="bg-obsidian-surface px-4 sm:px-6 py-4 sm:py-6 border-b border-[#333] flex justify-between items-center">
                        <h2 className="text-lg sm:text-2xl font-extrabold text-champagne flex items-center gap-2">
                            <span className="text-white">Staff</span> Scheduling
                            {/* <span className="hidden sm:inline-flex text-xs font-bold text-champagne bg-champagne/10 border border-champagne/20 px-2 py-1 rounded-md tracking-wider uppercase">Today</span> */}
                        </h2>
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-champagne/60 bg-transparent text-champagne font-sans font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-champagne/20 active:scale-95 transition-all duration-500 ease-luxury hover:bg-champagne hover:text-white hover:border-champagne cursor-pointer whitespace-nowrap">
                            View ALL
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
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
