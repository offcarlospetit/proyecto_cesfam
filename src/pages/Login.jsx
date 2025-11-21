// src/pages/Login.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState('admin@cesfam.cl');
    const [password, setPassword] = useState('1234');
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        setErr('');
        setSubmitting(true);
        try {
            await login(email.trim(), password);
            navigate(redirectTo, { replace: true });
        } catch (e2) {
            setErr(e2.message || 'Error de autenticación');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-2">Iniciar Sesión</h2>
            <p className="text-sm text-slate-600 mb-4">Ingrese sus credenciales para acceder al sistema.</p>

            <form className="card space-y-3" onSubmit={onSubmit} noValidate>
                <div>
                    <label className="block text-sm mb-1">Usuario (email)</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        autoComplete="username"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button className="btn w-full" disabled={submitting}>
                    {submitting ? 'Ingresando…' : 'Ingresar'}
                </button>
                <div className="text-danger text-sm min-h-5">{err}</div>
            </form>
        </section>
    );
}
