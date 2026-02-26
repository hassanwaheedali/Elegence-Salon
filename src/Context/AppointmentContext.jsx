/* eslint-disable react-refresh/only-export-components */
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
                const parsed = JSON.parse(storedAppointments);
                setAppointments(parsed);
            }
        };
        fetchAppointments();
    }, []);

    const bookAppointment = async (appointmentData) => {
        try {
            const selectedServices = appointmentData.selectedService // array of { name, price }

            // Check if a stylist is already booked at this exact date+time in existing appointments
            const alreadyBookedAtSlot = (stylistId) =>
                appointments.some(a => {
                    if (a.date !== appointmentData.date || a.time !== appointmentData.time || a.status === 'Cancelled') return false
                    return a.items?.some(item => item.stylist?.id === stylistId)
                })

            // For each service find a free stylist and build assignments
            const assignments = []
            for (const service of selectedServices) {
                const availableStylists = getAvailableStaff(
                    appointmentData.date,
                    appointmentData.time,
                    service.name
                )

                // Filter out: already booked elsewhere 
                const trulyFree = availableStylists.filter(
                    s => !alreadyBookedAtSlot(s.id)
                )

                if (trulyFree.length === 0) {
                    return {
                        success: false,
                        error: `No stylist available for "${service.name}" on the selected date and time. All stylists are already booked at that slot. Please try a different time.`
                    }
                }

                assignments.push({ service, stylist: trulyFree[0] })
            }

            // ONE appointment — items[] pairs each service with its stylist
            const newAppointment = {
                id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
                name: appointmentData.name,
                email: appointmentData.email,
                phone: appointmentData.phoneNumber,
                date: appointmentData.date,
                time: appointmentData.time,
                message: appointmentData.message,
                totalPrice: appointmentData.totalPrice,
                status: "Awaiting Confirmation",
                userId: currentUser ? currentUser.id : null,
                items: assignments.map(({ service, stylist }) => ({
                    service: { name: service.name, price: service.price },
                    stylist: {
                        id: stylist.id,
                        name: stylist.name,
                        email: stylist.email,
                        phone: stylist.phone,
                        commission: stylist.commission
                    }
                }))
            }

            const updatedAppointments = [...appointments, newAppointment]
            setAppointments(updatedAppointments)
            await localStorage.setItem("Appointments", JSON.stringify(updatedAppointments))

            return {
                success: true,
                assignments: assignments.map(a => ({
                    service: a.service.name,
                    stylist: a.stylist.name
                }))
            }
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const displayAppointmentsByUser = async () => {
        try {
            if (!currentUser) return { success: false, error: 'User not authenticated' };
            const userAppointments = appointments.filter(a => a.userId === currentUser.id || a.email === currentUser.email);
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

            // For each item, verify its stylist is still available at the new slot
            // or find a replacement. Track assigned IDs to avoid double-booking.
            const alreadyBookedAtNewSlot = (stylistId) =>
                appointments.some(a => {
                    if (a.id === appointmentId) return false // ignore self
                    if (a.date !== newDate || a.time !== newTime || a.status === 'Cancelled') return false
                    return a.items?.some(item => item.stylist?.id === stylistId)
                })

            const updatedItems = []
            const sessionAssignedIds = []

            for (const item of (appointment.items || [])) {
                const svc = item.service
                const currentStylist = item.stylist
                const available = getAvailableStaff(newDate, newTime, svc.name)

                if (!available || available.length === 0) {
                    return {
                        success: false,
                        error: `No stylists available for "${svc.name}" at the new date and time. Please choose a different time slot.`
                    }
                }

                // Keep current stylist if still free, otherwise pick a new one
                const currentStillFree =
                    currentStylist &&
                    available.find(s => s.id === currentStylist.id) &&
                    !alreadyBookedAtNewSlot(currentStylist.id) &&
                    !sessionAssignedIds.includes(currentStylist.id)

                const chosen = currentStillFree
                    ? available.find(s => s.id === currentStylist.id)
                    : available.find(s => !alreadyBookedAtNewSlot(s.id) && !sessionAssignedIds.includes(s.id))

                if (!chosen) {
                    return {
                        success: false,
                        error: `No available stylist for "${svc.name}" at the new time slot. Please choose a different time.`
                    }
                }

                sessionAssignedIds.push(chosen.id)
                updatedItems.push({
                    service: { name: svc.name, price: svc.price },
                    stylist: {
                        id: chosen.id,
                        name: chosen.name,
                        email: chosen.email,
                        phone: chosen.phone,
                        commission: chosen.commission
                    }
                })
            }

            const updatedAppointment = {
                ...appointment,
                date: newDate,
                time: newTime,
                status: "Awaiting Confirmation",
                items: updatedItems
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
            // Update the stylist on the matching item
            const updatedItems = (appointment.items || []).map(item =>
                item.service.name === appointmentService
                    ? { ...item, stylist: { id: newStylist.id, name: newStylist.name, email: newStylist.email, phone: newStylist.phone, commission: newStylist.commission } }
                    : item
            )
            if (!appointment.items?.some(item => item.service.name === appointmentService)) {
                return { success: false, error: `Service "${appointmentService}" not found in this appointment.` }
            }
            const updatedAppointment = { ...appointment, items: updatedItems };
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

    // edit appointment details for admin (includes stylist availability check)
    const updateAppointment = async (appointmentId, updatedData) => {
        try {
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) {
                return { success: false, error: 'Appointment not found' };
            }

            const updatedAppointment = { ...appointment, ...updatedData };

            // If date or time changed, verify every item's stylist is still available
            const dateChanged = updatedData.date && updatedData.date !== appointment.date
            const timeChanged = updatedData.time && updatedData.time !== appointment.time
            if ((dateChanged || timeChanged) && updatedAppointment.items) {
                const checkDate = updatedAppointment.date
                const checkTime = updatedAppointment.time
                for (const item of updatedAppointment.items) {
                    const available = getAvailableStaff(checkDate, checkTime, item.service.name)
                    const stylistStillAvailable = available.some(
                        s => s.id === item.stylist.id || s.email.toLowerCase() === item.stylist.email?.toLowerCase()
                    )
                    if (!stylistStillAvailable) {
                        return {
                            success: false,
                            error: `Stylist for "${item.service.name}" is not available at the new date/time. Please reassign before changing the slot.`
                        }
                    }
                }
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

    const getAppointmentsForStaff = (staffId) => {
        const currentStaff = staff.find(s => s.id === Number(staffId));
        return appointments.filter(a =>
            a.items?.some(item =>
                item.stylist?.id === Number(staffId) ||
                (currentStaff && item.stylist?.email?.toLowerCase() === currentStaff.email.toLowerCase())
            )
        )
    };

    const value = {
        appointments,
        bookAppointment,
        displayAppointmentsByUser,
        getAppointmentsForStaff,
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
