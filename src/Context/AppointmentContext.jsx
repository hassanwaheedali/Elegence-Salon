import { useState, createContext, useContext, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"

const AppointmentContext = createContext()

export function AppointmentProvider({ children }) {
    const [appointments, setAppointments] = useState([])

    const { currentUser } = useAuth()

    useEffect(() => {
        const fetchAppointments = async () => {
            const storedAppointments = await localStorage.getItem("Appointments");
            if (storedAppointments) {
                setAppointments(JSON.parse(storedAppointments));
            }
        };
        fetchAppointments();
    }, []);

    const bookAppointment = async (appointmentData) => {
        try {
            const newAppointment = {
                id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
                name: appointmentData.name,
                email: appointmentData.email,
                phone: appointmentData.phoneNumber,
                service: appointmentData.service,
                date: appointmentData.date,
                time: appointmentData.time,
                message: appointmentData.message,
                status: "Awaiting Confirmation",
                userId: currentUser.id
            }
            const addAppointment = [...appointments, newAppointment]
            setAppointments(addAppointment)
            await localStorage.setItem("Appointments", JSON.stringify(addAppointment))
            return {success: true}
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    // this functions is for displaying appointments by user if the user is logged in otherwise this function will return user not found or success false
    const displayAppointmentsByUser = async () => {
        try {
            for (const appointment of appointments) {
                if (appointment.userId === currentUser.id) {
                    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
                    return { success: true, data: userAppointments };
                }
            }
            return { success: false, error: "Appointments not Found" }
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const value = {
        appointments,
        bookAppointment,
        displayAppointmentsByUser
    }

    return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointment() {
    return useContext(AppointmentContext);
}
