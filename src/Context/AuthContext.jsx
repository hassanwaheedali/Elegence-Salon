import { createContext, useContext, useEffect, useState } from "react";
import { useMessage } from "./MessageContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { showMessage } = useMessage();

    useEffect(() => {
        const storedCurrentUser = localStorage.getItem('currentUser');
        const storedAllUsers = localStorage.getItem('allUsers');
        if (storedAllUsers) {
            setAllUsers(JSON.parse(storedAllUsers));
        }
        if (storedCurrentUser) {
            setCurrentUser(JSON.parse(storedCurrentUser));
            setIsAuthenticated(true);
        } else {
            const sessionUser = sessionStorage.getItem('currentUser');
            if (sessionUser) {
                setCurrentUser(JSON.parse(sessionUser));
                setIsAuthenticated(true);
            }
        }
        const adminTestUser = {
            id: 0,
            name: 'Admin User',
            phone: '',
            email: 'admin@admin.com',
            password: 'admin',
            role: 'admin',
        }
        if (!storedAllUsers) {
            setAllUsers([adminTestUser]);
            localStorage.setItem('allUsers', JSON.stringify([adminTestUser]));
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const newId = allUsers && allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id || 0)) + 1 : 1;
            const newUser = {
                id: newId,
                name: userData.fullname,
                phone: userData.phone,
                email: userData.email.toLowerCase().trim(),
                password: userData.password,
                role: userData.role || 'client',
            };

            for (const u of allUsers) {
                if (u.email && u.email.toLowerCase() === newUser.email) {
                    throw new Error('User already exists with this email');
                }
                if (u.phone === newUser.phone) {
                    throw new Error('User already exists with this phone number');
                }
            }
            const updatedUsers = [...allUsers, newUser];
            setAllUsers(updatedUsers);
            localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
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
        // show success message on logout
        if (typeof showMessage === 'function') {
            showMessage('success', 'Logged out successfully');
        }
    }

    const updatedUser = async (user) => {
        try {
            const updatedUsers = allUsers.map((users) => {
                if (users.id === user.id) {
                    return user;
                }
                return users;
            })
            setAllUsers(updatedUsers);
            setCurrentUser(user);
            localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
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