import Header from '../Components/Header.jsx'
import accountBarber from '../assets/accountbarber.webp'
import RegisterInput from '../Components/RegisterInput.jsx'

function Register() {
    return (
        <div className="inset-0 overflow-hidden fixed">
            <Header bgImage="bg-[#0F0F0F] relative" />
            <div className="relative h-screen bg-[#0F0F0F] overflow-hidden pb-14 lg:pt-14 lg:pb-21">
                {/* Orange gradient triangle background using clip-path */}
                <div
                    className="fixed left-0 top-0 w-screen h-screen pointer-events-none z-0 hidden md:block"
                    style={{
                        background: 'linear-gradient(117deg, var(--color-champagne) 1.24%, var(--color-champagne-light) 44.24%, var(--color-champagne-dark) 100.64%)',
                        clipPath: 'polygon(0 12%, 100% 100%, 0 100%)'
                    }}
                />
                <div className="register-page relative z-10 h-full flex flex-col md:flex-row justify-center lg:justify-start items-center lg:items-end px-1 sm:px-6 md:px-8 lg:px-16 py-8 md:py-0 gap-2 lg:gap-0">
                    <div className="w-1/2 hidden lg:flex self-end">
                        <img src={accountBarber} alt="Account Barber" className='w-full h-auto max-w-lg xl:max-w-xxl mx-auto block transition-transform duration-500 ease-in-out hover:scale-105' />
                    </div>
                    <div className="register-form-container w-full sm:w-auto sm:min-w-100 lg:w-1/2 lg:max-w-2xl self-center mb-8 md:mb-16">
                        <RegisterInput />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
