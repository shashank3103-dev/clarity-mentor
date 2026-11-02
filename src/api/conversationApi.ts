import api from './axiosInstance';

/**
 * Conversation / Chat APIs.
 *
 * Covers direct messaging between seekers and mentors, conversation listing,
 * message history, sending messages, and per-conversation session data.
 */

export interface GetMessagesParams {
  page?: number;
  limit?: number;
}

export interface SendMessagePayload {
  conversation_id: string;
  message: string;
}

/** Start a new conversation with a mentor by profile slug. */
export const startConversation = (profile_slug: string) =>
  api.post('/conversation/start', {profile_slug});

/** List all conversations for the authenticated user. */
export const listConversations = () =>
  api.get('/conversation/list');

/** Get messages in a conversation with pagination. */
export const getConversationMessages = (
  conversationId: string,
  params?: GetMessagesParams,
) => api.get(`/conversation/messages/${conversationId}`, {params});

/** Send a message within a conversation. */
export const sendMessage = (data: SendMessagePayload) =>
  api.post('/conversation/send', data);

/** Get session data associated with a specific conversation. */
export const getConversationSession = (conversationId: string) =>
  api.get(`/conversation/session/${conversationId}`);
