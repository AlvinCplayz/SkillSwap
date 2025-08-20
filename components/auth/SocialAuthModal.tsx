import React from 'react';

const Spinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
);

const SocialAuthModal: React.FC<{ provider: string | null }> = ({ provider }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 text-center flex flex-col items-center gap-6">
                <Spinner />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Connecting to {provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : ''}...
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Please wait while we securely connect to your account. You may be redirected.
                </p>
            </div>
        </div>
    );
};

export default SocialAuthModal;
