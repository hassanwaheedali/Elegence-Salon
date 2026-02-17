import { useState, createContext, useContext, useEffect } from "react"

const STORAGE_KEY = "EleganceStaff"

const defaultStaff = [
    {
        id: 1,
        name: "John Doe",
        email: "john@elegancesalon.com",
        phone: "+1234567890",
        role: "Senior Stylist",
        specialties: ["Haircut", "Hair Color", "Beard Trim"],
        rating: 4.8,
        experience: "5 years",
        commission: 0.4,
        schedule: {
            monday: { start: "09:00", end: "17:00" },
            tuesday: { start: "09:00", end: "15:00" },
            wednesday: { start: "09:00", end: "15:00" },
            thursday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
            saturday: { start: "08:00", end: "16:00" },
            sunday: null
        },
        status: "active"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@elegancesalon.com",
        phone: "+1234567891",
        role: "Color Specialist",
        specialties: ["Hair Color", "Highlights", "Balayage"],
        rating: 4.9,
        experience: "7 years",
        commission: 0.45,
        schedule: {
            monday: { start: "10:00", end: "18:00" },
            tuesday: { start: "10:00", end: "18:00" },
            wednesday: { start: "10:00", end: "18:00" },
            thursday: { start: "10:00", end: "18:00" },
            friday: { start: "10:00", end: "18:00" },
            saturday: { start: "09:00", end: "17:00" },
            sunday: null
        },
        status: "active"
    },
    {
        id: 3,
        name: "Mike Ross",
        email: "mike@elegancesalon.com",
        phone: "+1234567892",
        role: "Junior Barber",
        specialties: ["Haircut", "Beard Trim", "Shaving"],
        rating: 4.6,
        experience: "2 years",
        commission: 0.3,
        schedule: {
            monday: { start: "11:00", end: "19:00" },
            tuesday: { start: "11:00", end: "19:00" },
            wednesday: { start: "11:00", end: "19:00" },
            thursday: { start: "11:00", end: "19:00" },
            friday: { start: "11:00", end: "19:00" },
            saturday: { start: "10:00", end: "18:00" },
            sunday: null
        },
        status: "active"
    },
    {
        id: 4,
        name: "Sarah Lee",
        email: "sarah@elegancesalon.com",
        phone: "+1234567893",
        role: "Makeup Artist",
        specialties: ["Facial", "Makeup", "Eyebrow Shaping"],
        rating: 4.7,
        experience: "4 years",
        commission: 0.35,
        schedule: {
            monday: { start: "09:00", end: "14:00" },
            tuesday: { start: "09:00", end: "14:00" },
            wednesday: { start: "09:00", end: "14:00" },
            thursday: { start: "09:00", end: "14:00" },
            friday: { start: "09:00", end: "14:00" },
            saturday: null,
            sunday: null
        },
        status: "active"
    }
]

const StaffContext = createContext()

export function StaffProvider({ children }) {
    const [staff, setStaff] = useState([])

    useEffect(() => {
        const fetchStaff = async () => {
            const storedStaff = await localStorage.getItem(STORAGE_KEY);
            if (storedStaff) {
                setStaff(JSON.parse(storedStaff));
                return;
            }

            setStaff(defaultStaff);
            await localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStaff));
        };

        fetchStaff();
    }, []);

    const addNewStaff = async (newMember) => {
        if (!newMember) {
            return { error: "Invalid staff data provided." };
        }
        if (!newMember.name || !newMember.email || !newMember.phone || !newMember.role || !newMember.specialties) {
            return { error: "Please fill in all required fields." };
        }

        const existingStaff = staff.find(member =>
            member.email.toLowerCase() === newMember.email.toLowerCase() ||
            member.phone === newMember.phone
        );

        if (existingStaff) {
            return { error: "Staff member with this email or phone already exists." };
        }

        const newId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1;
        const staffToAdd = {
            ...newMember,
            id: newId,
            status: "active"
        };

        const updatedStaff = [...staff, staffToAdd];
        setStaff(updatedStaff);
        await localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStaff));

        return { success: "Staff member added successfully.", member: staffToAdd };
    };

    const removeStaff = async (staffId) => {
        const updatedStaff = staff.filter(member => member.id !== staffId);
        setStaff(updatedStaff);
        await localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStaff));
        return { success: "Staff member removed successfully." };
    };

    const updateStaff = async (staffId, updatedData) => {
        const findStaff = staff.find(member => member.id === staffId);
        if (!findStaff) {
            return { error: "Staff member not found." };
        }

        const updatedStaff = staff.map(member =>
            member.id === staffId ? { ...member, ...updatedData } : member
        );
        setStaff(updatedStaff);
        await localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStaff));
        return { success: "Staff member updated successfully." };
    };

    const getStaffBySpecialty = (specialty) => {
        return staff.filter(member =>
            member.specialties.includes(specialty) && member.status === "active"
        );
    };

    const getAvailableStaff = (date, time, service) => {
        const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" }).toLowerCase();

        return staff.filter(member => {
            if (member.status !== "active") {
                return false;
            }

            if (!member.schedule[dayOfWeek]) {
                return false;
            }

            if (!member.specialties.includes(service)) {
                return false;
            }

            const schedule = member.schedule[dayOfWeek];
            const appointmentTime = time;
            const workStart = schedule.start;
            const workEnd = schedule.end;

            const isWithinWorkingHours = appointmentTime >= workStart && appointmentTime <= workEnd;

            return isWithinWorkingHours;
        });
    };

    const getActiveStaff = () => staff.filter(member => member.status === "active");

    const value = {
        staff,
        addNewStaff,
        removeStaff,
        getStaffBySpecialty,
        getAvailableStaff,
        getActiveStaff,
        updateStaff
    };

    return <StaffContext.Provider value={value} > {children}</StaffContext.Provider >;
}

export function useStaff() {
    return useContext(StaffContext);
}
