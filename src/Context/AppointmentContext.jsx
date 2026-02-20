import { useState, createContext, useContext, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"
import { useStaff } from "../Context/StaffContext"

const AppointmentContext = createContext()

export function AppointmentProvider({ children }) {
    const [appointments, setAppointments] = useState([])

    const { currentUser } = useAuth()
    const { getAvailableStaff, staff } = useStaff()

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
                status: "Awaiting Confirmation",
                userId: currentUser ? currentUser.id : null,
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

    // for cancel appointment both for user and admin
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

    // for reschedule appointment both for user and admin
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
            if (!availableStylists || availableStylists.length === 0) {
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

    // specific stylist panel functions
    const changeStatus = async (appointmentId, newStatus) => {
        try {
            const updatedAppointments = appointments.map(a =>
                a.id === appointmentId ? { ...a, status: newStatus } : a
            );
            setAppointments(updatedAppointments);
            await localStorage.setItem("Appointments", JSON.stringify(updatedAppointments));
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }


    const changeStylist = async (appointmentId, appointmentDate, appointmentTime, appointmentService, newStylistId) => {
        try {
            const newStylist = staff.find(s => s.id === newStylistId);
            if (!newStylist) {
                return { success: false, error: 'Stylist not found' };
            }
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) {
                return { success: false, error: 'Appointment not found' };
            }
            const checkStylistAvailable = getAvailableStaff(appointmentDate, appointmentTime, appointmentService).some(s => s.id === newStylistId);
            if (!checkStylistAvailable) {
                return {
                    success: false,
                    error: 'Selected stylist is not available for the chosen date, time, and service. Please select a different stylist or time slot.'
                };
            }
            const updatedAppointment = {
                ...appointment,
                stylistId: newStylist.id,
                stylistName: newStylist.name,
                stylistEmail: newStylist.email,
                stylistPhone: newStylist.phone,
                commission: newStylist.commission
            };
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

    // edit appointment details for admin
    const updateAppointment = async (appointmentId, updatedData) => {
        try {
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) {
                return { success: false, error: 'Appointment not found' };
            }
            const updatedAppointment = { ...appointment, ...updatedData };
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

    const deleteAppointment = async (appointmentId) => {
        try {
            const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
            if (updatedAppointments.length === appointments.length) {
                return { success: false, error: 'Appointment not found' };
            }
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
        rescheduleAppointment,
        changeStatus,
        changeStylist,
        updateAppointment,
        deleteAppointment
    }

    return <AppointmentContext.Provider value={value} > {children}</AppointmentContext.Provider >;
}

export function useAppointment() {
    return useContext(AppointmentContext);
}
