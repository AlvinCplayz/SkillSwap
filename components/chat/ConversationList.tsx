import React from 'react';
import { User, Conversation } from '../../types';
import { UserCircleIcon } from '../icons';

interface ConversationListProps {
    conversations: Conversation[];
    currentUser: User;
    users: User[];
    selectedConversationId: number | null;
    onSelectConversation: (id: number) => void;
    getOtherParticipant: (convo: Conversation) => User | undefined;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedConversationId, onSelectConversation, getOtherParticipant }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map(convo => {
                const otherParticipant = getOtherParticipant(convo);
                if (!otherParticipant) return null;

                const lastMessage = convo.messages[convo.messages.length - 1];
                const isSelected = convo.id === selectedConversationId;

                return (
                    <button
                        key={convo.id}
                        onClick={() => onSelectConversation(convo.id)}
                        className={`w-full text-left flex items-center gap-3 p-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${isSelected ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                           {otherParticipant.profilePicture ? (
                                <img
                                    src={otherParticipant.profilePicture}
                                    alt={otherParticipant.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                           ) : (
                                <UserCircleIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                           )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-bold truncate">{otherParticipant.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {lastMessage ? lastMessage.text : 'No messages yet'}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ConversationList;