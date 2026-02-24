import { useState, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

function LoginInput() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [message, setMessage] = useState("")
    const { login, currentUser } = useAuth()
    const navigate = useNavigate()

    // Effect to handle navigation after login
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === "admin") {
                navigate("/admin/dashboard");
            } else if (currentUser.accountRole === 'staff') {
                navigate('/staff/dashboard');
            } else {
                navigate("/");
            }
        }
    }, [currentUser, message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (currentUser) {
            setMessage("You are already logged in!")
            return
        }
        const result = await login({ email, password, rememberMe });
        if (result.success) {
            setMessage("Login successful!")
            setEmail("")
            setPassword("")
            // Navigation will be handled by the useEffect hook
        } else {
            setMessage(result.error)
        }
    }
    return (
        <div className="login-box flex flex-col rounded-lg shadow-lg text-white w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <div className="head bg-obsidian-elevated p-4 sm:p-5 text-center rounded-t-2xl text-champagne text-2xl sm:text-3xl md:text-4xl font-black uppercase" style={{ textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}>
                <h2>Login</h2>
            </div>
            <div className="login-form bg-obsidian-surface rounded-b-2xl pb-4 pt-2">
                <form className='p-4 sm:p-6 md:p-8' onSubmit={handleSubmit} method="post">
                    <div className="input-forms space-y-4 sm:space-y-5 md:space-y-7 mb-2">
                        <input type="email" name="userMail" value={email} id="userMail" placeholder="EMAIL" onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne] rounded-md" required />
                        <input type="password" name="userPassword" id="userPassword" value={password} placeholder="PASSWORD" onChange={(e) => setPassword(e.target.value)} className="w-full font-black border-4 border-[#454545] p-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder-[#454545] text-[#dddddd] tracking-tight hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne] rounded-md" required />
                    </div>
                    <div className="remember-forgot flex justify-between items-center mt-4 sm:mt-5 mb-10 mx-1">
                        <label className='flex items-center cursor-pointer'>
                            <input type="checkbox" name="rememberMe" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className='appearance-none w-4 h-4 rounded-full border-4 border-champagne bg-transparent checked:bg-champagne focus:outline-none focus:ring-champagne focus:ring-offset-0 cursor-pointer' />
                            <span className='text-xs sm:text-sm ml-1.5 text-[#454545] tracking-tight font-bold pb-0.5'>Remember Me</span>
                        </label>
                        <a href="#!" className='text-champagne hover:text-champagne text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 hover:underline'>Forgot Your Password?</a>
                    </div>
                    <div className="submit-button">
                        <input type="submit" value="Login" className="w-full border-4 sm:border-5 border-champagne hover:border-white text-white font-black p-2 sm:p-3 px-4 sm:px-6 hover:bg-[#d28127] transition-colors cursor-pointer uppercase text-base sm:text-lg md:text-xl" />
                    </div>
                    {message && <p className="mt-3 text-center text-champagne">{message}</p>}
                    <div className="no-account mt-5 sm:mt-6 md:mt-7">
                        <p className="text-center font-bold text-xs sm:text-sm md:text-base text-[#454545] tracking-tighter">Don't have an account? <Link to="/register" className='text-champagne'>Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginInput