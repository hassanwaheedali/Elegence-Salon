import { useState } from 'react'

function RegisterInput() {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
            return
        }
    }
    return (
        <div className="register-box flex flex-col rounded-md shadow-lg text-white w-full max-w-2xl mx-auto scale-90">
            <div className="head bg-[#1a1a1a] p-6 text-center rounded-t-2xl text-[#FF8A00] text-2xl md:text-3xl font-black" style={{ textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}>
                <h2>Create Your Account</h2>
            </div>
            <div className="register-form bg-[#161515] rounded-b-2xl pb-3">
                <form className='px-5 md:px-6.5 py-6' onSubmit={handleSubmit} method="post">
                    <div className="input-forms space-y-6 mb-2">
                        {/* <label htmlFor="fullname" className="flex flex-col text-sm sm:text-base font-black mb-2 ml-1 text-[#454545] tracking-tight">Full Name</label> */}
                        <input type="text" placeholder="FULL NAME" value={fullname} id='fullname' onChange={(e) => setFullname(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4  py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        {/* <label htmlFor="email" className="flex flex-col text-sm sm:text-base font-black mb-2 ml-1 text-[#454545] tracking-tight">Email Address</label> */}
                        <input type="email" placeholder="EMAIL ADDRESS" value={email} id='email' onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4  py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        {/* <label htmlFor="password" className="flex flex-col text-sm sm:text-base font-black mb-2 ml-1 text-[#454545] tracking-tight">Password</label> */}
                        <input type="password" placeholder="PASSWORD" id='password' value={password} onChange={(e) => setPassword(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                        {/* <label htmlFor="confirmPassword" className="flex flex-col text-sm sm:text-base font-black mb-2 ml-1 text-[#454545] tracking-tight">Confirm Password</label> */}
                        <input type="password" placeholder="CONFIRM PASSWORD" id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] rounded-md" required />
                    </div>
                    <div className="submit-button mt-8">
                        <input type="submit" value="Create Account" className="w-full border-4 sm:border-6 border-[#FF8A00] hover:border-white text-white font-black p-2 sm:p-3 px-4 sm:px-6 hover:bg-[#d28127] transition-colors cursor-pointer uppercase text-base sm:text-lg md:text-xl" />
                    </div>
                    {message && <p className="mt-3 text-center text-[#FF8A00]">{message}</p>}
                    <div className="no-account mt-4 sm:mt-5 md:mt-6">
                        <p className="text-center font-bold text-xs sm:text-sm md:text-base text-[#454545] tracking-tighter">Already have an account? <a href="#!" className='text-[#FF8A00]'>Sign In</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterInput
