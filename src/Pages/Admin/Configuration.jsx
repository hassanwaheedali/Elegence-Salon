import { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useMessage } from '../../Context/MessageContext'
import { Save, User, Mail, Phone, Clock } from 'lucide-react'

function Configuration() {
    const { currentUser, updatedUser } = useAuth()
    const { showMessage } = useMessage()

    const [isLoading, setIsLoading] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        if (!currentUser) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || ''
        })
    }, [currentUser])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!currentUser) return

        if (!formData.name || !formData.phone) {
            showMessage('error', 'Please fill in all required fields (Name, Phone)')
            return
        }

        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(formData.phone)) {
            showMessage('error', 'Please enter a valid Pakistani phone number (e.g., 0336-3090793 or +9233363090793).')
            return
        }

        const shouldChangePassword = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword

        if (shouldChangePassword) {
            if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                showMessage('error', 'Please fill in all password fields')
                return
            }
            if (passwordData.currentPassword !== currentUser?.password) {
                showMessage('error', 'Current password is incorrect')
                return
            }
            if (passwordData.newPassword.length < 6) {
                showMessage('error', 'New password must be at least 6 characters')
                return
            }
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                showMessage('error', 'New password and confirm password do not match')
                return
            }
        }

        setIsLoading(true)
        const updated = {
            ...currentUser,
            name: formData.name,
            phone: formData.phone
        }

        if (shouldChangePassword) {
            updated.password = passwordData.newPassword
        }

        const result = await updatedUser(updated)
        setIsLoading(false)

        if (result?.success) {
            showMessage('success', 'Profile updated successfully')
            if (shouldChangePassword) {
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            }
        } else {
            showMessage('error', result?.error || 'Failed to update profile')
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                    My <span className="text-[#FF8A00]">Profile</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your account information and security</p>
            </div>

            <div className="bg-[#121212]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">


                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
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
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Contact support to change email.</p>
                                </div>

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

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#333] pb-3">
                                <Clock className="text-[#FF8A00]" size={20} />
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Security</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-3 outline-none transition-all placeholder-[#777777]/70 mt-1"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-3 outline-none transition-all placeholder-[#777777]/70 mt-1"
                                        placeholder="Enter new password"
                                    />
                                </div>

                            </div>
                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] block w-full p-3 outline-none transition-all placeholder-[#777777]/70 mt-1"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#333] flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#FF8A00] hover:bg-[#e67a00] text-black font-black rounded-xl shadow-lg hover:shadow-[#FF8A00]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Save size={16} />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Configuration
