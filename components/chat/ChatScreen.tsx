

import React, { useState, useEffect } from 'react';
import { User, Conversation, MessagePayload } from '../../types';
import ConversationList from './ConversationList';
import MessagePanel from './MessagePanel';

interface ChatScreenProps {
    currentUser: User;
    users: User[];
    conversations: Conversation[];
    onSendMessage: (conversationId: number, payload: MessagePayload) => void;
    isAiTyping: boolean;
    onRemoveConnection: (conversationId: number) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ currentUser, users, conversations, onSendMessage, isAiTyping, onRemoveConnection }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

    useEffect(() => {
        // If the currently selected conversation is removed from the list, deselect it.
        const selectedConvoExists = conversations.some(c => c.id === selectedConversationId);
        if (selectedConversationId && !selectedConvoExists) {
            setSelectedConversationId(null);
        }
    }, [conversations, selectedConversationId]);
    
    const handleBackToList = () => {
        setSelectedConversationId(null);
    };

    const getOtherParticipant = (convo: Conversation) => {
        const otherId = convo.participantIds.find(id => id !== currentUser.id);
        return users.find(u => u.id === otherId);
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    // Show MessagePanel if a conversation is selected
    if (selectedConversationId && selectedConversation) {
        return (
             <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800">
                <MessagePanel
                    key={selectedConversationId}
                    currentUser={currentUser}
                    conversation={selectedConversation}
                    otherParticipant={getOtherParticipant(selectedConversation)}
                    onSendMessage={onSendMessage}
                    isAiTyping={isAiTyping && selectedConversation.participantIds.some(id => users.find(u => u.id === id)?.isAI) || false}
                    onRemoveConnection={onRemoveConnection}
                    onBack={handleBackToList}
                />
            </div>
        );
    }
    
    // Otherwise, show the ConversationList
    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <ConversationList
                conversations={conversations}
                currentUser={currentUser}
                users={users}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
                getOtherParticipant={getOtherParticipant}
            />
        </div>
    );
};

export default ChatScreen;