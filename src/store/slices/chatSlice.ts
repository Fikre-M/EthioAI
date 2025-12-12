import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Types
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean
  isTyping: boolean
  error: string | null
  lastMessageId: string | null
  chatLanguage: string
  autoDetectLanguage: boolean
  translationEnabled: boolean
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  messages: [
    {
      id: '1',
      content: "Hello! I'm your AI guide for Ethiopia. I can help you discover amazing destinations, plan your trips, learn about Ethiopian culture, and answer any questions you have. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
      status: 'sent',
    },
  ],
  isLoading: false,
  isTyping: false,
  error: null,
  lastMessageId: '1',
  chatLanguage: 'en',
  autoDetectLanguage: true,
  translationEnabled: false,
}

// Import chat service
import { simulatedChatService } from '@services/chatService'

// Async thunks
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessage',
  async (
    { content, conversationId }: { content: string; conversationId?: string },
    { rejectWithValue }
  ) => {
    try {
      // Use simulated service (replace with real chatService when backend is ready)
      const response = await simulatedChatService.sendMessage({
        message: content,
        conversationId,
      })

      return {
        content: response.content,
        timestamp: new Date(response.timestamp),
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message. Please try again.')
    }
  }
)

// Simulated AI responses moved to chatService.ts
// This function is no longer used here
/* const getSimulatedResponse = (userMessage: string): string => {
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
} */

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Add user message
    addUserMessage: (state, action: PayloadAction<string>) => {
      const message: Message = {
        id: Date.now().toString(),
        content: action.payload,
        role: 'user',
        timestamp: new Date(),
        status: 'sending',
      }
      state.messages.push(message)
      state.lastMessageId = message.id
      state.error = null
    },

    // Update message status
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'sending' | 'sent' | 'error' }>
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id)
      if (message) {
        message.status = action.payload.status
      }
    },

    // Add AI message
    addAIMessage: (state, action: PayloadAction<{ content: string; timestamp: Date }>) => {
      const message: Message = {
        id: (Date.now() + 1).toString(),
        content: action.payload.content,
        role: 'assistant',
        timestamp: action.payload.timestamp,
        status: 'sent',
      }
      state.messages.push(message)
      state.lastMessageId = message.id
    },

    // Set typing state
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },

    // Clear messages
    clearMessages: (state) => {
      state.messages = [
        {
          id: Date.now().toString(),
          content: 'Chat cleared! How can I help you explore Ethiopia?',
          role: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        },
      ]
      state.error = null
      state.isTyping = false
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Create new conversation
    createConversation: (state, action: PayloadAction<string>) => {
      const conversation: Conversation = {
        id: Date.now().toString(),
        title: action.payload || 'New Conversation',
        messages: [...state.messages],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      state.conversations.push(conversation)
      state.currentConversationId = conversation.id
    },

    // Load conversation
    loadConversation: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find((c) => c.id === action.payload)
      if (conversation) {
        state.messages = conversation.messages
        state.currentConversationId = conversation.id
        state.error = null
      }
    },

    // Delete conversation
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload)
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null
        state.messages = initialState.messages
      }
    },

    // Update conversation
    updateConversation: (state) => {
      if (state.currentConversationId) {
        const conversation = state.conversations.find(
          (c) => c.id === state.currentConversationId
        )
        if (conversation) {
          conversation.messages = [...state.messages]
          conversation.updatedAt = new Date()
          // Update title based on first user message if not set
          if (conversation.title === 'New Conversation') {
            const firstUserMessage = state.messages.find((m) => m.role === 'user')
            if (firstUserMessage) {
              conversation.title = firstUserMessage.content.slice(0, 50) + '...'
            }
          }
        }
      }
    },

    // Set chat language
    setChatLanguage: (state, action: PayloadAction<string>) => {
      state.chatLanguage = action.payload
    },

    // Toggle auto-detect language
    setAutoDetectLanguage: (state, action: PayloadAction<boolean>) => {
      state.autoDetectLanguage = action.payload
    },

    // Toggle translation
    setTranslationEnabled: (state, action: PayloadAction<boolean>) => {
      state.translationEnabled = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message pending
      .addCase(sendMessageAsync.pending, (state) => {
        state.isLoading = true
        state.isTyping = true
        state.error = null
        // Update last user message status to 'sending'
        const lastMessage = state.messages[state.messages.length - 1]
        if (lastMessage && lastMessage.role === 'user') {
          lastMessage.status = 'sending'
        }
      })
      // Send message fulfilled
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.isTyping = false
        // Update last user message status to 'sent'
        const lastUserMessage = [...state.messages]
          .reverse()
          .find((m) => m.role === 'user')
        if (lastUserMessage) {
          lastUserMessage.status = 'sent'
        }
        // Add AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: action.payload.content,
          role: 'assistant',
          timestamp: action.payload.timestamp,
          status: 'sent',
        }
        state.messages.push(aiMessage)
        state.lastMessageId = aiMessage.id
      })
      // Send message rejected
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isTyping = false
        state.error = action.payload as string
        // Update last user message status to 'error'
        const lastUserMessage = [...state.messages]
          .reverse()
          .find((m) => m.role === 'user')
        if (lastUserMessage) {
          lastUserMessage.status = 'error'
        }
      })
  },
})

// Actions
export const {
  addUserMessage,
  updateMessageStatus,
  addAIMessage,
  setTyping,
  clearMessages,
  clearError,
  createConversation,
  loadConversation,
  deleteConversation,
  updateConversation,
  setChatLanguage,
  setAutoDetectLanguage,
  setTranslationEnabled,
} = chatSlice.actions

// Selectors
export const selectMessages = (state: RootState) => state.chat.messages
export const selectIsLoading = (state: RootState) => state.chat.isLoading
export const selectIsTyping = (state: RootState) => state.chat.isTyping
export const selectError = (state: RootState) => state.chat.error
export const selectConversations = (state: RootState) => state.chat.conversations
export const selectCurrentConversationId = (state: RootState) =>
  state.chat.currentConversationId
export const selectLastMessageId = (state: RootState) => state.chat.lastMessageId
export const selectChatLanguage = (state: RootState) => state.chat.chatLanguage
export const selectAutoDetectLanguage = (state: RootState) => state.chat.autoDetectLanguage
export const selectTranslationEnabled = (state: RootState) => state.chat.translationEnabled

// Reducer
export default chatSlice.reducer
