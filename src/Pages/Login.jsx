import Header from '../Components/Header.jsx'
import accountBarber from '../assets/accountbarber.png'
import LoginInput from '../Components/LoginInput.jsx'

function Login() {
    return (
        <div className="inset-0 overflow-hidden fixed">
            <Header bgImage="bg-[#0F0F0F] relative" />
            <div className="relative h-screen bg-[#0F0F0F] overflow-hidden pt-14 lg:pt-14 pb-21">
                {/* Orange gradient triangle background using clip-path */}
                <div
                    className="fixed left-0 top-0 w-screen h-screen pointer-events-none z-0"
                    style={{
                        background: 'linear-gradient(117deg, #FF8A00 1.24%, #E67C00 44.24%, #C56A00 100.64%)',
                        clipPath: 'polygon(0 12%, 100% 100%, 0 100%)'
                    }}
                />
                <div className="login-page relative z-10 h-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-end px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-0 gap-2 lg:gap-0">
                    <div className="w-1/2 hidden md:flex self-end">
                        <img src={accountBarber} alt="Account Barber" className='w-full h-auto max-w-lg xl:max-w-xl mx-auto block transition-transform duration-500 ease-in-out hover:scale-105' />
                    </div>
                    <div className="login-form-container w-full sm:w-auto sm:min-w-100 md:w-1/2 md:max-w-lg self-center mb-8 md:mb-16">
                        <LoginInput />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
