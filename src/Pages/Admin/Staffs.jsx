import { useState } from 'react'
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Star,
    User,
    Calendar,
    Briefcase,
    ShieldCheck
} from 'lucide-react'
import { useStaff } from '../../Context/StaffContext'
import { useMessage } from '../../Context/MessageContext'

import StaffMenu from '../../Components/StaffPanel Components/StaffMenu'
import StaffAppointmentsModal from '../../Components/StaffPanel Components/StaffAppointmentsModal'
import StaffDetailsModal from '../../Components/AdminPanel Components/StaffDetailsModal'
import AddStaffModal from '../../Components/AdminPanel Components/AddStaffModal'
import EditStaffModal from '../../Components/AdminPanel Components/EditStaffModal'
import ConfirmModal from '../../Components/ConfirmModal'

const Staffs = () => {
    const { staff, removeStaff } = useStaff()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('All')
    const { showMessage } = useMessage()

    // Modal States
    const [viewingApptsFor, setViewingApptsFor] = useState(null)
    const [viewingDetailsFor, setViewingDetailsFor] = useState(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)

    // Confirmation state (replaces window.confirm)
    const [confirmAction, setConfirmAction] = useState(null)

    // Filter Logic
    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = filterRole === 'All' || member.role === filterRole

        return matchesSearch && matchesRole
    })

    // Get unique roles for filter
    const roles = ['All', ...new Set(staff.map(item => item.role))]


    // Helper for Status Badge    // Helper for Status Badge
    const StatusBadge = ({ status = 'inactive' }) => {
        const isActive = status === 'active'
        const displayStatus = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Inactive'

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${isActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                {displayStatus}
            </span>
        )
    }

    // Action Handlers
    const handleCheckAppts = (staff) => setViewingApptsFor(staff)
    const handleViewDetails = (staff) => setViewingDetailsFor(staff)
    const handleEdit = (staff) => {
        setEditingStaff(staff);
    }
    const handleDelete = (staff) => {
        setConfirmAction({
            message: `Are you sure you want to remove ${staff.name} from the team?`,
            onConfirm: () => {
                removeStaff(staff.id)
                showMessage('success', `${staff.name} has been removed from the team.`)
                setConfirmAction(null)
            },
            onCancel: () => setConfirmAction(null)
        })
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        Staff <span className="text-champagne">Management</span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your team of stylists and professionals</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 cursor-pointer bg-champagne hover:bg-champagne-dark text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-champagne/20 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Add New Member</span>
                </button>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center bg-obsidian-surface/50 backdrop-blur-sm border border-white/5 p-3 sm:p-4 rounded-xl">
                {/* Search */}
                <div className="relative group w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted group-focus-within:text-champagne transition-colors">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        className="bg-obsidian border border-[#27272a] text-white text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-9 sm:pl-10 p-2 sm:p-2.5 outline-none transition-all placeholder-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="bg-obsidian border border-[#27272a] rounded-lg px-3 py-2 flex items-center gap-2 w-full sm:w-44 md:w-48">
                        <Filter size={14} className="text-champagne-muted shrink-0" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-transparent text-white text-xs font-medium w-full outline-none cursor-pointer"
                        >
                            {roles.map(role => (
                                <option key={role} value={role} className="bg-obsidian-surface text-white">{role}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Table Container */}
            <div className="bg-obsidian-surface/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {filteredStaff.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-obsidian-elevated p-4 rounded-full mb-4 ring-1 ring-white/5">
                            <User size={48} className="text-[#333]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Staff Members Found</h3>
                        <p className="text-champagne-muted max-w-sm mx-auto">
                            We couldn't find any staff matching your search criteria. Try adjusting your filters or add a new team member.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterRole('All') }}
                            className="mt-6 text-champagne hover:text-champagne-dark text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#161515] text-[#777] uppercase text-[11px] font-bold tracking-wider border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-5">Staff Member</th>
                                        <th className="px-6 py-5">Role & Expertise</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5">Performance</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredStaff.map((member) => (
                                        <tr key={member.id} className="hover:bg-white/2 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#27272a] to-[#18181b] flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/10 group-hover:ring-champagne/50 transition-all">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{member.name}</div>
                                                        <div className="text-[#777] text-xs flex items-center gap-1 mt-0.5">
                                                            <Mail size={10} />
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm font-medium flex items-center gap-1.5">
                                                    <Briefcase size={12} className="text-champagne-muted" />
                                                    {member.role}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {member.specialties.slice(0, 2).map((tech, idx) => (
                                                        <span key={idx} className="text-[10px] bg-obsidian-elevated border border-[#333] text-gray-400 px-1.5 py-0.5 rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {member.specialties.length > 2 && (
                                                        <span className="text-[10px] bg-obsidian-elevated border border-[#333] text-gray-400 px-1.5 py-0.5 rounded">
                                                            +{member.specialties.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={member.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-champagne font-bold text-sm">
                                                        <Star size={12} className="text-champagne fill-current" />
                                                        {member.rating}
                                                    </div>
                                                    <div className="text-xs text-champagne-muted font-medium">
                                                        {member.experience} exp
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <StaffMenu
                                                    staff={member}
                                                    onCheckAppts={handleCheckAppts}
                                                    onViewDetails={handleViewDetails}
                                                    onDelete={handleDelete}
                                                    onEdit={handleEdit}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {filteredStaff.map((member) => (
                                <div key={member.id} className="bg-obsidian-elevated border border-white/5 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center text-white font-bold text-sm ring-1 ring-white/10">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm">{member.name}</h3>
                                                <p className="text-xs text-champagne-muted">{member.role}</p>
                                            </div>
                                        </div>
                                        <StaffMenu
                                            staff={member}
                                            onCheckAppts={handleCheckAppts}
                                            onViewDetails={handleViewDetails}
                                            onDelete={handleDelete}
                                            onEdit={handleEdit}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 py-2 border-y border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={12} /> {member.email}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={12} /> {member.phone}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <StatusBadge status={member.status} />
                                        <div className="flex items-center gap-1 text-champagne font-bold text-xs">
                                            <Star size={12} className="text-champagne fill-current" />
                                            <span>{member.rating}</span>
                                            <span className="text-gray-600 font-normal">({member.experience})</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination/Footer */}
                        <div className="bg-[#161515] px-3 sm:px-6 py-3 sm:py-4 border-t border-[#333] flex justify-between items-center text-[10px] sm:text-xs text-champagne-muted">
                            <span>Showing {filteredStaff.length} members</span>
                            <div className="flex gap-1.5 sm:gap-2">
                                <button className="px-2 sm:px-3 py-1 bg-obsidian-surface border border-[#333] rounded hover:border-champagne hover:text-champagne transition-colors disabled:opacity-50 cursor-pointer">Previous</button>
                                <button className="px-2 sm:px-3 py-1 bg-obsidian-surface border border-[#333] rounded hover:border-champagne hover:text-champagne transition-colors disabled:opacity-50 cursor-pointer">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {viewingApptsFor && (
                <StaffAppointmentsModal
                    staff={viewingApptsFor}
                    onClose={() => setViewingApptsFor(null)}
                />
            )}
            {viewingDetailsFor && (
                <StaffDetailsModal
                    staff={viewingDetailsFor}
                    onClose={() => setViewingDetailsFor(null)}
                />
            )}
            {isAddModalOpen && (
                <AddStaffModal
                    onClose={() => setIsAddModalOpen(false)}
                    onStaffAdded={(newMember) => {
                        showMessage('success', `${newMember.name} has been added to the team.`)
                        setIsAddModalOpen(false)
                    }}
                />
            )}

            {editingStaff && (
                <EditStaffModal
                    staffToEdit={editingStaff}
                    onClose={() => setEditingStaff(null)}
                    onStaffUpdated={(updatedMember) => {
                        showMessage('success', `${updatedMember.name}'s profile has been updated.`)
                        setEditingStaff(null)
                    }}
                />
            )}

            {/* Confirmation modal */}
            {confirmAction && (
                <ConfirmModal
                    message={confirmAction.message}
                    onConfirm={confirmAction.onConfirm}
                    onCancel={confirmAction.onCancel}
                />
            )}
        </div>
    )
}

export default Staffs
