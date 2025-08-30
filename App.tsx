

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DiscoveryFeed from './components/DiscoveryFeed';
import { useDarkMode } from './hooks/useDarkMode';
import { mockUsers } from './data/mockData';
import UserProfile from './components/UserProfile';
import { User, Notification as NotificationType, Conversation, Message, MessagePayload } from './types';
import AuthLayout from './components/auth/AuthLayout';
import WelcomeScreen from './components/auth/WelcomeScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import SettingsPage from './components/SettingsPage';
import AISkillCoachModal from './components/AISkillCoachModal';
import ChatScreen from './components/chat/ChatScreen';
import VerifyEmailScreen from './components/auth/VerifyEmailScreen';
import { generateChatResponse } from './lib/gemini';
import SplashScreen from './components/SplashScreen';
import BottomNavBar from './components/SearchBar';

const newUserData: Omit<User, 'id' | 'email' | 'password'> = {
    name: '',
    profilePicture: null,
    location: '',
    bio: '',
    skillsOffered: [],
    skillsWanted: [],
    reviews: [],
    isVerified: false,
    rating: 0,
    hasOnboarded: false,
    isEmailVerified: false,
    socialLinks: {},
};

type AppView = 'auth' | 'onboarding' | 'main' | 'settings' | 'chat' | 'verify-email';
type MainViewTab = 'discover' | 'profile';

const App: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [appView, setAppView] = useState<AppView>('auth');
  const [mainViewTab, setMainViewTab] = useState<MainViewTab>('discover');
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [swipedUserIds, setSwipedUserIds] = useState<Set<number>>(new Set());
  
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [selectedSkillForCoach, setSelectedSkillForCoach] = useState<string | null>(null);

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
        if (!user.isEmailVerified) {
            setEmailToVerify(user.email);
            setAppView('verify-email');
            return true; // Still a "success" from the form's perspective
        }
        setCurrentUser(user);
        if (user.hasOnboarded) {
            setAppView('main');
        } else {
            setAppView('onboarding');
        }
        return true;
    }
    return false;
  };

  const handleSignUp = (email: string, password: string): boolean => {
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: allUsers.length + 1,
      email,
      password,
      ...newUserData,
      emailVerificationToken: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setAllUsers(prev => [...prev, newUser]);
    setEmailToVerify(email);
    setAppView('verify-email');
    return true;
  }
  
  const handleVerifyEmail = (email: string, token: string): boolean => {
    const userToVerify = allUsers.find(u => u.email === email);
    if (userToVerify && userToVerify.emailVerificationToken === token) {
        const verifiedUser = { ...userToVerify, isEmailVerified: true };
        setAllUsers(prev => prev.map(u => u.id === verifiedUser.id ? verifiedUser : u));
        setCurrentUser(verifiedUser);
        setAppView('onboarding');
        setEmailToVerify(null);
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppView('auth');
    setAuthScreen('welcome');
    setSwipedUserIds(new Set()); // Reset swipes on logout
  };

  const handleUpdateUser = (updatedUser: User) => {
    const userWithOnboarding = { ...updatedUser, hasOnboarded: true };
    setCurrentUser(userWithOnboarding);
    setAllUsers(prevUsers => prevUsers.map(u => u.id === userWithOnboarding.id ? userWithOnboarding : u));
    setAppView('main');
  };

  const handleNavigate = (view: AppView) => {
    setAppView(view);
  }

  const handleDismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleClearAllNotifications = () => {
      setNotifications([]);
  };
  
  const handleOpenCoachModal = (skillName: string) => {
      setSelectedSkillForCoach(skillName);
      setIsCoachModalOpen(true);
  };
  
  const handleSwipe = (swipedUserId: number, direction: 'left' | 'right') => {
      setSwipedUserIds(prev => new Set(prev).add(swipedUserId));
      if (direction === 'right' && currentUser) {
          const matchedUser = allUsers.find(u => u.id === swipedUserId);
          if (!matchedUser) return;
          
          const newNotification: NotificationType = {
              id: Date.now(),
              type: 'connection',
              text: `You connected with ${matchedUser.name}!`,
              timestamp: 'Just now',
              isRead: false,
              userImage: matchedUser.profilePicture || ''
          };
          setNotifications(prev => [newNotification, ...prev]);

          // Check if a conversation already exists
          const existingConversation = conversations.find(c => c.participantIds.includes(currentUser.id) && c.participantIds.includes(swipedUserId));
          if (!existingConversation) {
            const newConversation: Conversation = {
                id: Date.now(),
                participantIds: [currentUser.id, swipedUserId],
                messages: [],
            };
            setConversations(prev => [newConversation, ...prev]);
          }
      }
  };
  
    const handleSendMessage = async (conversationId: number, payload: MessagePayload) => {
        if (!currentUser || (!payload.text && !payload.imageUrl && !payload.audioUrl)) return;

        const newMessage: Message = {
            id: Date.now(),
            senderId: currentUser.id,
            text: payload.text || '',
            imageUrl: payload.imageUrl,
            audioUrl: payload.audioUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };
        
        // Add user's message immediately
        const updatedConversations = conversations.map(convo => 
            convo.id === conversationId 
                ? { ...convo, messages: [...convo.messages, newMessage] }
                : convo
        );
        setConversations(updatedConversations);

        const currentConvo = updatedConversations.find(c => c.id === conversationId);
        const otherParticipantId = currentConvo?.participantIds.find(id => id !== currentUser.id);
        const otherParticipant = allUsers.find(u => u.id === otherParticipantId);

        if (otherParticipant?.isAI) {
            setIsAiTyping(true);
            try {
                const aiResponseText = await generateChatResponse(currentConvo.messages, otherParticipant.bio, currentUser.id);
                if (aiResponseText) {
                    const aiMessage: Message = {
                        id: Date.now() + 1,
                        senderId: otherParticipant.id,
                        text: aiResponseText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isRead: false,
                    };
                    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, aiMessage] } : c));
                }
            } catch (error) {
                console.error("Error handling AI response:", error);
                const errorMessage: Message = {
                    id: Date.now() + 1,
                    senderId: otherParticipant.id,
                    text: "I'm sorry, I encountered an error. Please try again.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isRead: false,
                };
                setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, errorMessage] } : c));
            } finally {
                setIsAiTyping(false);
            }
        }
    };
  
    const handleRemoveConnection = (conversationId: number) => {
        const convoToRemove = conversations.find(c => c.id === conversationId);
        if (!convoToRemove || !currentUser) return;
        
        const otherParticipantId = convoToRemove.participantIds.find(id => id !== currentUser.id);

        setConversations(prev => prev.filter(c => c.id !== conversationId));
        if (otherParticipantId) {
            setSwipedUserIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(otherParticipantId);
                return newSet;
            });
        }
    };

    const discoveryUsers = useMemo(() => {
        const connectedUserIds = new Set(conversations.flatMap(c => c.participantIds));
        return allUsers.filter(u => u.id !== currentUser?.id && !swipedUserIds.has(u.id) && !connectedUserIds.has(u.id));
    }, [allUsers, currentUser, swipedUserIds, conversations]);


  const renderContent = () => {
    if (showSplash) {
        return <SplashScreen />;
    }

    if (appView === 'auth' || !currentUser && appView !== 'verify-email') {
      let authContent;
      switch(authScreen) {
        case 'login':
          authContent = <LoginScreen onLogin={handleLogin} onNavigate={setAuthScreen} />;
          break;
        case 'signup':
          authContent = <SignUpScreen onSignUp={handleSignUp} onNavigate={setAuthScreen} />;
          break;
        default:
          authContent = <WelcomeScreen onNavigate={setAuthScreen} />;
      }
      return <AuthLayout>{authContent}</AuthLayout>;
    }
    
    if (appView === 'verify-email') {
        const userToVerify = allUsers.find(u => u.email === emailToVerify);
        return (
            <AuthLayout>
                <VerifyEmailScreen 
                    email={emailToVerify} 
                    onVerify={handleVerifyEmail}
                    verificationToken={userToVerify?.emailVerificationToken || null}
                />
            </AuthLayout>
        );
    }

    if (appView === 'onboarding') {
        return <OnboardingWizard user={currentUser} onComplete={handleUpdateUser} />;
    }

    if (appView === 'settings') {
        return <SettingsPage user={currentUser} onSave={handleUpdateUser} onCancel={() => setAppView('main')} />;
    }
    
    if (appView === 'chat') {
        return (
            <div className="flex flex-col h-full">
                 <Header 
                    isDarkMode={isDarkMode} 
                    toggleDarkMode={toggleDarkMode} 
                    user={currentUser} 
                    onLogout={handleLogout}
                    onNavigateToSettings={() => handleNavigate('settings')}
                    onNavigateToChat={() => handleNavigate('chat')}
                    onNavigateHome={() => handleNavigate('main')}
                    notifications={notifications}
                    onDismissNotification={handleDismissNotification}
                    onClearAllNotifications={handleClearAllNotifications}
                    unreadMessageCount={conversations.reduce((count, convo) => {
                        return count + convo.messages.filter(m => !m.isRead && m.senderId !== currentUser.id).length;
                    }, 0)}
                 />
                <ChatScreen 
                    currentUser={currentUser}
                    users={allUsers}
                    conversations={conversations}
                    onSendMessage={handleSendMessage}
                    isAiTyping={isAiTyping}
                    onRemoveConnection={handleRemoveConnection}
                />
            </div>
        );
    }

    // Main App View
    return (
        <>
            <div className="h-full flex flex-col">
                <Header 
                    isDarkMode={isDarkMode} 
                    toggleDarkMode={toggleDarkMode} 
                    user={currentUser} 
                    onLogout={handleLogout}
                    onNavigateToSettings={() => handleNavigate('settings')}
                    onNavigateToChat={() => handleNavigate('chat')}
                    onNavigateHome={() => {
                        handleNavigate('main');
                        setMainViewTab('discover');
                    }}
                    notifications={notifications}
                    onDismissNotification={handleDismissNotification}
                    onClearAllNotifications={handleClearAllNotifications}
                    unreadMessageCount={conversations.reduce((count, convo) => {
                        return count + convo.messages.filter(m => !m.isRead && m.senderId !== currentUser.id).length;
                    }, 0)}
                />
                <main className="flex-1 overflow-y-auto">
                    {mainViewTab === 'discover' && (
                        <div className="p-4">
                             <h1 className="text-2xl font-bold text-center text-sky-500 mb-1">Discover Coaches</h1>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
                                Swipe right to start a conversation.
                            </p>
                            <DiscoveryFeed 
                                users={discoveryUsers}
                                onSwipe={handleSwipe}
                            />
                        </div>
                    )}
                    {mainViewTab === 'profile' && (
                        <UserProfile user={currentUser} onGeneratePlan={handleOpenCoachModal} />
                    )}
                </main>
                <BottomNavBar activeTab={mainViewTab} onTabChange={setMainViewTab} />
            </div>
            <AISkillCoachModal 
                isOpen={isCoachModalOpen}
                skillName={selectedSkillForCoach}
                onClose={() => setIsCoachModalOpen(false)}
            />
        </>
    );
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-800">
        <div className="aspect-[9/16] w-full max-h-full sm:w-auto sm:h-full font-sans text-slate-800 dark:text-slate-200 shadow-2xl overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
          {renderContent()}
        </div>
    </main>
  );
};

export default App;