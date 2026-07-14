import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load stored user and token on initialization
        const storedToken = localStorage.getItem('tm_token');
        const storedUser = localStorage.getItem('tm_user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                localStorage.setItem('tm_token', data.token);
                localStorage.setItem('tm_user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: 'Server error during login' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, message: 'Server error during registration' };
        }
    };

    const logout = () => {
        localStorage.removeItem('tm_token');
        localStorage.removeItem('tm_user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
