

import React from 'react';
import { User, Review, Skill } from '../types';
import { LocationIcon, CheckBadgeIcon, StarIcon, MagicWandIcon, XIcon, LinkedInIcon, GitHubIcon, TikTokIcon, InstagramIcon, YouTubeIcon, GmailIcon, UserCircleIcon, SparklesIcon } from './icons';

interface UserProfileProps {
    user: User;
    onGeneratePlan: (skillName: string) => void;
}

const SkillList: React.FC<{ 
    title: string; 
    skills: Skill[]; 
    color: string;
    onGeneratePlan?: (skillName: string) => void;
    isWantList?: boolean;
}> = ({ title, skills, color, onGeneratePlan, isWantList = false }) => (
    <div>
        <h3 className={`text-lg font-bold text-${color}-500 dark:text-${color}-400 mb-3`}>{title}</h3>
        <ul className="space-y-2">
            {skills.map(skill => (
                <li key={skill.name} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{skill.name}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{skill.level || skill.urgency}</span>
                    </div>
                    {isWantList && onGeneratePlan && (
                        <button onClick={() => onGeneratePlan(skill.name)} className="p-2 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800 text-sky-500" title="Get AI Lesson Plan">
                            <MagicWandIcon className="w-5 h-5" />
                        </button>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="flex items-start space-x-4">
        <img src={review.authorImage} alt={review.author} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{review.author}</h4>
                <div className="flex items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300 mr-1">{review.rating.toFixed(1)}</span>
                    <StarIcon className="w-5 h-5 text-yellow-400"/>
                </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{review.comment}</p>
        </div>
    </div>
);


const UserProfile: React.FC<UserProfileProps> = ({ user, onGeneratePlan }) => {
    const { socialLinks } = user;
    const hasSocialLinks = socialLinks && Object.values(socialLinks).some(link => link);

    return (
        <div className="p-4 w-full overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn">
                <div className="w-32 h-32 flex-shrink-0">
                    {user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-sky-500" 
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-sky-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserCircleIcon className="w-24 h-24 text-slate-400 dark:text-slate-500" />
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex items-center justify-center sm:justify-start">
                        <h2 className="text-3xl font-bold">{user.name}</h2>
                        {user.isVerified && !user.isAI && <CheckBadgeIcon className="w-7 h-7 ml-2 text-sky-400" />}
                    </div>
                     {user.isAI && (
                        <div className="mt-1 flex justify-center sm:justify-start">
                            <div className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                <span>AI Assistant</span>
                            </div>
                        </div>
                    )}
                     <div className="flex items-center text-slate-500 dark:text-slate-400 mt-1 justify-center sm:justify-start">
                      <LocationIcon className="w-4 h-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                    {!user.isAI && user.rating > 0 && (
                        <div className="flex items-center text-lg font-bold mt-2 justify-center sm:justify-start">
                            <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                            <span>{user.rating.toFixed(1)}</span>
                            <span className="text-sm font-normal ml-1 text-slate-500 dark:text-slate-400">({user.reviews.length} reviews)</span>
                        </div>
                    )}
                     {hasSocialLinks && (
                        <div className="flex items-center justify-center sm:justify-start flex-wrap gap-x-4 gap-y-2 mt-3">
                            {socialLinks?.x && <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><XIcon className="w-5 h-5" /></a>}
                            {socialLinks?.linkedIn && <a href={socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><LinkedInIcon className="w-5 h-5" /></a>}
                            {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><GitHubIcon className="w-5 h-5" /></a>}
                            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><InstagramIcon className="w-5 h-5" /></a>}
                            {socialLinks?.tiktok && <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><TikTokIcon className="w-5 h-5" /></a>}
                            {socialLinks?.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500"><YouTubeIcon className="w-5 h-5" /></a>}
                            {socialLinks?.gmail && <a href={`mailto:${socialLinks.gmail}`} className="text-slate-400 hover:text-sky-500"><GmailIcon className="w-5 h-5" /></a>}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">About Me</h3>
                <p className="text-slate-600 dark:text-slate-400">{user.bio}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <SkillList title="Skills I Offer" skills={user.skillsOffered} color="sky" />
                <SkillList 
                    title="Skills I Want" 
                    skills={user.skillsWanted} 
                    color="yellow" 
                    onGeneratePlan={onGeneratePlan}
                    isWantList={true}
                />
            </div>

            {!user.isAI && (
                <div className="mt-8 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Reviews ({user.reviews.length})</h3>
                    {user.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {user.reviews.map(review => <ReviewCard key={review.author} review={review} />)}
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to leave one!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;