import { useState } from 'react'
import { useAuth } from '../Context/AuthContext.jsx'
import { useMessage } from '../Context/MessageContext.jsx'
import { Link } from 'react-router-dom'

function RegisterInput() {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const { register } = useAuth()
    const { showMessage } = useMessage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
            return
        }
        if (phone.length < 11) {
            setMessage('Phone number must be at least 11 digits')
            return
        }
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(phone)) {
            showMessage('error', 'Please enter a valid Pakistani phone number (e.g., 0336-3090793 or +9233363090793).')
            return
        }
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters')
            return
        }
        const result = await register({ fullname, email, phone, password });
        if (result.success) {
            setMessage('Registration successful! You can now log in.')
            setFullname('')
            setEmail('')
            setPhone('')
            setPassword('')
            setConfirmPassword('')
        }
        else {
            setMessage(result.error)
        }
    }
    return (
        <div className="register-box flex flex-col rounded-md shadow-lg text-white w-full max-w-2xl mx-auto scale-88">
            <div className="head bg-[#1a1a1a] p-6 text-center rounded-t-2xl text-[#FF8A00] text-2xl md:text-4xl font-black" style={{ textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}>
                <h2>Create Your Account</h2>
            </div>
            <div className="register-form bg-[#161515] rounded-b-2xl pb-3">
                <form className='px-5 md:px-9 py-6' onSubmit={handleSubmit} method="post">
                    <div className="input-forms space-y-6 mb-2">
                        <input type="text" placeholder="FULL NAME" value={fullname} id='fullname' onChange={(e) => setFullname(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4  py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        <input type="email" placeholder="EMAIL ADDRESS" value={email} id='email' onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4  py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        <input type="tel" placeholder="PHONE NUMBER" value={phone} id='phone' onChange={(e) => setPhone(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4  py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        <input type="password" placeholder="PASSWORD" id='password' value={password} onChange={(e) => setPassword(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        <input type="password" placeholder="CONFIRM PASSWORD" id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                    </div>
                    <div className="submit-button mt-8">
                        <input type="submit" value="Create Account" className="w-full border-4 sm:border-6 border-[#FF8A00] hover:border-white text-white font-black p-2 sm:p-3 px-4 sm:px-6 hover:bg-[#d28127] transition-colors cursor-pointer uppercase text-base sm:text-lg md:text-xl" />
                    </div>
                    {message && <p className="mt-3 text-center text-[#FF8A00]">{message}</p>}
                    <div className="no-account mt-4 sm:mt-5 md:mt-6">
                        <p className="text-center font-bold text-xs sm:text-sm md:text-base text-[#454545] tracking-tighter">Already have an account? <Link to="/login" className='text-[#FF8A00]'>Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterInput
