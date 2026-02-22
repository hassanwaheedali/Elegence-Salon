/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useMessage } from "./MessageContext";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "allUsers";
const STAFF_STORAGE_KEY = "EleganceStaff"; // stylists stored separately in localStorage

export function AuthProvider({ children }) {
    const [allUsers, setAllUsers] = useState([]); // runtime = persisted users + staff (in-memory)
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { showMessage } = useMessage();

    useEffect(() => {
        // load persisted users and staff from localStorage (synchronous)
        const persistedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        const persistedStaffRaw = localStorage.getItem(STAFF_STORAGE_KEY);

        let persistedUsers = [];
        let persistedStaff = [];

        try { persistedUsers = persistedUsersRaw ? JSON.parse(persistedUsersRaw) : []; } catch { persistedUsers = []; }
        try { persistedStaff = persistedStaffRaw ? JSON.parse(persistedStaffRaw) : []; } catch { persistedStaff = []; }

        // ensure keys exist
        if (!persistedUsersRaw) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        if (!persistedStaffRaw) localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify([]));

        // ensure admin exists in persisted users
        const adminTestUser = {
            id: 0,
            name: 'Admin User',
            phone: '',
            email: 'admin@admin.com',
            password: 'admin',
            role: 'admin',
        };
        if (!persistedUsers.some(u => u.email === adminTestUser.email)) {
            persistedUsers = [adminTestUser, ...persistedUsers];
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(persistedUsers));
        }

        // merge for runtime only — DO NOT write staff into the allUsers localStorage key
        setAllUsers([...persistedUsers, ...persistedStaff]);

        const storedCurrent = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (storedCurrent) {
            setCurrentUser(JSON.parse(storedCurrent));
            setIsAuthenticated(true);
        }

        // listen for staff changes so runtime allUsers stays in sync
        const refreshUsersFromStorage = () => {
            const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
            const staff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) || '[]');
            setAllUsers([...users, ...staff]);
        };
        const handleStaffUpdated = (e) => {
            refreshUsersFromStorage();
            const updatedStaff = e.detail;

            // Check if the updated staff is the current user. Since currentUser from state
            // could be stale in this closure, we check localStorage/sessionStorage as well 
            // or just use latest if we add it to deps. But simpler:
            const storedCurrentStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (storedCurrentStr) {
                const storedCurrent = JSON.parse(storedCurrentStr);
                if (storedCurrent.accountRole === 'staff' && storedCurrent.id === updatedStaff.id) {
                    setCurrentUser(updatedStaff);
                    if (localStorage.getItem('currentUser')) {
                        localStorage.setItem('currentUser', JSON.stringify(updatedStaff));
                    } else {
                        sessionStorage.setItem('currentUser', JSON.stringify(updatedStaff));
                    }
                }
            }
        };

        window.addEventListener('staff-added', refreshUsersFromStorage);
        window.addEventListener('staff-updated', handleStaffUpdated);
        window.addEventListener('staff-removed', refreshUsersFromStorage);

        setLoading(false);

        return () => {
            window.removeEventListener('staff-added', refreshUsersFromStorage);
            window.removeEventListener('staff-updated', handleStaffUpdated);
            window.removeEventListener('staff-removed', refreshUsersFromStorage);
        };
    }, []);

    const register = async (userData) => {
        try {
            // read only persisted users for storage
            const persistedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
            const persistedStaff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) || '[]');

            const newId = persistedUsers.length > 0 ? Math.max(...persistedUsers.map(u => u.id || 0)) + 1 : 1;
            const newUser = {
                id: newId,
                name: userData.fullname,
                phone: userData.phone,
                email: userData.email.toLowerCase().trim(),
                password: userData.password,
                role: userData.role || 'client',
            };

            // uniqueness check across persisted users + staff (in-memory)
            for (const u of [...persistedUsers, ...persistedStaff]) {
                if (u.email && u.email.toLowerCase() === newUser.email) {
                    throw new Error('User already exists with this email');
                }
                if (u.phone === newUser.phone) {
                    throw new Error('User already exists with this phone number');
                }
            }

            const updatedPersisted = [...persistedUsers, newUser];
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedPersisted));

            // update runtime state (persisted users + staff)
            const merged = [...updatedPersisted, ...persistedStaff];
            setAllUsers(merged);

            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const login = async (userData) => {
        try {
            const email = userData.email.toLowerCase().trim();
            const password = userData.password;
            const rememberMe = userData.rememberMe;

            // allUsers state includes staff (in-memory), so staff logins are supported
            for (const u of allUsers) {
                if (u.email === email && u.password === password) {
                    setCurrentUser(u);
                    setIsAuthenticated(true);
                    if (rememberMe) {
                        localStorage.setItem('currentUser', JSON.stringify(u));
                        sessionStorage.removeItem('currentUser');
                    } else {
                        sessionStorage.setItem('currentUser', JSON.stringify(u));
                        localStorage.removeItem('currentUser');
                    }
                    if (typeof showMessage === 'function') {
                        showMessage('success', 'Logged in successfully');
                    }
                    return { success: true };
                }
            }
            throw new Error('Invalid email or password');
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const logout = async () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        if (typeof showMessage === 'function') {
            showMessage('success', 'Logged out successfully');
        }
    }

    const updatedUser = async (user) => {
        try {
            // NOTE: AuthContext.updatedUser is intended for persisted **clients only**.
            // Staff accounts are managed and persisted inside `StaffContext`.
            if (user?.accountRole === 'staff') {
                return { success: false, error: 'Use Staff management Context to update staff accounts' };
            }

            // persist changes only to persisted users (do not write staff into allUsers key)
            const persistedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
            const updatedPersisted = persistedUsers.map((u) => (u.id === user.id ? user : u));
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedPersisted));

            // refresh runtime state (persisted users + staff)
            const persistedStaff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) || '[]');
            setAllUsers([...updatedPersisted, ...persistedStaff]);

            setCurrentUser(user);
            const storedLocalCheck = localStorage.getItem('currentUser');
            if (storedLocalCheck) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }

    const value = {
        currentUser,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updatedUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}