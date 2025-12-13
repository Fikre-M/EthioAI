import { api } from '@api/axios.config'

// Types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  conversationId?: string
}

export interface SendMessageRequest {
  message: string
  conversationId?: string
  context?: Record<string, any>
}

export interface SendMessageResponse {
  id: string
  content: string
  role: 'assistant'
  timestamp: string
  conversationId: string
}

export interface ChatHistoryResponse {
  conversationId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  conversations: Array<{
    id: string
    title: string
    lastMessage: string
    messageCount: number
    createdAt: string
    updatedAt: string
  }>
  total: number
}

// Chat Service
export const chatService = {
  /**
   * Send a message to the AI and get a response
   * @param data - Message content and optional conversation ID
   * @returns AI response
   */
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    try {
      const response = await api.post<SendMessageResponse>('/chat/messages', {
        message: data.message,
        conversationId: data.conversationId,
        context: data.context,
      })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to send message. Please try again.'
      )
    }
  },

  /**
   * Get chat history for a specific conversation
   * @param conversationId - Conversation ID
   * @returns Chat history with all messages
   */
  getChatHistory: async (conversationId: string): Promise<ChatHistoryResponse> => {
    try {
      const response = await api.get<ChatHistoryResponse>(
        `/chat/conversations/${conversationId}`
      )
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load chat history.'
      )
    }
  },

  /**
   * Get list of all conversations for the current user
   * @param params - Optional pagination and filter params
   * @returns List of conversations
   */
  getConversations: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ConversationListResponse> => {
    try {
      const response = await api.get<ConversationListResponse>('/chat/conversations', {
        params,
      })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load conversations.'
      )
    }
  },

  /**
   * Create a new conversation
   * @param title - Optional conversation title
   * @returns New conversation ID
   */
  createConversation: async (title?: string): Promise<{ id: string; title: string }> => {
    try {
      const response = await api.post<{ id: string; title: string }>(
        '/chat/conversations',
        { title }
      )
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create conversation.'
      )
    }
  },

  /**
   * Update conversation title
   * @param conversationId - Conversation ID
   * @param title - New title
   */
  updateConversation: async (
    conversationId: string,
    title: string
  ): Promise<void> => {
    try {
      await api.patch(`/chat/conversations/${conversationId}`, { title })
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update conversation.'
      )
    }
  },

  /**
   * Delete a conversation and all its messages
   * @param conversationId - Conversation ID
   */
  deleteConversation: async (conversationId: string): Promise<void> => {
    try {
      await api.delete(`/chat/conversations/${conversationId}`)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete conversation.'
      )
    }
  },

  /**
   * Clear chat session (delete all messages in a conversation)
   * @param conversationId - Conversation ID
   */
  clearChatSession: async (conversationId: string): Promise<void> => {
    try {
      await api.delete(`/chat/conversations/${conversationId}/messages`)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to clear chat session.'
      )
    }
  },

  /**
   * Clear all conversations for the current user
   */
  clearAllConversations: async (): Promise<void> => {
    try {
      await api.delete('/chat/conversations')
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to clear all conversations.'
      )
    }
  },

  /**
   * Get AI suggestions based on context
   * @param context - Context for suggestions (e.g., current location, interests)
   * @returns Array of suggested questions
   */
  getSuggestions: async (context?: Record<string, any>): Promise<string[]> => {
    try {
      const response = await api.post<{ suggestions: string[] }>(
        '/chat/suggestions',
        { context }
      )
      return response.data.suggestions
    } catch (error: any) {
      // Return default suggestions on error
      return [
        'What are the best tours in Ethiopia?',
        'Tell me about Ethiopian coffee',
        'What should I visit in Lalibela?',
      ]
    }
  },

  /**
   * Rate a message (feedback for AI improvement)
   * @param messageId - Message ID
   * @param rating - Rating (1-5 or thumbs up/down)
   * @param feedback - Optional feedback text
   */
  rateMessage: async (
    messageId: string,
    rating: number | 'up' | 'down',
    feedback?: string
  ): Promise<void> => {
    try {
      await api.post(`/chat/messages/${messageId}/rating`, {
        rating,
        feedback,
      })
    } catch (error: any) {
      // Silent fail for ratings
      console.error('Failed to submit rating:', error)
    }
  },

  /**
   * Report a message (for inappropriate content)
   * @param messageId - Message ID
   * @param reason - Reason for reporting
   */
  reportMessage: async (messageId: string, reason: string): Promise<void> => {
    try {
      await api.post(`/chat/messages/${messageId}/report`, { reason })
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to report message.'
      )
    }
  },

  /**
   * Export conversation as text or JSON
   * @param conversationId - Conversation ID
   * @param format - Export format ('text' | 'json')
   * @returns Exported data
   */
  exportConversation: async (
    conversationId: string,
    format: 'text' | 'json' = 'text'
  ): Promise<string> => {
    try {
      const response = await api.get<{ data: string }>(
        `/chat/conversations/${conversationId}/export`,
        { params: { format } }
      )
      return response.data.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to export conversation.'
      )
    }
  },
}

// Simulated responses for development (remove when backend is ready)
export const simulatedChatService = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = getSimulatedResponse(data.message)

    return {
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      conversationId: data.conversationId || 'default',
    }
  },

  getChatHistory: async (conversationId: string): Promise<ChatHistoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      conversationId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  clearChatSession: async (_conversationId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Simulated clear
  },
}

// Simulated AI responses
function getSimulatedResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I help you explore Ethiopia today?'
  }
  if (lowerMessage.includes('tour') || lowerMessage.includes('trip')) {
    return 'Ethiopia offers amazing tours! Some popular options include:\n\n🏛️ Historic Route - Visit Lalibela, Gondar, and Axum\n🏔️ Simien Mountains Trek - Stunning mountain landscapes\n🌋 Danakil Depression - One of the hottest places on Earth\n🎭 Omo Valley - Experience diverse tribal cultures\n\nWould you like more details about any of these?'
  }
  if (lowerMessage.includes('lalibela')) {
    return "Lalibela is home to 11 incredible rock-hewn churches carved from solid rock in the 12th century. It's a UNESCO World Heritage site and one of Ethiopia's most sacred places. The churches are still active places of worship today!"
  }
  if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
    return 'Ethiopian cuisine is delicious and unique! Must-try dishes include:\n\n🍽️ Injera - Spongy sourdough flatbread\n🥘 Doro Wat - Spicy chicken stew\n🌱 Shiro - Chickpea stew\n☕ Ethiopian Coffee - The birthplace of coffee!\n\nWould you like restaurant recommendations?'
  }
  if (lowerMessage.includes('coffee')) {
    return "Ethiopia is the birthplace of coffee! ☕ The traditional Ethiopian coffee ceremony is a beautiful cultural experience. Coffee beans are roasted, ground, and brewed in front of you. It's served in three rounds: Abol, Tona, and Baraka. A must-experience tradition!"
  }
  if (lowerMessage.includes('when') || lowerMessage.includes('best time')) {
    return "The best time to visit Ethiopia is during the dry season from October to March. The weather is pleasant, and it's perfect for trekking and sightseeing. September is also great if you want to experience Meskel, one of Ethiopia's biggest festivals!"
  }
  if (lowerMessage.includes('language')) {
    return "Ethiopia has over 80 languages! The official language is Amharic (አማርኛ), but Oromo (Afaan Oromoo) and Tigrinya are also widely spoken. English is commonly used in tourism and business. Don't worry - most tour guides speak English!"
  }

  return "That's a great question! Ethiopia has so much to offer. Could you tell me more about what you're interested in? I can help with:\n\n• Tour recommendations\n• Cultural information\n• Travel tips\n• Destination details\n• Food and dining\n• Best times to visit"
}

export default chatService
