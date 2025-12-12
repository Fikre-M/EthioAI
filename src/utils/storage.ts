import { STORAGE_KEYS } from './constants'

/**
 * Storage utility functions for managing localStorage
 */

// Token management
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

// User management
export const setUser = (user: unknown): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const getUser = <T>(): T | null => {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

// Language management
export const setLanguage = (language: string): void => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
}

export const getLanguage = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE)
}

// Clear all auth data
export const clearAuth = (): void => {
  removeToken()
  removeUser()
}

// Clear all storage
export const clearAllStorage = (): void => {
  localStorage.clear()
}
