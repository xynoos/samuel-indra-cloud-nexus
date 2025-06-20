
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  message_type: 'text' | 'image' | 'file';
  media_url?: string;
}

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  participant_info: {
    username: string;
    full_name: string;
    avatar_url?: string;
    is_online: boolean;
  };
  last_message?: string;
  unread_count: number;
}

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demo
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participant_1: user?.id || '',
      participant_2: '2',
      last_message_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      participant_info: {
        username: 'samuelindra',
        full_name: 'Samuel Indra Bastian',
        avatar_url: null,
        is_online: true
      },
      last_message: 'Terima kasih untuk feedback yang konstruktif!',
      unread_count: 2
    },
    {
      id: '2',
      participant_1: user?.id || '',
      participant_2: '3',
      last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      participant_info: {
        username: 'techexpert',
        full_name: 'Tech Expert',
        avatar_url: null,
        is_online: false
      },
      last_message: 'Bagaimana cara menggunakan AI Assistant?',
      unread_count: 0
    },
    {
      id: '3',
      participant_1: user?.id || '',
      participant_2: '4',
      last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      participant_info: {
        username: 'designer',
        full_name: 'Creative Designer',
        avatar_url: null,
        is_online: true
      },
      last_message: 'File converter-nya sangat membantu!',
      unread_count: 1
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Halo! Bagaimana kabar platform cloud storage-nya?',
      sender_id: '2',
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      message_type: 'text'
    },
    {
      id: '2',
      content: 'Halo! Alhamdulillah semuanya berjalan lancar. Fitur AI Assistant dan converter sudah bisa digunakan dengan baik.',
      sender_id: user?.id || '',
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      message_type: 'text'
    },
    {
      id: '3',
      content: 'Wah keren! Saya sudah coba text-to-image feature-nya, hasilnya bagus banget.',
      sender_id: '2',
      created_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      message_type: 'text'
    },
    {
      id: '4',
      content: 'Terima kasih untuk feedback yang konstruktif! Masih ada fitur lain yang ingin ditambahkan?',
      sender_id: '2',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      message_type: 'text'
    }
  ];

  useEffect(() => {
    // Load conversations
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    // Load messages for selected conversation
    if (selectedConversation) {
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || '',
      created_at: new Date().toISOString(),
      message_type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, last_message: newMessage, last_message_at: new Date().toISOString() }
        : conv
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const filteredConversations = conversations.filter(conv =>
    conv.participant_info.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant_info.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          
          {/* Conversations List */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari konversasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">💬</div>
                      <p>Belum ada percakapan</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={conversation.participant_info.avatar_url} />
                              <AvatarFallback>
                                {conversation.participant_info.username[0]?.toUpperCase() || <User className="w-4 h-4" />}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.participant_info.is_online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm truncate">
                                {conversation.participant_info.full_name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(conversation.last_message_at), { 
                                  addSuffix: true, 
                                  locale: id 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.last_message}
                              </p>
                              {conversation.unread_count > 0 && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-8">
            <Card className="h-full flex flex-col">
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={selectedConversationData.participant_info.avatar_url} />
                            <AvatarFallback>
                              {selectedConversationData.participant_info.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {selectedConversationData.participant_info.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{selectedConversationData.participant_info.full_name}</h3>
                          <p className="text-sm text-gray-500">
                            @{selectedConversationData.participant_info.username} • {' '}
                            {selectedConversationData.participant_info.is_online ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        } rounded-lg px-4 py-2`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatDistanceToNow(new Date(message.created_at), { 
                              addSuffix: true, 
                              locale: id 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder="Ketik pesan..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium mb-2">Pilih Percakapan</h3>
                    <p>Pilih percakapan untuk mulai chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
