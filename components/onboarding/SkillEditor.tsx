import React, { useState } from 'react';
import { Skill, SkillLevel, Urgency } from '../../types';
import { TrashIcon } from '../icons';

interface SkillEditorProps {
    skills: Skill[];
    onSkillsChange: (skills: Skill[]) => void;
    type: 'offer' | 'want';
}

const SkillEditor: React.FC<SkillEditorProps> = ({ skills, onSkillsChange, type }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<SkillLevel>(SkillLevel.Beginner);
    const [urgency, setUrgency] = useState<Urgency>(Urgency.Low);

    const handleAddSkill = () => {
        if (!name.trim()) return;
        const newSkill: Skill = { 
            name: name.trim(),
            description: description.trim() || undefined
        };
        if (type === 'offer') {
            newSkill.level = level;
        } else {
            newSkill.urgency = urgency;
        }
        onSkillsChange([...skills, newSkill]);
        setName('');
        setDescription('');
    };

    const handleRemoveSkill = (skillName: string) => {
        onSkillsChange(skills.filter(s => s.name !== skillName));
    };

    const title = type === 'offer' ? "Skills I Offer" : "Skills I Want";
    const color = type === 'offer' ? "sky" : "yellow";
    
    return (
        <div>
            <h3 className={`text-lg font-bold text-${color}-500 dark:text-${color}-400 mb-3`}>{title}</h3>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Guitar Playing"
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                     <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <div className="flex gap-2">
                    {type === 'offer' && (
                        <select value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)} className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                            {Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    )}
                     {type === 'want' && (
                        <select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)} className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                            {Object.values(Urgency).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    )}
                    <button onClick={handleAddSkill} className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {skills.map(skill => (
                         <span key={skill.name} className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-full bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200 animate-scaleIn`}>
                            {skill.name}
                            <button onClick={() => handleRemoveSkill(skill.name)} className="ml-2 text-red-500 hover:text-red-700">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillEditor;