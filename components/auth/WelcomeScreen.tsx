import React from 'react';

interface WelcomeScreenProps {
    onNavigate: (view: 'login' | 'signup') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome to SkillSwap</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">The best place to learn and teach skills without spending a dime.</p>
            <div className="space-y-4">
                 <button 
                    onClick={() => onNavigate('signup')}
                    className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                    Get Started
                </button>
                <button 
                    onClick={() => onNavigate('login')}
                    className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}

export default WelcomeScreen;
