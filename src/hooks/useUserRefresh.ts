/* eslint-disable no-console */
import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'

interface UseUserRefreshOptions {
  /**
   * Intervalle de rafraîchissement en millisecondes (défaut: 5 minutes)
   */
  interval?: number
  /**
   * Activer le rafraîchissement uniquement quand la fenêtre est visible (défaut: true)
   */
  onlyWhenVisible?: boolean
  /**
   * Activer le rafraîchissement (défaut: true)
   */
  enabled?: boolean
  /**
   * Callback appelé après chaque rafraîchissement réussi
   */
  onRefreshSuccess?: () => void
  /**
   * Callback appelé en cas d'erreur lors du rafraîchissement
   */
  onRefreshError?: (error: unknown) => void
}

/**
 * Hook pour rafraîchir périodiquement les informations utilisateur (permissions, rôles, etc.)
 * 
 * @example
 * ```tsx
 * // Utilisation basique (rafraîchissement toutes les 5 minutes)
 * useUserRefresh()
 * 
 * // Rafraîchissement personnalisé toutes les 2 minutes
 * useUserRefresh({ interval: 2 * 60 * 1000 })
 * 
 * // Désactiver le rafraîchissement automatique
 * useUserRefresh({ enabled: false })
 * ```
 */
export function useUserRefresh(options: UseUserRefreshOptions = {}) {
  const {
    interval = 5 * 60 * 1000, // 5 minutes par défaut
    onlyWhenVisible = true,
    enabled = true,
    onRefreshSuccess,
    onRefreshError,
  } = options

  const getUserInfo = useAuthStore((state) => state.getUserInfo)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)

  // Arrêter le rafraîchissement
  const stopRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Fonction de rafraîchissement
  const refreshUserInfo = useCallback(async () => {
    // Éviter les appels multiples simultanés
    if (isRefreshingRef.current) {
      return
    }

    // Vérifier que l'utilisateur est toujours authentifié
    if (!authService.isAuthenticated() || !isAuthenticated) {
      stopRefresh()
      return
    }

    // Vérifier la visibilité de la fenêtre si activé
    if (onlyWhenVisible && typeof document !== 'undefined' && document.hidden) {
      return
    }

    try {
      isRefreshingRef.current = true
      await getUserInfo()
      onRefreshSuccess?.()
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des informations utilisateur:', error)
      onRefreshError?.(error)
      // En cas d'erreur, on arrête le rafraîchissement pour éviter les boucles
      // Le logout sera géré automatiquement par getUserInfo en cas d'erreur 401
    } finally {
      isRefreshingRef.current = false
    }
  }, [getUserInfo, isAuthenticated, onlyWhenVisible, onRefreshSuccess, onRefreshError, stopRefresh])

  // Démarrer le rafraîchissement périodique
  const startRefresh = useCallback(() => {
    if (!enabled || !isAuthenticated) {
      return
    }

    // Arrêter l'intervalle existant s'il y en a un
    stopRefresh()

    // Rafraîchir immédiatement au démarrage
    refreshUserInfo()

    // Configurer l'intervalle périodique
    intervalRef.current = setInterval(() => {
      refreshUserInfo()
    }, interval)
  }, [enabled, isAuthenticated, interval, refreshUserInfo, stopRefresh])

  // Gérer le rafraîchissement quand la fenêtre redevient visible
  useEffect(() => {
    if (!onlyWhenVisible || typeof document === 'undefined') {
      return
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && enabled) {
        // Rafraîchir immédiatement quand la fenêtre redevient visible
        refreshUserInfo()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onlyWhenVisible, isAuthenticated, enabled, refreshUserInfo])

  // Démarrer/arrêter le rafraîchissement selon l'état d'authentification
  useEffect(() => {
    if (enabled && isAuthenticated) {
      startRefresh()
    } else {
      stopRefresh()
    }

    // Nettoyage à la destruction du composant
    return () => {
      stopRefresh()
    }
  }, [enabled, isAuthenticated, startRefresh, stopRefresh])

  return {
    refreshUserInfo,
    startRefresh,
    stopRefresh,
  }
}

