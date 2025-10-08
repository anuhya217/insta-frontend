import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image, Heart, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { mockConversations, mockMessages } from '../data/mockData';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Load mock conversations
  useEffect(() => {
    setConversations(mockConversations);
  }, []);

  // Select conversation
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    const convoMessages = mockMessages.filter(
      (msg) => msg.conversationId === conversation.id
    );
    setMessages(convoMessages);
    setShowMobileChat(true);
  };

  // Send message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg = {
        id: Date.now(),
        conversationId: selectedConversation.id,
        sender: 'You',
        text: newMessage.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter((conv) =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex">
      {/* Left Conversations Panel */}
      <div
        className={`w-full lg:w-80 border-r border-gray-300 dark:border-gray-700 flex flex-col ${
          showMobileChat ? 'hidden lg:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-xl font-semibold dark:text-white mb-3">Messages</h1>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`flex items-center p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : ''
                }`}
              >
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.username}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm truncate dark:text-white">
                      {conversation.user.displayName}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      conversation.unreadCount > 0
                        ? 'font-semibold text-black dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {conversation.lastMessage.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Send className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-light mb-2 dark:text-white">
                  No conversations yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Start a conversation with someone!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${
          !showMobileChat ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-3"
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <img
                src={selectedConversation.user.avatar}
                alt={selectedConversation.user.username}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h3 className="font-semibold dark:text-white">
                  {selectedConversation.user.displayName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{selectedConversation.user.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isOwn = message.sender === 'You';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Send className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-light mb-2 dark:text-white">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Start the conversation!
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Image className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                    }
                    className="border-none bg-gray-100 dark:bg-gray-700 rounded-full px-4 focus:ring-1 focus:ring-gray-300 dark:text-white"
                  />
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Smile className="h-5 w-5" />
                </Button>
                {newMessage.trim() ? (
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 rounded-full px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="p-2">
                    <Heart className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <Send className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-light mb-2 dark:text-white">
                Your Messages
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Send private photos and messages to a friend or group.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
