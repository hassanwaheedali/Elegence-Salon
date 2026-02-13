import { useState } from 'react'
import { useAppointment } from '../../Context/AppointmentContext'
import {
    Search,
    Filter,
    Calendar,
    MoreVertical,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react'
import StatusBadge from '../../Components/AdminPanel Components/StatusBadge'
import AppointmentMenu from '../../Components/AdminPanel Components/AppointmentMenu'
import EditAppointmentModal from '../../Components/AdminPanel Components/EditAppointmentModal'
import ViewAppointmentModal from '../../Components/AdminPanel Components/ViewAppointmentModal'

function Appointments() {
    const { appointments } = useAppointment()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [viewingAppointment, setViewingAppointment] = useState(null)

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment)
        // logic to open modal will be handled by rendering the modal conditionally
    }

    const handleView = (appointment) => {
        setViewingAppointment(appointment)
    }

    // Filter appointments based on search and status
    const filteredAppointments = appointments.filter(appointment => {
        const matchedSearch = appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.phone?.includes(searchTerm) ||
            appointment.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.id?.toString().includes(searchTerm) ||
            appointment.stylistName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchedStatus = statusFilter === 'All' || appointment.status === statusFilter;

        return matchedSearch && matchedStatus;
    });

    const categories = ['All', 'Confirmed', 'Pending', 'Awaiting Confirmation', 'Cancelled', 'Completed'];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        Appointments <span className="text-[#FF8A00]">Manager</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">View and manage all client bookings</p>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF8A00] transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search client, service, ID..."
                            className="bg-[#121212] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full sm:w-64 pl-10 p-2.5 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Filter size={18} />
                        </div>
                        <select
                            className="bg-[#121212] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full sm:w-48 pl-10 p-2.5 appearance-none cursor-pointer outline-none transition-all"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                            <span className="text-xs">▼</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments Table Card */}
            <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">

                {/* Loader / Empty State */}
                {appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                            <Calendar size={48} className="text-[#333]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Appointments Found</h3>
                        <p className="text-gray-500 max-w-md">There are no appointments in the system yet. New bookings will appear here.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto min-h-100">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#161515] text-[#777] uppercase text-[11px] font-bold tracking-wider border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-5">ID</th>
                                        <th className="px-6 py-5">Client Details</th>
                                        <th className="px-6 py-5">Service Info</th>
                                        <th className="px-6 py-5">Stylist</th>
                                        <th className="px-6 py-5">Date & Time</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((appointment) => (
                                            <tr key={appointment.id} className="hover:bg-white/2 transition-colors group">
                                                <td className="px-6 py-4 text-[#555] font-mono text-xs">
                                                    #{appointment.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FF8A00] to-[#FF5C00] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                            {appointment.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-sm">{appointment.name}</div>
                                                            <div className="text-[#777] text-xs flex items-center gap-1 mt-0.5">
                                                                {appointment.phone || "No Phone"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-300 text-sm font-medium">{appointment.service}</div>
                                                    <div className="text-[#FF8A00] text-xs font-bold mt-1">{appointment.price}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {appointment.stylistName ? (
                                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                                            <User size={12} /> {appointment.stylistName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[#555] text-xs italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5 text-white text-sm font-medium">
                                                            <Calendar size={12} className="text-gray-500" /> {appointment.date}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[#777] text-xs mt-1 pl-0.5">
                                                            <Clock size={12} /> {appointment.time}
                                                        </div>
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No appointments match your search/filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Footer / Pagination Placeholder */}
                        <div className="bg-[#161515] px-6 py-4 border-t border-[#333] flex justify-between items-center text-xs text-gray-500">
                            <span>Showing {filteredAppointments.length} of {appointments.length} entries</span>
                            <div className="flex gap-2">
                                <button className={`px-3 py-1 bg-[#121212] border border-[#333] rounded hover:border-[#FF8A00] hover:text-[#FF8A00] transition-colors disabled:opacity-50 ${filteredAppointments.length === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Previous</button>
                                <button className={`px-3 py-1 bg-[#121212] border border-[#333] rounded hover:border-[#FF8A00] hover:text-[#FF8A00] transition-colors disabled:opacity-50 ${filteredAppointments.length > 10 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Next</button>
                            </div>
                        </div>
                    </>
                )}
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
        </div >
    )
}

export default Appointments
