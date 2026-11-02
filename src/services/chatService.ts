import api from './api';

export type Conversation = {
  id: string;
  other_name: string;
  other_id?: number;
  other_image?: string;
  last_message?: any;
  unread_count?: number;
  updated_at?: string;
  [key: string]: any;
};

export type ChatMessage = {
  id: number;
  conversation_id: string;
  sender_id: number;
  sender_type: 'seeker' | 'mentor';
  message: string;
  is_read: number;
  sent_at: string;
  created_at: string;
};

export const chatService = {
  // Seeker only: opens (or reuses) a conversation with a mentor.
  async startConversation(profileSlug: string) {
    const res = await api.post('/conversation/start', {profile_slug: profileSlug});
    return res.data;
  },
  async getConversations(page = 1, limit = 50) {
    const res = await api.get('/conversation/list', {params: {page, limit}});
    return res.data;
  },
  async getMessages(conversationId: string, page = 1, limit = 30) {
    const res = await api.get(`/conversation/messages/${conversationId}`, {params: {page, limit}});
    return res.data;
  },
  async sendMessage(conversationId: string, message: string) {
    const res = await api.post('/conversation/send', {conversation_id: conversationId, message});
    return res.data;
  },
  async markRead(conversationId: string) {
    const res = await api.patch(`/conversation/${conversationId}/read`);
    return res.data;
  },
  async getConversationSessions(conversationId: string) {
    const res = await api.get(`/conversation/session/${conversationId}`);
    return res.data;
  },
};
