import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, BellIcon, Cog6ToothIcon, ChatBubbleIcon, CloseIcon, EnvelopeIcon } from './icons';
import { User, Notification } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
  onLogout: () => void;
  onNavigateToSettings: () => void;
  onNavigateToChat: () => void;
  onNavigateHome: () => void;
  notifications: Notification[];
  onDismissNotification: (id: number) => void;
  onClearAllNotifications: () => void;
  unreadMessageCount: number;
}

const NotificationItem: React.FC<{ notification: Notification, onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    const icon = {
        connection: <ChatBubbleIcon className="w-6 h-6 text-sky-500" />,
        review: <ChatBubbleIcon className="w-6 h-6 text-sky-500" />,
    }[notification.type];

    return (
        <div className="flex items-start gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg">
            <div className="w-10 h-10 relative">
                <img src={notification.userImage || `https://ui-avatars.com/api/?name=${notification.text.split(' ')[3]}&background=4DA8DA&color=fff`} alt="User" className="w-10 h-10 rounded-full" />
                <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full">{icon}</span>
            </div>
            <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{notification.text}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notification.timestamp}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Dismiss notification">
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ 
    isDarkMode, 
    toggleDarkMode, 
    user, 
    onLogout, 
    onNavigateToSettings,
    onNavigateToChat,
    onNavigateHome,
    notifications,
    onDismissNotification,
    onClearAllNotifications,
    unreadMessageCount,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 flex-shrink-0">
      <div className="container mx-auto px-2 py-3 flex justify-between items-center gap-4">
        <button onClick={onNavigateHome} className="flex items-center space-x-2 flex-shrink-0">
          <svg className="h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.98 12.54M12 15.75l3.023-3.023m0 0l2.985-2.985m-5.007 6.011l-2.985-2.985m0 0l-2.985 2.985m5.007-6.011L12 9.75" />
          </svg>
          <h1 className="text-2xl font-bold text-sky-500">SkillSwap</h1>
        </button>
        
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="relative">
             <button onClick={onNavigateToChat} className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <EnvelopeIcon />
              {unreadMessageCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-800"></span>}
            </button>
          </div>
          <div className="relative" ref={notificationsRef}>
            <button onClick={() => setNotificationsOpen(prev => !prev)} className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <BellIcon />
              {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-800"></span>}
            </button>
            <div className={`absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out transform ${notificationsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                  {notifications.length > 0 && <button onClick={onClearAllNotifications} className="text-sm text-sky-500 hover:underline">Clear all</button>}
                </div>
                <div className="max-h-96 overflow-y-auto p-1">
                  {notifications.length > 0 ? (
                    notifications.map(n => <NotificationItem key={n.id} notification={n} onDismiss={onDismissNotification} />)
                  ) : (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No new notifications</p>
                  )}
                </div>
            </div>
          </div>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(prev => !prev)}>
              <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=4DA8DA&color=fff`} alt="User Profile" className="w-10 h-10 rounded-full border-2 border-sky-500 object-cover" />
            </button>
            <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out transform ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
               <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
               </div>
               <button onClick={() => { onNavigateToSettings(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Cog6ToothIcon className="w-5 h-5" />
                  Settings
               </button>
               <div className="border-t border-slate-200 dark:border-slate-700"></div>
               <button 
                onClick={onLogout} 
                className="w-full text-left block px-4 py-2 text-sm text-pink-600 dark:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                 Logout
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;