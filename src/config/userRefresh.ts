/**
 * Configuration pour le rafraîchissement automatique des informations utilisateur
 * 
 * Cette configuration permet de personnaliser le comportement du rafraîchissement
 * périodique des permissions et informations utilisateur.
 * 
 * Les valeurs peuvent être configurées via les variables d'environnement dans le fichier .env
 * 
 * Variables d'environnement disponibles:
   * - VITE_USER_REFRESH_INTERVAL: Intervalle en millisecondes (défaut: 20000 = 20 secondes)
 * - VITE_USER_REFRESH_ONLY_VISIBLE: "true" ou "false" (défaut: "true")
 * - VITE_USER_REFRESH_ON_VISIBILITY_CHANGE: "true" ou "false" (défaut: "true")
 */

/**
 * Parse une valeur booléenne depuis une chaîne d'environnement
 */
const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Parse un nombre depuis une chaîne d'environnement
 */
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (value === undefined) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const USER_REFRESH_CONFIG = {
  /**
   * Intervalle de rafraîchissement par défaut en millisecondes
   * 
   * Configurable via VITE_USER_REFRESH_INTERVAL dans le fichier .env
   * 
   * Valeurs recommandées:
   * - 20 secondes: 20000 (défaut, pour une mise à jour rapide des permissions)
   * - 1 minute: 60000
   * - 2 minutes: 120000
   * - 5 minutes: 300000
   * - 10 minutes: 600000 (pour réduire la charge serveur)
   * 
   * @example
   * Dans .env:
   * VITE_USER_REFRESH_INTERVAL=120000
   */
  DEFAULT_INTERVAL: parseNumber(
    import.meta.env.VITE_USER_REFRESH_INTERVAL,
    20 * 1000 // 20 secondes par défaut
  ),

  /**
   * Activer le rafraîchissement uniquement quand la fenêtre est visible
   * 
   * Configurable via VITE_USER_REFRESH_ONLY_VISIBLE dans le fichier .env
   * 
   * Si activé, le rafraîchissement ne se fera que lorsque l'onglet du navigateur
   * est visible. Cela permet d'économiser les ressources quand l'utilisateur
   * n'utilise pas activement l'application.
   * 
   * @example
   * Dans .env:
   * VITE_USER_REFRESH_ONLY_VISIBLE=true
   */
  ONLY_WHEN_VISIBLE: parseBoolean(
    import.meta.env.VITE_USER_REFRESH_ONLY_VISIBLE,
    true // true par défaut
  ),

  /**
   * Activer le rafraîchissement immédiat quand la fenêtre redevient visible
   * 
   * Configurable via VITE_USER_REFRESH_ON_VISIBILITY_CHANGE dans le fichier .env
   * 
   * Si activé, les informations utilisateur seront rafraîchies immédiatement
   * quand l'utilisateur revient sur l'onglet après une absence.
   * 
   * @example
   * Dans .env:
   * VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=true
   */
  REFRESH_ON_VISIBILITY_CHANGE: parseBoolean(
    import.meta.env.VITE_USER_REFRESH_ON_VISIBILITY_CHANGE,
    true // true par défaut
  ),
} as const

