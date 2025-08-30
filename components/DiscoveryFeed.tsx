import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import SkillCard from './SkillCard';

interface DiscoveryFeedProps {
  users: User[];
  onSwipe: (swipedUserId: number, direction: 'left' | 'right') => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ users, onSwipe }) => {
  const [userStack, setUserStack] = useState(users);

  useEffect(() => {
    setUserStack(users);
  }, [users]);

  const handleSwipeInternal = (swipedUserId: number, direction: 'left' | 'right') => {
    // Parent component handles the logic (e.g. matching)
    onSwipe(swipedUserId, direction);
    
    // UI simply removes the card from the stack
    setUserStack((prevStack) => prevStack.filter(user => user.id !== swipedUserId));
  };
  
  const handleActionClick = (direction: 'left' | 'right') => {
    if (userStack.length > 0) {
      const topUser = userStack[userStack.length - 1];
      handleSwipeInternal(topUser.id, direction);
    }
  };

  const memoizedUsers = useMemo(() => userStack, [userStack]);

  if (memoizedUsers.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[550px] w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center animate-scaleIn">
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">That's everyone!</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later for new people to swap skills with.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-full h-[550px]">
        {memoizedUsers.map((user, index) => (
          <SkillCard
            key={user.id}
            user={user}
            onSwipe={handleSwipeInternal}
            isActive={index === memoizedUsers.length - 1}
          />
        ))}
      </div>
       <div className="flex items-center justify-center space-x-8">
        <button 
            onClick={() => handleActionClick('left')}
            className="p-4 bg-white dark:bg-slate-700 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <button 
            onClick={() => handleActionClick('right')}
            className="p-6 bg-white dark:bg-slate-700 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default DiscoveryFeed;