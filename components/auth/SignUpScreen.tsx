import React, { useState } from 'react';

interface SignUpScreenProps {
    onSignUp: (email: string, password: string) => boolean;
    onNavigate: (view: 'login' | 'welcome') => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        const success = onSignUp(email, password);
        if (!success) {
            setError('An account with this email already exists.');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Create Account</h2>
            
            {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email-signup" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                    <input type="email" id="email-signup" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="you@example.com" />
                </div>
                <div>
                     <label htmlFor="password-signup" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Password</label>
                    <input type="password" id="password-signup" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="8+ characters" />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                    Create Account
                </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="font-medium text-sky-500 hover:text-sky-600">
                    Log in
                </button>
            </p>
        </div>
    );
};

export default SignUpScreen;