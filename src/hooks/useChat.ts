import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import type { AppDispatch } from '@store/store'
import {
  selectMessages,
  selectIsLoading,
  selectIsTyping,
  selectError,
  selectConversations,
  selectCurrentConversationId,
  selectLastMessageId,
  selectChatLanguage,
  selectAutoDetectLanguage,
  selectTranslationEnabled,
  addUserMessage,
  sendMessageAsync,
  clearMessages,
  clearError,
  createConversation,
  loadConversation,
  deleteConversation,
  updateConversation,
  setChatLanguage,
  setAutoDetectLanguage,
  setTranslationEnabled,
} from '@store/slices/chatSlice'

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Selectors
  const messages = useSelector(selectMessages)
  const isLoading = useSelector(selectIsLoading)
  const isTyping = useSelector(selectIsTyping)
  const error = useSelector(selectError)
  const conversations = useSelector(selectConversations)
  const currentConversationId = useSelector(selectCurrentConversationId)
  const lastMessageId = useSelector(selectLastMessageId)
  const chatLanguage = useSelector(selectChatLanguage)
  const autoDetectLanguage = useSelector(selectAutoDetectLanguage)
  const translationEnabled = useSelector(selectTranslationEnabled)

  // Actions
  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message immediately
      dispatch(addUserMessage(content))
      // Send to AI and get response
      await dispatch(
        sendMessageAsync({
          content,
          conversationId: currentConversationId || undefined,
        })
      )
      // Update conversation if exists
      if (currentConversationId) {
        dispatch(updateConversation())
      }
    },
    [dispatch, currentConversationId]
  )

  const clearChat = useCallback(() => {
    dispatch(clearMessages())
  }, [dispatch])

  const dismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const saveConversation = useCallback(
    (title?: string) => {
      dispatch(createConversation(title || 'New Conversation'))
    },
    [dispatch]
  )

  const openConversation = useCallback(
    (conversationId: string) => {
      dispatch(loadConversation(conversationId))
    },
    [dispatch]
  )

  const removeConversation = useCallback(
    (conversationId: string) => {
      dispatch(deleteConversation(conversationId))
    },
    [dispatch]
  )

  const changeChatLanguage = useCallback(
    (language: string) => {
      dispatch(setChatLanguage(language))
    },
    [dispatch]
  )

  const toggleAutoDetectLanguage = useCallback(
    (enabled: boolean) => {
      dispatch(setAutoDetectLanguage(enabled))
    },
    [dispatch]
  )

  const toggleTranslation = useCallback(
    (enabled: boolean) => {
      dispatch(setTranslationEnabled(enabled))
    },
    [dispatch]
  )

  return {
    // State
    messages,
    isLoading,
    isTyping,
    error,
    conversations,
    currentConversationId,
    lastMessageId,
    chatLanguage,
    autoDetectLanguage,
    translationEnabled,
    // Actions
    sendMessage,
    clearChat,
    dismissError,
    saveConversation,
    openConversation,
    removeConversation,
    changeChatLanguage,
    toggleAutoDetectLanguage,
    toggleTranslation,
  }
}
