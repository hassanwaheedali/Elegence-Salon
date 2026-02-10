import { useState, createContext, useContext, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"
import { getAvailableStaff } from "../data/staff"

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
            // Get available stylists for the requested service, date, and time
            const availableStylists = getAvailableStaff(
                appointmentData.date,
                appointmentData.time,
                appointmentData.service
            );

            // Assign the first available stylist (you can implement more sophisticated logic later)
            const assignedStylist = availableStylists.length > 0 ? availableStylists[0] : null;

            if (!assignedStylist) {
                return {
                    success: false,
                    error: 'No stylists available for the selected service, date, and time. Please try a different time slot.'
                };
            }

            const newAppointment = {
                id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
                name: appointmentData.name,
                email: appointmentData.email,
                phone: appointmentData.phoneNumber,
                service: appointmentData.service,
                date: appointmentData.date,
                time: appointmentData.time,
                message: appointmentData.message,
                price: appointmentData.servicePrice,
                status: "Confirmed",
                userId: currentUser.id,
                stylistId: assignedStylist.id,
                stylistName: assignedStylist.name,
                stylistEmail: assignedStylist.email,
                stylistPhone: assignedStylist.phone,
                commission: assignedStylist.commission
            }

            const addAppointment = [...appointments, newAppointment]
            setAppointments(addAppointment)
            await localStorage.setItem("Appointments", JSON.stringify(addAppointment))
            return {
                success: true,
                stylist: assignedStylist.name,
                message: `Appointment confirmed with ${assignedStylist.name}`
            }
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
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) {
                return { success: false, error: 'Appointment not found' };
            }

            // Check if new stylist is needed for the new date/time
            const availableStylists = getAvailableStaff(newDate, newTime, appointment.service);
            const currentStylistAvailable = availableStylists.some(s => s.id === appointment.stylistId);

            // If no stylists are available at all, prevent rescheduling
            if (availableStylists.length === 0) {
                return {
                    success: false,
                    error: 'No stylists available for the selected service, date, and time. Please choose a different time slot.'
                };
            }

            let updatedAppointment = {
                ...appointment,
                date: newDate,
                time: newTime,
                status: "Awaiting Confirmation"
            };

            // If current stylist is not available, assign a new one
            if (!currentStylistAvailable) {
                const newStylist = availableStylists[0];
                updatedAppointment = {
                    ...updatedAppointment,
                    stylistId: newStylist.id,
                    stylistName: newStylist.name,
                    stylistEmail: newStylist.email,
                    stylistPhone: newStylist.phone,
                    commission: newStylist.commission
                };
            }

            const updatedAppointments = appointments.map(a =>
                a.id === appointmentId ? updatedAppointment : a
            );

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
