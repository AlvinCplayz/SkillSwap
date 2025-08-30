import React, { useState, useRef } from 'react';
import { User, Skill, SkillLevel, Urgency } from '../../types';
import { TrashIcon, XIcon, LinkedInIcon, GitHubIcon, UserCircleIcon, InstagramIcon, TikTokIcon, YouTubeIcon, GmailIcon } from '../icons';
import { countries } from '../../data/countries';
import SkillEditor from './SkillEditor';

interface OnboardingWizardProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="w-full mb-8">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-sky-700 dark:text-white">Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
            <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
    </div>
);

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState<User>(user);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const totalSteps = 3;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value,
            },
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!userData.name.trim()) newErrors.name = "Name is required.";
        if (!userData.location.trim()) newErrors.location = "Location is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1) {
            if (!validateStep1()) return;
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
    
    const isStep1Valid = userData.name.trim() !== '' && userData.location.trim() !== '';

    return (
        <div className="h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                <ProgressBar step={step} totalSteps={totalSteps} />
                
                <div key={step} className="animate-fadeIn">
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-bold text-center mb-6">Tell us about yourself</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
                                    <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="e.g., Alex Johnson" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
                                    <select 
                                      id="location" 
                                      name="location" 
                                      value={userData.location} 
                                      onChange={handleInputChange} 
                                      className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border ${errors.location ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                                    >
                                      <option value="" disabled>Select your country</option>
                                      {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                      ))}
                                    </select>
                                     {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                                 <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Short Bio</label>
                                    <textarea id="bio" name="bio" value={userData.bio} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Tell everyone a little bit about yourself..."></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {step === 2 && (
                        <div>
                            <h2 className="text-3xl font-bold text-center mb-6">Personalize your Profile</h2>
                            <div className="space-y-6">
                                 <div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Profile Picture</h3>
                                    <div className="flex items-center gap-6">
                                        {userData.profilePicture ? (
                                            <img src={userData.profilePicture} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700" />
                                         ) : (
                                            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-200 dark:border-slate-700">
                                                <UserCircleIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                                            </div>
                                         )}
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                        <button onClick={() => fileInputRef.current?.click()} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">
                                            {userData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                                        </button>
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Social Links (Optional)</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <XIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="x" value={userData.socialLinks?.x || ''} onChange={handleSocialLinkChange} placeholder="https://x.com/username" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <InstagramIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="instagram" value={userData.socialLinks?.instagram || ''} onChange={handleSocialLinkChange} placeholder="https://instagram.com/username" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <TikTokIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="tiktok" value={userData.socialLinks?.tiktok || ''} onChange={handleSocialLinkChange} placeholder="https://tiktok.com/@username" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <YouTubeIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="youtube" value={userData.socialLinks?.youtube || ''} onChange={handleSocialLinkChange} placeholder="https://youtube.com/c/channel" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <LinkedInIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="linkedIn" value={userData.socialLinks?.linkedIn || ''} onChange={handleSocialLinkChange} placeholder="https://linkedin.com/in/username" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <GitHubIcon className="w-5 h-5 text-slate-400" />
                                            <input type="text" name="github" value={userData.socialLinks?.github || ''} onChange={handleSocialLinkChange} placeholder="https://github.com/username" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                         <div>
                            <h2 className="text-3xl font-bold text-center mb-6">What skills do you want to swap?</h2>
                             <div className="space-y-6">
                                <SkillEditor skills={userData.skillsOffered} onSkillsChange={(s) => setUserData({...userData, skillsOffered: s})} type="offer" />
                                <SkillEditor skills={userData.skillsWanted} onSkillsChange={(s) => setUserData({...userData, skillsWanted: s})} type="want" />
                             </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-8">
                    <button 
                        onClick={handleBack} 
                        disabled={step === 1}
                        className="bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                     {step < totalSteps && (
                        <button 
                            onClick={handleNext}
                            disabled={step === 1 && !isStep1Valid}
                            className="bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                     )}
                     {step === totalSteps && (
                        <button 
                            onClick={() => onComplete(userData)}
                            className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Finish Setup
                        </button>
                     )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;