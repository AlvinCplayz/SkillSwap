import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900 px-4 py-12">
      <div className="text-center mb-8 animate-fadeIn">
        <div className="flex items-center justify-center space-x-3">
          <svg className="h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.98 12.54M12 15.75l3.023-3.023m0 0l2.985-2.985m-5.007 6.011l-2.985-2.985m0 0l-2.985 2.985m5.007-6.011L12 9.75" />
          </svg>
          <h1 className="text-4xl font-bold text-sky-500">SkillSwap</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Trade Skills, Not Money</p>
      </div>
      <div className="w-full max-w-sm animate-scaleIn">
        {children}
      </div>
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 absolute bottom-4">
          Made by A-Line Studio
      </footer>
    </div>
  );
};
export default AuthLayout;