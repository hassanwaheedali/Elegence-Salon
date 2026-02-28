import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Mail, Phone, Briefcase, Scissors, Clock, Lock, ImagePlus } from 'lucide-react';
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
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate WebP format
        if (file.type !== 'image/webp') {
            setError('Only WebP format images are supported. Please select a .webp file.');
            e.target.value = '';
            return;
        }

        setError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

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
            specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
            avatar: avatarPreview || null
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="bg-obsidian-surface border border-white/10 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl animate-scale-in flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-obsidian-surface">
                    <h2 className="text-base sm:text-xl font-bold text-white">Add New Staff Member</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Picture Upload */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Profile Picture (Optional)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-obsidian-elevated border-2 border-dashed border-[#333] flex items-center justify-center shrink-0 group">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlus size={20} className="text-[#555]" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-bold text-champagne hover:text-champagne-dark transition-colors cursor-pointer"
                                    >
                                        {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <p className="text-[#555] text-[10px]">WebP format only (.webp)</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".webp,image/webp"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Name and Role Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Role / Position</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <Briefcase size={16} />
                                    </div>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
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
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password (for staff login) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Account Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Set a password for staff login"
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Specialties (Comma separated)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                    <Scissors size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="specialties"
                                    value={formData.specialties}
                                    onChange={handleChange}
                                    placeholder="Haircut, Beard Trim, Styling..."
                                    className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                                />
                            </div>
                            <p className="text-[#555] text-xs ml-1">Example: Haircut, Color, Styling</p>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Experience (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                    <Briefcase size={16} />
                                </div>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
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
                                    <Clock size={16} className="text-champagne-muted" />
                                    <span className="text-gray-400 text-xs font-bold uppercase">Timing (Optional)</span>
                                </div>
                                <span className="text-[11px] text-champagne-muted group-open:text-champagne">Toggle</span>
                            </summary>
                            <div className="px-3 pb-3 pt-2 space-y-3">
                                <details className="rounded-lg border border-white/5 bg-obsidian-surface">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Weekdays</span>
                                        <span className="text-[11px] text-champagne-muted">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Start</label>
                                            <input
                                                type="time"
                                                name="weekdayStart"
                                                value={formData.weekdayStart}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">End</label>
                                            <input
                                                type="time"
                                                name="weekdayEnd"
                                                value={formData.weekdayEnd}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </details>
                                <details className="rounded-lg border border-white/5 bg-obsidian-surface">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Saturday</span>
                                        <span className="text-[11px] text-champagne-muted">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Start</label>
                                            <input
                                                type="time"
                                                name="saturdayStart"
                                                value={formData.saturdayStart}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">End</label>
                                            <input
                                                type="time"
                                                name="saturdayEnd"
                                                value={formData.saturdayEnd}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </details>
                                <details className="rounded-lg border border-white/5 bg-obsidian-surface">
                                    <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2">
                                        <span className="text-gray-400 text-[11px] font-bold uppercase">Sunday</span>
                                        <span className="text-[11px] text-champagne-muted">Set</span>
                                    </summary>
                                    <div className="px-3 pb-3 pt-2 space-y-3">
                                        <label className="flex items-center gap-2 text-xs text-champagne-muted">
                                            <input
                                                type="checkbox"
                                                name="sundayEnabled"
                                                checked={formData.sundayEnabled}
                                                onChange={handleChange}
                                                className="accent-champagne"
                                            />
                                            Enable Sunday timing
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Start</label>
                                                <input
                                                    type="time"
                                                    name="sundayStart"
                                                    value={formData.sundayStart}
                                                    onChange={handleChange}
                                                    disabled={!formData.sundayEnabled}
                                                    className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">End</label>
                                                <input
                                                    type="time"
                                                    name="sundayEnd"
                                                    value={formData.sundayEnd}
                                                    onChange={handleChange}
                                                    disabled={!formData.sundayEnabled}
                                                    className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all disabled:opacity-50"
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
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/5 bg-obsidian-surface flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-champagne hover:bg-champagne-dark text-white text-sm font-bold rounded-lg transition-colors shadow-lg hover:shadow-champagne/20 flex items-center gap-2 cursor-pointer"
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
