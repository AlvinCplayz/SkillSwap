import { User, SkillLevel, Urgency } from '../types';
import { aiAssistants } from './aiAssistants';

export const mockUsers: User[] = [
  ...aiAssistants,
];

// Start with no notifications, messages, or conversations for a new user experience
export const mockNotifications = [];
export const mockMessages = [];
export const mockConversations = [];