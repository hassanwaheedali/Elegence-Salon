import { useState, useEffect } from 'react'
import { useStaff } from '../../Context/StaffContext'
import { useAuth } from '../../Context/AuthContext'
import { useMessage } from '../../Context/MessageContext'
import {
    Save,
    User,
    Mail,
    Phone,
    Briefcase,
    Scissors,
    Clock
} from 'lucide-react'

function StaffProfile() {
    const { getStaffById, updateStaff } = useStaff()
    const { currentUser } = useAuth()
    const { showMessage } = useMessage()

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialties: '',
        experience: '',
        weekdayStart: '',
        weekdayEnd: '',
        saturdayStart: '',
        saturdayEnd: '',
        sundayStart: '',
        sundayEnd: '',
        sundayEnabled: false,
        schedule: {}
    })

    useEffect(() => {
        if (!currentUser) return;

        const staffData = getStaffById(currentUser.id)
        if (staffData) {
            const schedule = staffData.schedule || {};
            const monday = schedule.monday || { start: "09:00", end: "17:00" };
            const saturday = schedule.saturday || { start: "10:00", end: "16:00" };
            const sunday = schedule.sunday || null;

            setFormData({
                name: staffData.name || '',
                email: staffData.email || '',
                phone: staffData.phone || '',
                specialties: Array.isArray(staffData.specialties)
                    ? staffData.specialties.join(', ')
                    : (staffData.specialties || ''),
                experience: staffData.experience || '',

                weekdayStart: monday.start,
                weekdayEnd: monday.end,
                saturdayStart: saturday.start,
                saturdayEnd: saturday.end,

                sundayEnabled: !!sunday,
                sundayStart: sunday ? sunday.start : '',
                sundayEnd: sunday ? sunday.end : '',

                schedule: schedule
            })
        }
    }, [currentUser, getStaffById])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.email || !formData.phone) {
            showMessage('error', 'Please fill in all required fields (Name, Email, Phone)')
            setIsLoading(false);
            return;
        }

        const updatedSchedule = { ...formData.schedule };

        if (formData.weekdayStart && formData.weekdayEnd) {
            const weekdayTime = { start: formData.weekdayStart, end: formData.weekdayEnd };
            updatedSchedule.monday = weekdayTime;
            updatedSchedule.tuesday = weekdayTime;
            updatedSchedule.wednesday = weekdayTime;
            updatedSchedule.thursday = weekdayTime;
            updatedSchedule.friday = weekdayTime;
        }

        if (formData.saturdayStart && formData.saturdayEnd) {
            updatedSchedule.saturday = { start: formData.saturdayStart, end: formData.saturdayEnd };
        }

        if (formData.sundayEnabled && formData.sundayStart && formData.sundayEnd) {
            updatedSchedule.sunday = { start: formData.sundayStart, end: formData.sundayEnd };
        } else if (!formData.sundayEnabled) {
            updatedSchedule.sunday = null;
        }

        const updatedStaffData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
            experience: formData.experience,
            schedule: updatedSchedule
        };

        const result = await updateStaff(currentUser.id, updatedStaffData);
        setIsLoading(false);

        if (result?.error) {
            showMessage('error', result.error);
        } else {
            showMessage('success', 'Profile updated successfully')

            // Dispatch custom event so AuthContext/other components update
            const event = new CustomEvent('staff-profile-updated', {
                detail: { ...updatedStaffData, id: currentUser.id }
            });
            window.dispatchEvent(event);

            // Re-login essentially updates our currentUser state if it matches in auth context
            // actually AuthContext might need to be refreshed if it depends on generic users list
            // The custom event handles the broad refresh.
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                    My <span className="text-[#FF8A00]">Profile</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your personal information and availability</p>
            </div>

            <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#333] pb-3">
                                <User className="text-[#FF8A00]" size={20} />
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Full Name *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-3 outline-none transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Email *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-3 outline-none transition-all placeholder-gray-700"
                                            disabled // Email is typically not editable by staff themselves, or if so, requires re-auth
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Contact admin to change email.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Phone *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-3 outline-none transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#333] pb-3">
                                <Briefcase className="text-[#FF8A00]" size={20} />
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Professional Info</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Experience</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-3 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="1 year">1 year</option>
                                        <option value="2 years">2 years</option>
                                        <option value="3 years">3 years</option>
                                        <option value="4 years">4 years</option>
                                        <option value="5 years">5 years</option>
                                        <option value="7 years">7 years</option>
                                        <option value="10+ years">10+ years</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Specialties</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <Scissors size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="specialties"
                                            value={formData.specialties}
                                            onChange={handleChange}
                                            placeholder="Haircut, Color, Styling..."
                                            className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-3 outline-none transition-all placeholder-gray-700"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Comma separated. Example: Haircut, Color, Styling</p>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Configuration */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#333] pb-3">
                                <Clock className="text-[#FF8A00]" size={20} />
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Availability</h2>
                            </div>

                            <p className="text-sm text-gray-400">Update your default working hours. This affects when clients can book you.</p>

                            <div className="bg-[#161515] p-6 rounded-xl border border-white/5 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-white">Weekdays (Mon-Fri)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    name="weekdayStart"
                                                    value={formData.weekdayStart}
                                                    onChange={handleChange}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End Time</label>
                                                <input
                                                    type="time"
                                                    name="weekdayEnd"
                                                    value={formData.weekdayEnd}
                                                    onChange={handleChange}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-white">Saturday</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    name="saturdayStart"
                                                    value={formData.saturdayStart}
                                                    onChange={handleChange}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End Time</label>
                                                <input
                                                    type="time"
                                                    name="saturdayEnd"
                                                    value={formData.saturdayEnd}
                                                    onChange={handleChange}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <label className="flex items-center gap-3 text-sm text-white font-bold cursor-pointer mb-4">
                                        <input
                                            type="checkbox"
                                            name="sundayEnabled"
                                            checked={formData.sundayEnabled}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-[#FF8A00] rounded"
                                        />
                                        Available on Sundays
                                    </label>

                                    {formData.sundayEnabled && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        name="sundayStart"
                                                        value={formData.sundayStart}
                                                        onChange={handleChange}
                                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        name="sundayEnd"
                                                        value={formData.sundayEnd}
                                                        onChange={handleChange}
                                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="pt-6 border-t border-[#333] flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-transparent border border-[#333] hover:border-gray-500 text-white font-bold rounded-xl transition-all"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-[#FF8A00] hover:bg-[#e67a00] text-black font-black rounded-xl shadow-lg hover:shadow-[#FF8A00]/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StaffProfile
