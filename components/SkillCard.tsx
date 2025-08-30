
import React, { useState, useRef, useEffect } from 'react';
import { User, Skill } from '../types';
import { LocationIcon, CheckBadgeIcon, StarIcon, UserCircleIcon, SparklesIcon } from './icons';

interface SkillCardProps {
  user: User;
  onSwipe: (userId: number, direction: 'left' | 'right') => void;
  isActive: boolean;
}

const SkillTag: React.FC<{ skill: Skill; type: 'offer' | 'want' }> = ({ skill, type }) => {
  const baseClasses = 'text-xs font-semibold px-2.5 py-1 rounded-full';
  const offerClasses = 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200';
  const wantClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  
  return <span className={`${baseClasses} ${type === 'offer' ? offerClasses : wantClasses}`}>{skill.name}</span>;
};

const SkillCard: React.FC<SkillCardProps> = ({ user, onSwipe, isActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cardStyle, setCardStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 120;

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    const point = 'touches' in e ? e.touches[0] : e;
    setStartPos({ x: point.clientX, y: point.clientY });
    if (cardRef.current) {
       cardRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isActive) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const deltaX = point.clientX - startPos.x;
    const deltaY = point.clientY - startPos.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    if (cardRef.current) {
       cardRef.current.style.transition = 'transform 0.3s ease-out';
    }

    if (Math.abs(position.x) > SWIPE_THRESHOLD) {
      const direction = position.x > 0 ? 'right' : 'left';
      const flyOutX = (position.x > 0 ? 1 : -1) * (window.innerWidth / 2 + 200);
      setPosition({ x: flyOutX, y: position.y });
      setTimeout(() => onSwipe(user.id, direction), 300);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const rotation = position.x / 20;
    const transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;
    const opacity = 1 - Math.min(Math.abs(position.x) / SWIPE_THRESHOLD, 1);
    setCardStyle({ transform, opacity: isDragging ? 1 : opacity });
  }, [position, isDragging]);
  
   useEffect(() => {
    if(!isActive) {
      setPosition({x: 0, y: 0});
    }
   }, [isActive])

  return (
    <div
      ref={cardRef}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{ ...cardStyle, touchAction: 'none' }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <div className="relative h-80 bg-slate-200 dark:bg-slate-700">
          {user.profilePicture ? (
             <img 
                src={user.profilePicture}
                alt={user.name} 
                className="w-full h-full object-cover" 
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
                <UserCircleIcon className="w-48 h-48 text-slate-400 dark:text-slate-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           {user.isAI && (
            <div className="absolute top-3 left-3 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <SparklesIcon className="w-4 h-4" />
                <span>AI Assistant</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <div className="flex items-center">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                {user.isVerified && !user.isAI && <CheckBadgeIcon className="w-6 h-6 ml-2 text-sky-400" />}
            </div>
            <div className="flex items-center text-sm mt-1">
              <LocationIcon className="w-4 h-4 mr-1" />
              <span>{user.location}</span>
            </div>
          </div>
          {isDragging && position.x > 20 && (
            <div className="absolute top-8 right-8 text-pink-500 border-4 border-pink-500 rounded-lg p-2 text-3xl font-bold rotate-12 animate-scaleIn">
              CONNECT
            </div>
          )}
          {isDragging && position.x < -20 && (
            <div className="absolute top-8 left-8 text-yellow-400 border-4 border-yellow-400 rounded-lg p-2 text-3xl font-bold -rotate-12 animate-scaleIn">
              PASS
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sky-500 dark:text-sky-400 mb-2">Offers</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skillsOffered.slice(0, 3).map(skill => <SkillTag key={skill.name} skill={skill} type="offer" />)}
            </div>
            <h3 className="font-bold text-yellow-500 dark:text-yellow-400 mb-2">Wants</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 3).map(skill => <SkillTag key={skill.name} skill={skill} type="want" />)}
            </div>
          </div>
          {!user.isAI && (
            <div className="flex items-center justify-center pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                {user.rating > 0 && (
                <div className="flex items-center text-lg font-bold text-slate-600 dark:text-slate-300">
                    <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>{user.rating.toFixed(1)}</span>
                    <span className="text-sm font-normal ml-1 text-slate-500 dark:text-slate-400">({user.reviews.length} reviews)</span>
                </div>
                )}
                {user.rating === 0 && (
                    <div className="text-sm text-slate-500 dark:text-slate-400">No reviews yet</div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;