
export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export enum Urgency {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Skill {
  name: string;
  description?: string;
  level?: SkillLevel;
  urgency?: Urgency;
}

export interface Review {
  author: string;
  authorImage: string;
  rating: number; // 1 to 5
  comment: string;
}

export interface User {
  id: number;
  email: string;
  password?: string; // Password might not be needed on client-side after login
  name: string;
  profilePicture: string | null;
  location: string;
  bio: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  reviews: Review[];
  isVerified: boolean;
  rating: number;
  hasOnboarded: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  isAI?: boolean;
  socialLinks?: {
    x?: string;
    linkedIn?: string;
    github?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    gmail?: string;
  };
}

export interface DayPlan {
  day: number;
  topic: string;
  goals: string[];
  exercises: string[];
}

export interface LessonPlan {
  skill: string;
  plan: DayPlan[];
}

export interface Notification {
  id: number;
  type: 'connection' | 'review';
  text: string;
  timestamp: string;
  isRead: boolean;
  userImage: string;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

export interface MessagePayload {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
}

export interface Conversation {
  id: number;
  participantIds: number[];
  messages: Message[];
}
