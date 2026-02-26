import { useState, useMemo, useEffect, useCallback } from 'react'
import { useAppointment } from '../../Context/AppointmentContext'
import { useAuth } from '../../Context/AuthContext'
import {
    Search,
    Filter,
    Calendar,
    Clock,
    X
} from 'lucide-react'
import StatusBadge from '../../Components/AdminPanel Components/StatusBadge'
import StaffAppointmentMenu from '../../Components/StaffPanel Components/StaffAppointmentMenu'
import EditAppointmentModal from '../../Components/AdminPanel Components/EditAppointmentModal'
import ViewAppointmentModal from '../../Components/AdminPanel Components/ViewAppointmentModal'
import SortableHeader from '../../Components/AdminPanel Components/SortableHeader'

// Format date for filter panel (YYYY-MM-DD for date input)
const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Convert MM/DD/YYYY stored date to Date object for comparison
const parseStoredDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr)
}

const categories = ['All', 'Confirmed', 'Pending', 'Awaiting Confirmation', 'Cancelled', 'Completed', 'Checked In']

function StaffAppointments() {
    const { getAppointmentsForStaff } = useAppointment()
    const { currentUser } = useAuth()

    // Fetch only this staff's appointments
    const appointments = useMemo(() => {
        if (!currentUser) return []
        return getAppointmentsForStaff(currentUser.id)
    }, [currentUser, getAppointmentsForStaff])

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [viewingAppointment, setViewingAppointment] = useState(null)
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
    const [timeFilter, setTimeFilter] = useState({ from: '', to: '' })

    // Sort and additional filter states
    const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'desc' })
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState(null)

    const hasActiveFilters = dateFilter.from || timeFilter.from
    const activeFilterCount = [dateFilter.from, timeFilter.from].filter(Boolean).length

    // Close filter panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showFilterPanel && !e.target.closest('.filter-panel-container')) {
                setShowFilterPanel(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showFilterPanel])

    // Memoized handlers for better performance
    const handleSort = useCallback((field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }, [])

    const applyDatePreset = useCallback((preset) => {
        const today = new Date()
        const todayStr = formatLocalDate(today)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = formatLocalDate(tomorrow)

        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekStartStr = formatLocalDate(weekStart)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        const weekEndStr = formatLocalDate(weekEnd)

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthStartStr = formatLocalDate(monthStart)

        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        const monthEndStr = formatLocalDate(monthEnd)

        const presets = {
            'Today': { from: todayStr, to: todayStr },
            'Tomorrow': { from: tomorrowStr, to: tomorrowStr },
            'This Week': { from: weekStartStr, to: weekEndStr },
            'This Month': { from: monthStartStr, to: monthEndStr }
        }

        setDateFilter(presets[preset])
        setSelectedPreset(preset)
    }, [])

    const clearAllFilters = useCallback(() => {
        setDateFilter({ from: '', to: '' })
        setTimeFilter({ from: '', to: '' })
        setSelectedPreset(null)
    }, [])

    const handleEdit = useCallback((appointment) => setEditingAppointment(appointment), [])
    const handleView = useCallback((appointment) => setViewingAppointment(appointment), [])

    const getAssignedServices = useCallback((appointment) => {
        if (!currentUser) return []
        return (appointment.items || []).filter(item => {
            const stylist = item.stylist
            return stylist && (stylist.id === currentUser.id || stylist.email?.toLowerCase() === currentUser.email?.toLowerCase())
        }).map(item => item.service) || []
    }, [currentUser])

    const getAssignedServiceText = useCallback((appointment) => {
        const list = getAssignedServices(appointment)
        return list.length ? list.map(s => s.name).join(', ') : '—'
    }, [getAssignedServices])

    const getAssignedTotal = useCallback((appointment) =>
        getAssignedServices(appointment).reduce((sum, s) => sum + parseFloat(s.price?.replace('$', '') || 0), 0),
        [getAssignedServices])

    // Enhanced filter and sort logic - optimized with useMemo
    const filteredAndSortedAppointments = useMemo(() => {
        let result = appointments.filter(appointment => {
            // Search filter
            const matchedSearch = !searchTerm ||
                appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.phone?.includes(searchTerm) ||
                getAssignedServiceText(appointment).toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.id?.toString().includes(searchTerm)

            // Status filter
            const matchedStatus = statusFilter === 'All' || appointment.status === statusFilter

            // Date filter
            let matchedDate = true
            if (dateFilter.from) {
                const appointmentDate = parseStoredDate(appointment.date)
                const fromDate = new Date(dateFilter.from)
                const toDate = dateFilter.to ? new Date(dateFilter.to) : fromDate

                if (appointmentDate) {
                    appointmentDate.setHours(0, 0, 0, 0)
                    fromDate.setHours(0, 0, 0, 0)
                    toDate.setHours(23, 59, 59, 999)

                    matchedDate = appointmentDate >= fromDate && appointmentDate <= toDate
                }
            }

            // Time filter
            let matchedTime = true
            if (timeFilter.from) {
                const toTime = timeFilter.to || '23:59'
                matchedTime = appointment.time >= timeFilter.from && appointment.time <= toTime
            }

            return matchedSearch && matchedStatus && matchedDate && matchedTime
        })

        // Apply sorting
        if (sortConfig.field) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.field]
                let bVal = b[sortConfig.field]

                if (sortConfig.field === 'service') {
                    aVal = getAssignedServiceText(a)
                    bVal = getAssignedServiceText(b)
                }

                if (sortConfig.field === 'date') {
                    aVal = parseStoredDate(a.date)
                    bVal = parseStoredDate(b.date)
                }

                if (sortConfig.field === 'id') {
                    aVal = parseInt(aVal, 10)
                    bVal = parseInt(bVal, 10)
                }

                if (!aVal) return 1
                if (!bVal) return -1

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [appointments, searchTerm, statusFilter, dateFilter, timeFilter, sortConfig, getAssignedServiceText])

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        My <span className="text-champagne">Appointments</span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">View and manage all your assigned client bookings</p>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted group-focus-within:text-champagne transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search client, service, ID..."
                            className="bg-obsidian-surface border border-[#333] text-white text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full sm:w-52 md:w-64 pl-9 sm:pl-10 p-2 sm:p-2.5 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                            <Filter size={16} />
                        </div>
                        <select
                            className="bg-obsidian-surface border border-[#333] text-white text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full sm:w-44 md:w-48 pl-9 sm:pl-10 p-2 sm:p-2.5 appearance-none cursor-pointer outline-none transition-all"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-champagne-muted">
                            <span className="text-xs">▼</span>
                        </div>
                    </div>

                    {/* Advanced Filter Button */}
                    <div className="relative filter-panel-container">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`relative bg-obsidian-surface border ${hasActiveFilters ? 'border-champagne text-champagne' : 'border-[#333] text-gray-400'
                                } text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 hover:border-champagne hover:text-champagne transition-all outline-none w-full sm:w-auto justify-center font-medium cursor-pointer`}
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-champagne text-black text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Filter Panel */}
                        {showFilterPanel && (
                            <div className="absolute top-full mt-2 right-0 left-0 sm:left-auto w-full sm:w-80 bg-obsidian-surface border border-[#333] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="bg-obsidian-surface px-4 py-3 border-b border-[#333] flex justify-between items-center">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Filter Appointments</h3>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs text-champagne hover:text-white transition-colors font-bold uppercase tracking-wide"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="p-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                    {/* Quick Date Presets */}
                                    <div>
                                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2 block">Quick Filter</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Today', 'Tomorrow', 'This Week', 'This Month'].map(preset => (
                                                <button
                                                    key={preset}
                                                    onClick={() => applyDatePreset(preset)}
                                                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${selectedPreset === preset
                                                        ? 'bg-champagne border-champagne text-black shadow-lg shadow-champagne/30'
                                                        : 'bg-obsidian border-[#333] text-gray-400 hover:border-champagne hover:text-champagne'
                                                        }`}
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Date Range */}
                                    <div>
                                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2 block">Date Range</label>
                                        <div className="space-y-2">
                                            <input
                                                type="date"
                                                value={dateFilter.from}
                                                onChange={(e) => {
                                                    setDateFilter({ ...dateFilter, from: e.target.value })
                                                    setSelectedPreset(null)
                                                }}
                                                className="w-full bg-obsidian border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-champagne focus:ring-1 focus:ring-champagne outline-none transition-all"
                                                placeholder="From"
                                            />
                                            <input
                                                type="date"
                                                value={dateFilter.to}
                                                onChange={(e) => {
                                                    setDateFilter({ ...dateFilter, to: e.target.value })
                                                    setSelectedPreset(null)
                                                }}
                                                className="w-full bg-obsidian border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-champagne focus:ring-1 focus:ring-champagne outline-none transition-all"
                                                placeholder="To"
                                            />
                                        </div>
                                    </div>

                                    {/* Time Range */}
                                    <div>
                                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2 block">Time Range</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="time"
                                                value={timeFilter.from}
                                                onChange={(e) => setTimeFilter({ ...timeFilter, from: e.target.value })}
                                                className="w-full bg-obsidian border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-champagne focus:ring-1 focus:ring-champagne outline-none transition-all"
                                            />
                                            <input
                                                type="time"
                                                value={timeFilter.to}
                                                onChange={(e) => setTimeFilter({ ...timeFilter, to: e.target.value })}
                                                className="w-full bg-obsidian border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-champagne focus:ring-1 focus:ring-champagne outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-obsidian-surface px-4 py-3 border-t border-[#333]">
                                    <button
                                        onClick={() => setShowFilterPanel(false)}
                                        className="w-full bg-champagne hover:bg-champagne-dark text-black cursor-pointer font-black py-2.5 rounded-lg transition-colors text-sm uppercase tracking-wide shadow-lg"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center bg-obsidian-surface/30 border border-[#333] rounded-lg p-3">
                    <span className="text-champagne-muted text-xs font-bold uppercase tracking-wider">Active Filters:</span>

                    {dateFilter.from && (
                        <span className="bg-obsidian-elevated border border-champagne/50 text-champagne px-3 py-1.5 rounded-full text-xs flex items-center gap-2 font-medium">
                            <Calendar size={12} />
                            {dateFilter.from} {dateFilter.to && `→ ${dateFilter.to}`}
                            <button
                                onClick={() => { setDateFilter({ from: '', to: '' }); setSelectedPreset(null) }}
                                className="hover:text-white transition-colors ml-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}

                    {timeFilter.from && (
                        <span className="bg-obsidian-elevated border border-champagne/50 text-champagne px-3 py-1.5 rounded-full text-xs flex items-center gap-2 font-medium">
                            <Clock size={12} />
                            {timeFilter.from} {timeFilter.to && `→ ${timeFilter.to}`}
                            <button
                                onClick={() => setTimeFilter({ from: '', to: '' })}
                                className="hover:text-white transition-colors ml-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}

                    <button
                        onClick={clearAllFilters}
                        className="ml-auto text-xs text-white hover:text-champagne transition-colors font-bold uppercase tracking-wide"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Appointments Table Card */}
            <div className="bg-obsidian-surface/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">

                {filteredAndSortedAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-obsidian-elevated p-4 rounded-full mb-4">
                            <Calendar size={48} className="text-[#333]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Appointments Found</h3>
                        <p className="text-champagne-muted max-w-md">There are no appointments matching your criteria.</p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 px-6 py-2.5 bg-champagne hover:bg-champagne-dark text-black cursor-pointer font-bold rounded-lg text-sm transition-colors uppercase tracking-wide shadow-lg"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table - hidden on mobile */}
                        <div className="hidden lg:block overflow-x-auto overflow-y-auto max-h-[65vh] min-h-100 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-obsidian-surface text-[#777] uppercase text-[11px] font-bold tracking-wider border-b border-[#333] sticky top-0 z-10">
                                    <tr>
                                        <SortableHeader field="id" currentSort={sortConfig} onSort={handleSort}>
                                            ID
                                        </SortableHeader>
                                        <SortableHeader field="name" currentSort={sortConfig} onSort={handleSort}>
                                            Client Details
                                        </SortableHeader>
                                        <SortableHeader field="service" currentSort={sortConfig} onSort={handleSort}>
                                            Service Info
                                        </SortableHeader>
                                        <SortableHeader field="date" currentSort={sortConfig} onSort={handleSort}>
                                            Date & Time
                                        </SortableHeader>
                                        <SortableHeader field="status" currentSort={sortConfig} onSort={handleSort}>
                                            Status
                                        </SortableHeader>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredAndSortedAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-white/2 transition-colors group">
                                            <td className="px-6 py-4 text-[#555] font-mono text-xs">
                                                #{appointment.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-champagne to-champagne-dark flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        {appointment.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-bold text-white text-sm">{appointment.name}</div>
                                                        </div>
                                                        <div className="text-[#777] text-xs flex items-center gap-1 mt-0.5">
                                                            {appointment.phone || "No Phone"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 text-sm font-medium">{getAssignedServiceText(appointment)}</div>
                                                <div className="text-champagne text-xs font-bold mt-1">${getAssignedTotal(appointment)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-white text-sm font-medium">
                                                        <Calendar size={12} className="text-champagne-muted" /> {appointment.date}
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

                        {/* Mobile Card View - visible below lg */}
                        <div className="lg:hidden divide-y divide-white/5 max-h-[65vh] overflow-y-auto custom-scrollbar">
                            {filteredAndSortedAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-3 sm:p-4 hover:bg-white/2 transition-colors">
                                    {/* Top row: avatar + name + status + menu */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-champagne to-champagne-dark flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shrink-0">
                                                {appointment.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-white text-xs sm:text-sm truncate">{appointment.name}</div>
                                                <div className="text-[#777] text-[10px] sm:text-xs">#{appointment.id} · {appointment.phone || "No Phone"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <StatusBadge status={appointment.status} />
                                            <StaffAppointmentMenu
                                                appointment={appointment}
                                                onEdit={handleEdit}
                                                onView={handleView}
                                            />
                                        </div>
                                    </div>
                                    {/* Details grid */}
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] sm:text-xs ml-10 sm:ml-11.5">
                                        <div>
                                            <span className="text-[#555] uppercase tracking-wide font-bold">Services</span>
                                            <div className="text-gray-300 font-medium mt-0.5 truncate">{getAssignedServiceText(appointment)}</div>
                                        </div>
                                        <div>
                                            <span className="text-[#555] uppercase tracking-wide font-bold">Total</span>
                                            <div className="text-champagne font-bold mt-0.5">${getAssignedTotal(appointment)}</div>
                                        </div>
                                        <div>
                                            <span className="text-[#555] uppercase tracking-wide font-bold">Date</span>
                                            <div className="text-white font-medium mt-0.5 flex items-center gap-1">
                                                <Calendar size={10} className="text-champagne-muted" /> {appointment.date}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[#555] uppercase tracking-wide font-bold">Time</span>
                                            <div className="text-[#999] font-medium mt-0.5 flex items-center gap-1">
                                                <Clock size={10} /> {appointment.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="bg-obsidian-surface px-3 sm:px-6 py-3 sm:py-4 border-t border-[#333] flex justify-between items-center text-[10px] sm:text-xs text-champagne-muted">
                            <span>Showing <span className="text-champagne font-bold">{filteredAndSortedAppointments.length}</span> of <span className="text-white font-bold">{appointments.length}</span> entries</span>
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

export default StaffAppointments
