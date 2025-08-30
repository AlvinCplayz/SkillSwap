import React, { useState, useEffect } from 'react';
import { generateLessonPlan } from '../lib/gemini';
import { LessonPlan } from '../types';
import { CloseIcon, MagicWandIcon } from './icons';

interface AISkillCoachModalProps {
    skillName: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-6"></div>
        {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);

const AISkillCoachModal: React.FC<AISkillCoachModalProps> = ({ skillName, isOpen, onClose }) => {
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && skillName) {
            const fetchPlan = async () => {
                setIsLoading(true);
                setError(null);
                setLessonPlan(null);
                try {
                    const plan = await generateLessonPlan(skillName);
                    if (plan) {
                        setLessonPlan(plan);
                    } else {
                        setError('Could not generate a lesson plan. The AI might be busy. Please try again later.');
                    }
                } catch (e) {
                    setError('An unexpected error occurred. Please check your connection and try again.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPlan();
        }
    }, [isOpen, skillName]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                        <MagicWandIcon className="w-7 h-7 text-sky-500" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                            AI Lesson Plan: <span className="text-sky-500">{skillName}</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {isLoading && <LoadingSkeleton />}
                    {error && <div className="text-center text-pink-500 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">{error}</div>}
                    {lessonPlan && (
                        <div className="space-y-3">
                            {lessonPlan.plan.sort((a, b) => a.day - b.day).map(dayPlan => (
                                <details key={dayPlan.day} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg group" open={dayPlan.day === 1}>
                                    <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-slate-700 dark:text-slate-200 p-4">
                                        Day {dayPlan.day}: {dayPlan.topic}
                                        <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                                        <div className="overflow-hidden">
                                            <div className="px-4 pb-4 pt-0 space-y-4 text-slate-600 dark:text-slate-300">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Goals:</h4>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {dayPlan.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Exercises:</h4>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {dayPlan.exercises.map((exercise, i) => <li key={i}>{exercise}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISkillCoachModal;