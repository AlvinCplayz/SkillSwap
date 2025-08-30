import React from 'react';
import { CompassIcon, UserCircleIcon } from './icons';

interface BottomNavBarProps {
    activeTab: 'discover' | 'profile';
    onTabChange: (tab: 'discover' | 'profile') => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-sky-500' : 'text-slate-500 dark:text-slate-400 hover:text-sky-500'}`}>
        {icon}
        <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex justify-around items-center bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] flex-shrink-0">
            <NavItem 
                icon={<CompassIcon className="w-7 h-7 mb-0.5" />}
                label="Discover"
                isActive={activeTab === 'discover'}
                onClick={() => onTabChange('discover')}
            />
            <NavItem 
                icon={<UserCircleIcon className="w-7 h-7 mb-0.5" />}
                label="Profile"
                isActive={activeTab === 'profile'}
                onClick={() => onTabChange('profile')}
            />
        </div>
    );
};

export default BottomNavBar;