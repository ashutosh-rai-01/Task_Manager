import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { getZoderror } from '../helper/getZoderror';
import { RouteLogin } from '../helper/RouterName';

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [formdata, setFormdata] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInput = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
        setApiError('');
        setApiSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiError('');
        setApiSuccess('');
        setIsSubmitting(true);

        try {
            // Validate input with Zod
            const validated = registerSchema.parse(formdata);
            const result = await register(validated.name, validated.email, validated.password);
            
            if (result.success) {
                setApiSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate(RouteLogin);
                }, 2000);
            } else {
                setApiError(result.message);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const mappedErrors = getZoderror(err.issues);
                setErrors(mappedErrors);
            } else {
                setApiError('An unexpected server error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-blue-100 shadow-md mb-4 transition-transform hover:scale-105 duration-300">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight bg-clip-text bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-800">
                        Join Us
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Create an account to start organizing tasks
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-white border border-blue-100/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300/10 rounded-full blur-3xl"></div>

                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <span>{apiError}</span>
                            </div>
                        )}

                        {apiSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{apiSuccess}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formdata.name}
                                onChange={handleInput}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="text-red-600 text-xs mt-1 font-medium">* {errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formdata.email}
                                onChange={handleInput}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="name@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-xs mt-1 font-medium">* {errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formdata.password}
                                onChange={handleInput}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Min 6 characters"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-1 font-medium">* {errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formdata.confirmPassword}
                                onChange={handleInput}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-xs mt-1 font-medium">* {errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-100 active:scale-98 transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center disabled:opacity-50 cursor-pointer mt-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-5 text-center relative z-10 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to={RouteLogin} className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
