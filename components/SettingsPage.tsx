import React, { useState, useRef } from 'react';
import { User } from '../types';
import { XIcon, LinkedInIcon, GitHubIcon, UserCircleIcon, InstagramIcon, TikTokIcon, YouTubeIcon, GmailIcon, ArrowLeftIcon } from './icons';
import { countries } from '../../data/countries';
import SkillEditor from './onboarding/SkillEditor';

interface SettingsPageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>(user);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
        const result = reader.result as string;
        setProfilePicPreview(result);
        setFormData({ ...formData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    onSave(formData);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-900">
      <header className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0 sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 mr-2">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-8 py-4">
          
          <section>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                  { (profilePicPreview || formData.profilePicture) ? (
                      <img src={profilePicPreview || formData.profilePicture!} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700" />
                  ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-200 dark:border-slate-700">
                          <UserCircleIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                      </div>
                  )}
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                  />
                  <button 
                      onClick={triggerFileSelect}
                      className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                      Upload New
                  </button>
              </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Personal Information</h3>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
                <select 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="" disabled>Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Short Bio</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Tell everyone a little bit about yourself..."></textarea>
            </div>
          </section>
          
          <section>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Your Skills</h3>
              <div className="space-y-6 mt-4">
                  <SkillEditor
                      skills={formData.skillsOffered}
                      onSkillsChange={(s) => setFormData({...formData, skillsOffered: s})}
                      type="offer"
                  />
                  <SkillEditor
                      skills={formData.skillsWanted}
                      onSkillsChange={(s) => setFormData({...formData, skillsWanted: s})}
                      type="want"
                  />
              </div>
          </section>

          <section>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Social Links</h3>
              <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <XIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="x" value={formData.socialLinks?.x || ''} onChange={handleSocialLinkChange} placeholder="https://x.com/username" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <InstagramIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="instagram" value={formData.socialLinks?.instagram || ''} onChange={handleSocialLinkChange} placeholder="https://instagram.com/username" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <TikTokIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="tiktok" value={formData.socialLinks?.tiktok || ''} onChange={handleSocialLinkChange} placeholder="https://tiktok.com/@username" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <YouTubeIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="youtube" value={formData.socialLinks?.youtube || ''} onChange={handleSocialLinkChange} placeholder="https://youtube.com/c/channel" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <LinkedInIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="linkedIn" value={formData.socialLinks?.linkedIn || ''} onChange={handleSocialLinkChange} placeholder="https://linkedin.com/in/username" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <GitHubIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="github" value={formData.socialLinks?.github || ''} onChange={handleSocialLinkChange} placeholder="https://github.com/username" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="flex items-center gap-3">
                      <GmailIcon className="w-5 h-5 text-slate-400" />
                      <input type="text" name="gmail" value={formData.socialLinks?.gmail || ''} onChange={handleSocialLinkChange} placeholder="mailto:you@example.com" className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
              </div>
          </section>

          <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                  SkillSwap was developed by{' '}
                  <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-500 hover:underline">
                      A-Line Studio
                  </a>.
              </p>
          </div>
        </div>
      </div>
      
      <footer className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={handleSaveChanges}
            className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Save Changes
          </button>
      </footer>
    </div>
  );
};

export default SettingsPage;