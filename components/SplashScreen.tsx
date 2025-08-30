import React from 'react';
import { ALineStudiosLogo } from './icons';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900 animate-fadeIn">
            <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-400">
                <ALineStudiosLogo className="w-20 h-20" />
                <p className="font-semibold text-lg">Made by A-Line Studio</p>
            </div>
        </div>
    );
};

export default SplashScreen;