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
                setAppointments(JSON.parse(storedAppointments));
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
                    return a.stylists?.some(s => s.id === stylistId)
                })

            // For each service find a free stylist and build assignments
            const assignments = []
            for (const service of selectedServices) {
                const availableStylists = getAvailableStaff(
                    appointmentData.date,
                    appointmentData.time,
                    service.name
                )

                // // IDs already assigned in THIS booking session
                // const sessionAssignedIds = assignments.map(a => a.stylist.id)

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

            // ONE appointment — services[] and stylists[] are separate, paired by index
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
                services: assignments.map(({ service }) => ({
                    name: service.name,
                    price: service.price
                })),
                stylists: assignments.map(({ stylist }) => ({
                    id: stylist.id,
                    name: stylist.name,
                    email: stylist.email,
                    phone: stylist.phone,
                    commission: stylist.commission
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

            // For each service, verify its stylist is still available at the new slot
            // or find a replacement. Track assigned IDs to avoid double-booking.
            const alreadyBookedAtNewSlot = (stylistId) =>
                appointments.some(a => {
                    if (a.id === appointmentId) return false // ignore self
                    if (a.date !== newDate || a.time !== newTime || a.status === 'Cancelled') return false
                    return a.stylists?.some(s => s.id === stylistId)
                })

            const updatedServices = []
            const updatedStylists = []
            const sessionAssignedIds = []

            for (let i = 0; i < appointment.services.length; i++) {
                const svc = appointment.services[i]
                const currentStylist = appointment.stylists[i]
                const available = getAvailableStaff(newDate, newTime, svc.name)

                if (!available || available.length === 0) {
                    return {
                        success: false,
                        error: `No stylists available for "${svc.name}" at the new date and time. Please choose a different time slot.`
                    }
                }

                // Keep current stylist if still free, otherwise pick a new one
                const currentStillFree =
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
                updatedServices.push({ name: svc.name, price: svc.price })
                updatedStylists.push({
                    id: chosen.id,
                    name: chosen.name,
                    email: chosen.email,
                    phone: chosen.phone,
                    commission: chosen.commission
                })
            }

            const updatedAppointment = {
                ...appointment,
                date: newDate,
                time: newTime,
                status: "Awaiting Confirmation",
                services: updatedServices,
                stylists: updatedStylists
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
            // Update the stylist at the same index as the matching service
            const serviceIndex = appointment.services.findIndex(svc => svc.name === appointmentService)
            if (serviceIndex === -1) {
                return { success: false, error: `Service "${appointmentService}" not found in this appointment.` }
            }
            const updatedStylists = appointment.stylists.map((s, i) =>
                i === serviceIndex
                    ? { id: newStylist.id, name: newStylist.name, email: newStylist.email, phone: newStylist.phone, commission: newStylist.commission }
                    : s
            )
            const updatedAppointment = { ...appointment, stylists: updatedStylists };
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

            // If date or time changed, verify every service's stylist is still available
            const dateChanged = updatedData.date && updatedData.date !== appointment.date
            const timeChanged = updatedData.time && updatedData.time !== appointment.time
            if ((dateChanged || timeChanged) && updatedAppointment.services) {
                const checkDate = updatedAppointment.date
                const checkTime = updatedAppointment.time
                for (let i = 0; i < updatedAppointment.services.length; i++) {
                    const svc = updatedAppointment.services[i]
                    const sty = updatedAppointment.stylists[i]
                    const available = getAvailableStaff(checkDate, checkTime, svc.name)
                    const stylistStillAvailable = available.some(
                        s => s.id === sty.id || s.email.toLowerCase() === sty.email?.toLowerCase()
                    )
                    if (!stylistStillAvailable) {
                        return {
                            success: false,
                            error: `Stylist for "${svc.name}" is not available at the new date/time. Please reassign before changing the slot.`
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
            a.stylists?.some(s =>
                s.id === Number(staffId) ||
                (currentStaff && s.email?.toLowerCase() === currentStaff.email.toLowerCase())
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
