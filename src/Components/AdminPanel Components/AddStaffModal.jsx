import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Mail, Phone, Briefcase, Scissors, Clock, Lock } from 'lucide-react';
import { useStaff } from '../../Context/StaffContext';

const AddStaffModal = ({ onClose, onStaffAdded }) => {
    const { addNewStaff } = useStaff()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        specialties: '',
        // Default values for fields required but not in form
        experience: '',
        rating: 5.0,
        commission: 0.3,
        weekdayStart: '',
        weekdayEnd: '',
        saturdayStart: '',
        saturdayEnd: '',
        sundayStart: '',
        sundayEnd: '',
        sundayEnabled: false,
        schedule: {
            monday: { start: "09:00", end: "17:00" },
            tuesday: { start: "09:00", end: "17:00" },
            wednesday: { start: "09:00", end: "17:00" },
            thursday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
            saturday: { start: "10:00", end: "16:00" },
            sunday: null
        }
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.specialties || !formData.password) {
            setError('Please fill in all required fields (password required for staff accounts)');
            return;
        }

        // Format specialties from string to array
        const updatedSchedule = { ...formData.schedule }

        if (formData.weekdayStart && formData.weekdayEnd) {
            updatedSchedule.monday = { start: formData.weekdayStart, end: formData.weekdayEnd }
            updatedSchedule.tuesday = { start: formData.weekdayStart, end: formData.weekdayEnd }
            updatedSchedule.wednesday = { start: formData.weekdayStart, end: formData.weekdayEnd }
            updatedSchedule.thursday = { start: formData.weekdayStart, end: formData.weekdayEnd }
            updatedSchedule.friday = { start: formData.weekdayStart, end: formData.weekdayEnd }
        }

        if (formData.saturdayStart && formData.saturdayEnd) {
            updatedSchedule.saturday = { start: formData.saturdayStart, end: formData.saturdayEnd }
        }

        if (formData.sundayEnabled && formData.sundayStart && formData.sundayEnd) {
            updatedSchedule.sunday = { start: formData.sundayStart, end: formData.sundayEnd }
        }

        const newStaffMember = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            accountRole: 'staff',
            password: formData.password,
            experience: formData.experience || 'New',
            rating: formData.rating,
            commission: formData.commission,
            schedule: updatedSchedule,
            specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        };

        const result = await addNewStaff(newStaffMember);

        if (result?.error) {
            setError(result.error);
            return;
        }

        if (result?.member) {
            onStaffAdded?.(result.member);
        }

        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121212] border border-white/10 w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl animate-scale-in flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#161515]">
                    <h2 className="text-xl font-bold text-white">Add New Staff Member</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name and Role Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Role / Position</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Briefcase size={16} />
                                    </div>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        <option value="Senior Stylist">Senior Stylist</option>
                                        <option value="Color Specialist">Color Specialist</option>
                                        <option value="Junior Barber">Junior Barber</option>
                                        <option value="Makeup Artist">Makeup Artist</option>
                                        <option value="Receptionist">Receptionist</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password (for staff login) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Account Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Set a password for staff login"
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Specialties (Comma separated)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <Scissors size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="specialties"
                                    value={formData.specialties}
                                    onChange={handleChange}
                                    placeholder="Haircut, Beard Trim, Styling..."
                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                />
                            </div>
                            <p className="text-[#555] text-xs ml-1">Example: Haircut, Color, Styling</p>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Experience (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <Briefcase size={16} />
                                </div>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Use default (New)</option>
                                    <option value="1 year">1 year</option>
                                    <option value="2 years">2 years</option>
                                    <option value="3 years">3 years</option>
                                    <option value="5 years">5 years</option>
                                    <option value="7 years">7 years</option>
                                    <option value="10+ years">10+ years</option>
                                </select>
                            </div>
                        </div>

                        {/* Schedule */}
                        <details className="group rounded-lg border border-white/5 bg-[#141414]">
                            <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <span className="text-gray-400 text-xs font-bold uppercase">Timing (Optional)</span>
                                </div>
                                <span className="text-[11px] text-gray-500 group-open:text-[#FF8A00]">Toggle</span>
                            </summary>
                            <div className="px-3 pb-3 pt-2 space-y-3">
                                <details className="rounded-lg border border-white/5 bg-[#161515]">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Weekdays</span>
                                        <span className="text-[11px] text-gray-500">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start</label>
                                            <input
                                                type="time"
                                                name="weekdayStart"
                                                value={formData.weekdayStart}
                                                onChange={handleChange}
                                                className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End</label>
                                            <input
                                                type="time"
                                                name="weekdayEnd"
                                                value={formData.weekdayEnd}
                                                onChange={handleChange}
                                                className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </details>
                                <details className="rounded-lg border border-white/5 bg-[#161515]">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Saturday</span>
                                        <span className="text-[11px] text-gray-500">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start</label>
                                            <input
                                                type="time"
                                                name="saturdayStart"
                                                value={formData.saturdayStart}
                                                onChange={handleChange}
                                                className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End</label>
                                            <input
                                                type="time"
                                                name="saturdayEnd"
                                                value={formData.saturdayEnd}
                                                onChange={handleChange}
                                                className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </details>
                                <details className="rounded-lg border border-white/5 bg-[#161515]">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Sunday</span>
                                        <span className="text-[11px] text-gray-500">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 space-y-3">
                                        <label className="flex items-center gap-2 text-xs text-gray-500">
                                            <input
                                                type="checkbox"
                                                name="sundayEnabled"
                                                checked={formData.sundayEnabled}
                                                onChange={handleChange}
                                                className="accent-[#FF8A00]"
                                            />
                                            Enable Sunday timing
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">Start</label>
                                                <input
                                                    type="time"
                                                    name="sundayStart"
                                                    value={formData.sundayStart}
                                                    onChange={handleChange}
                                                    disabled={!formData.sundayEnabled}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-gray-500 text-[11px] font-semibold uppercase ml-1">End</label>
                                                <input
                                                    type="time"
                                                    name="sundayEnd"
                                                    value={formData.sundayEnd}
                                                    onChange={handleChange}
                                                    disabled={!formData.sundayEnabled}
                                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-2.5 outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </details>
                                <p className="text-[#555] text-xs">Leave fields empty to keep default timing. Sunday stays off unless enabled. Default Timings: <br></br> Weekdays: (9:00AM TO 17:00PM) <br /> Saturday: (10:00AM TO 16:00PM) <br /> Sunday Off</p>
                            </div>
                        </details>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#161515] flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#FF8A00] hover:bg-[#e67a00] text-white text-sm font-bold rounded-lg transition-colors shadow-lg hover:shadow-[#FF8A00]/20 flex items-center gap-2 cursor-pointer"
                    >
                        <Save size={16} />
                        Save Member
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default AddStaffModal;
