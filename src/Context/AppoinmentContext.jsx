import { createContext, useState, useContext, useEffect } from "react";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
        if (storedAppointments) {
            setAppointments(storedAppointments);
        }
    }, []);

    const bookAppointment = (appointment) => {
        try {
            if (!appointment) return;
            const newAppointment = { ...appointment, id: appointments.length + 1 };
            setAppointments([...appointments, newAppointment]);
            localStorage.setItem("appointments", JSON.stringify([...appointments, newAppointment]));
            return { success: true };
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    const displayUserAppoinments = (email) => {
        for (const appt of appointments) {
            if (appt.email === email) {
                return appt;
            }
        }
        return null;
    }

    const cancelAppointment = (appointmentId) => {
        const updatedAppointments = appointments.filter(appt => appt.id !== appointmentId);
        setAppointments(updatedAppointments);
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    };

    return (
        <AppointmentContext.Provider value={{ appointments, bookAppointment, displayUserAppoinments, cancelAppointment }}>
            {children}
        </AppointmentContext.Provider>
    );
}

export function useAppointment() {
    return useContext(AppointmentContext);
}