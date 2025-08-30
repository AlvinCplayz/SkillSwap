import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 max-w-xs lg:max-w-md p-3 rounded-2xl bg-white dark:bg-slate-700 rounded-bl-none">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

export default TypingIndicator;
