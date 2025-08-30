


import React, { useState, useRef, useEffect } from 'react';
import { User, Conversation, Message, MessagePayload } from '../../types';
import { PaperAirplaneIcon, UserCircleIcon, VideoCameraIcon, MicrophoneIcon, PaperClipIcon, TrashIcon, ArrowLeftIcon } from '../icons';
import TypingIndicator from './TypingIndicator';

interface MessagePanelProps {
    currentUser: User;
    conversation?: Conversation;
    otherParticipant?: User;
    onSendMessage: (conversationId: number, payload: MessagePayload) => void;
    isAiTyping: boolean;
    onRemoveConnection: (conversationId: number) => void;
    onBack: () => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ currentUser, conversation, otherParticipant, onSendMessage, isAiTyping, onRemoveConnection, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages, isAiTyping]);

    if (!conversation || !otherParticipant) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 p-4 text-center">
                <p>Select a conversation from the list to start chatting.</p>
            </div>
        );
    }
    
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(conversation.id, { text: newMessage.trim() });
            setNewMessage('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const imageUrl = loadEvent.target?.result as string;
                onSendMessage(conversation.id, { imageUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        if (window.confirm(`Are you sure you want to remove ${otherParticipant?.name} from your connections? This will delete your message history and cannot be undone.`)) {
            onRemoveConnection(conversation.id);
        }
    };

    const renderMessageContent = (message: Message) => {
        return (
            <>
                {message.text && <p>{message.text}</p>}
                {message.imageUrl && (
                    <img src={message.imageUrl} alt="User upload" className="mt-2 rounded-lg max-w-xs h-auto" />
                )}
                {message.audioUrl && (
                    <audio controls src={message.audioUrl} className="mt-2 w-full"></audio>
                )}
                <p className={`text-xs mt-1 ${message.senderId === currentUser.id ? 'text-sky-200' : 'text-slate-400'}`}>{message.timestamp}</p>
            </>
        )
    };


    return (
        <>
            <header className="flex items-center justify-between gap-4 p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Back to conversations">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        {otherParticipant.profilePicture ? (
                            <img
                                src={otherParticipant.profilePicture}
                                alt={otherParticipant.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        )}
                    </div>
                    <h2 className="text-lg font-bold truncate">{otherParticipant.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button disabled className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Audio Call (Coming Soon)">
                        <MicrophoneIcon className="w-6 h-6" />
                    </button>
                    <button disabled className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Video Call (Coming Soon)">
                        <VideoCameraIcon className="w-6 h-6" />
                    </button>
                    <button onClick={handleRemove} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title={`Remove ${otherParticipant.name}`}>
                        <TrashIcon className="w-6 h-6 text-pink-500" />
                    </button>
                </div>
            </header>
            <div className="flex-1 px-4 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col gap-4 py-4">
                    {conversation.messages.map(message => {
                        const isSentByCurrentUser = message.senderId === currentUser.id;
                        return (
                             <div key={message.id} className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} animate-slideInUp`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${isSentByCurrentUser ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 rounded-bl-none'}`}>
                                    {renderMessageContent(message)}
                                </div>
                            </div>
                        );
                    })}
                     {isAiTyping && (
                        <div className="flex justify-start animate-slideInUp">
                           <TypingIndicator />
                        </div>
                    )}
                </div>
                 <div ref={messagesEndRef} />
            </div>
            <footer className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,audio/*" className="hidden" />
                    <button type="button" onClick={triggerFileSelect} className="p-2 text-slate-500 hover:text-sky-500" title="Send image">
                        <PaperClipIcon className="w-6 h-6" />
                    </button>
                     <button type="button" disabled className="p-2 text-slate-500 hover:text-sky-500 disabled:opacity-50 disabled:cursor-not-allowed" title="Record Audio (Coming Soon)">
                        <MicrophoneIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button type="submit" className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                       <PaperAirplaneIcon className="w-5 h-5"/>
                    </button>
                </form>
            </footer>
        </>
    );
};

export default MessagePanel;