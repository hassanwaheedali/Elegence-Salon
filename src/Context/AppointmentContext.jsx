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

    const displayAppointmentsByUser = async () => {
        try {
            if (!currentUser) return { success: false, error: 'User not authenticated' };
            const userAppointments = appointments.filter(a => a.userId === currentUser.id);
            return userAppointments.length ? { success: true, data: userAppointments } : { success: false, error: 'Appointments not Found' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
            setAppointments(updatedAppointments);
            await localStorage.setItem("Appointments", JSON.stringify(updatedAppointments));
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
        try {
            const updatedAppointments = appointments.map(a => {
                if (a.id === appointmentId) {
                    return { ...a, date: newDate, time: newTime, status: "Awaiting Confirmation" }
                }
                return a
            })
            setAppointments(updatedAppointments);
            await localStorage.setItem("Appointments", JSON.stringify(updatedAppointments));
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const value = {
        appointments,
        bookAppointment,
        displayAppointmentsByUser,
        cancelAppointment,
        rescheduleAppointment
    }

    return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointment() {
    return useContext(AppointmentContext);
}
