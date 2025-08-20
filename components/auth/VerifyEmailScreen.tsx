
import React, { useState } from 'react';

interface VerifyEmailScreenProps {
    email: string | null;
    verificationToken: string | null; // For demo purposes
    onVerify: (email: string, token: string) => boolean;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ email, verificationToken, onVerify }) => {
    const [token, setToken] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!email) {
        return (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Something went wrong</h2>
                <p className="text-slate-500 dark:text-slate-400">We couldn't find an email to verify. Please try signing up or logging in again.</p>
            </div>
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email) return;

        const success = onVerify(email, token);
        if (!success) {
            setError('Invalid verification code. Please check and try again.');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Verify Your Email</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
                We've sent a verification code to <span className="font-semibold text-sky-500">{email}</span>. Please enter it below.
            </p>
            
            {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 text-sm text-left" role="alert">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="token" className="sr-only">Verification Code</label>
                    <input 
                        type="text" 
                        id="token" 
                        required 
                        value={token} 
                        onChange={e => setToken(e.target.value)} 
                        className="w-full text-center tracking-[0.5em] font-mono text-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="••••••"
                        autoComplete="off"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                    Verify Account
                </button>
            </form>
            
            {verificationToken && (
                <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>For Demo Purposes:</strong> Your verification code is:
                        <br />
                        <span className="font-mono text-sky-500 mt-1 block select-all">{verificationToken}</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default VerifyEmailScreen;
