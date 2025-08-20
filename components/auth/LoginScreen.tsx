import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: (email: string, password: string) => boolean;
    onNavigate: (view: 'signup' | 'welcome') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = onLogin(email, password);
        if (!success) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Log In</h2>
            
            {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                    <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="you@example.com" />
                </div>
                <div>
                     <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Password</label>
                    <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                    Log In
                </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('signup')} className="font-medium text-sky-500 hover:text-sky-600">
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default LoginScreen;