import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/apiClient.js';
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('cesfam:user');
            if (raw) setUser(JSON.parse(raw));
        } catch { }
        setLoading(false);
    }, []);

    async function login(email, password) {
        console.log({ email, password });
        const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
        if (!res?.ok) throw new Error('Credenciales inválidas');
        setUser(res.user);
        localStorage.setItem('cesfam:user', JSON.stringify(res.user));
        return res.user;
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('cesfam:user');
    }

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}
