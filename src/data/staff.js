// Staff/Stylist data for Elegance Salon
export const staff = [
    {
        id: 1,
        name: "John Doe",
        email: "john@elegancesalon.com",
        phone: "+1234567890",
        role: "Senior Stylist",
        specialties: ["Haircut", "Hair Color", "Beard Trim"],
        rating: 4.8,
        experience: "5 years",
        commission: 0.4, // 40%
        schedule: {
            monday: { start: "09:00", end: "17:00" },
            tuesday: { start: "09:00", end: "15:00" },
            wednesday: { start: "09:00", end: "15:00" },
            thursday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
            saturday: { start: "08:00", end: "16:00" },
            sunday: null // Closed
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
        commission: 0.45, // 45%
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
        commission: 0.3, // 30%
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
        commission: 0.35, // 35%
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
];

// Simpler version for beginners - easier to understand step by step
export const getAvailableStaffSimple = (date, time, service) => {
    // Convert date to day name (monday, tuesday, etc.)
    const dateObj = new Date(date);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[dateObj.getDay()];

    // Start with empty list of available staff
    const availableStaff = [];

    // Check each staff member one by one
    for (const member of staff) {
        // Skip if not active
        if (member.status !== "active") {
            continue; // Skip to next staff member
        }

        // Skip if they don't work this day
        if (!member.schedule[dayOfWeek]) {
            continue;
        }

        // Skip if they don't have the right specialty
        if (!member.specialties.includes(service)) {
            continue;
        }

        // Check if they're available at the requested time
        const schedule = member.schedule[dayOfWeek];
        const requestedTime = time;
        const startTime = schedule.start;
        const endTime = schedule.end;

        // If time is within their working hours, they're available!
        if (requestedTime >= startTime && requestedTime <= endTime) {
            availableStaff.push(member);
        }
    }

    return availableStaff;
};

export const getStaffBySpecialty = (specialty) => {
    return staff.filter(member =>
        member.specialties.includes(specialty) && member.status === "active"
    );
};

export const getAvailableStaff = (date, time, service) => {
    // Step 1: Get the day of the week from the date (e.g., "monday", "tuesday")
    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

    // Step 2: Filter through all staff members and return only those who meet ALL conditions
    return staff.filter(member => {
        // Condition 1: Staff member must be currently working (active status)
        if (member.status !== "active") {
            return false; // Not available if not active
        }

        // Condition 2: Staff member must work on the requested day
        if (!member.schedule[dayOfWeek]) {
            return false; // Not available if they don't work this day
        }

        // Condition 3: Staff member must have the required specialty for the service
        if (!member.specialties.includes(service)) {
            return false; // Not available if they don't have the right skills
        }

        // Condition 4: Staff member must be available at the requested time
        const schedule = member.schedule[dayOfWeek];
        const appointmentTime = time;
        const workStart = schedule.start; // When they start work (e.g., "09:00")
        const workEnd = schedule.end;     // When they finish work (e.g., "17:00")

        // Check if appointment time is within their working hours
        const isWithinWorkingHours = appointmentTime >= workStart && appointmentTime <= workEnd;

        return isWithinWorkingHours; // Only available if time fits their schedule
    });
};

export const getActiveStaff = () => {
    return staff.filter(member => member.status === "active");
};