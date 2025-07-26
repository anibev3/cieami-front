# 📊 Système de Compteurs Dynamiques - Sidebar

## Vue d'ensemble

Le système de compteurs dynamiques permet d'afficher en temps réel les statistiques dans la sidebar et le menu de commandes, avec navigation directe vers les pages filtrées par statut.

## 🏗️ Architecture

### 1. **Types et Interfaces** (`src/components/layout/types.ts`)

```typescript
export interface NavItemCounter {
  key: string // Clé unique (ex: 'all', 'open', 'realized')
  value: number // Valeur numérique du compteur
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' // Style du badge
}

interface BaseNavItem {
  // ... autres propriétés
  dynamicCounters?: NavItemCounter[] // Compteurs à afficher
  showCounters?: boolean // Activer/désactiver l'affichage
}
```

### 2. **Hook de Gestion** (`src/components/layout/sidebar-counters-hook.tsx`)

Le hook `useSidebarCounters()` :
- Récupère les statistiques depuis le dashboard store
- Génère les compteurs pour chaque type d'entité
- Applique automatiquement les compteurs aux éléments de navigation

```typescript
const {
  applyCountersToNavGroups,
  getAssignmentCounters,
  getUserCounters,
  hasStats
} = useSidebarCounters()
```

### 3. **Composant de Navigation** (`src/components/layout/nav-group.tsx`)

- Affiche les compteurs sous forme de sous-menu dépliable
- Génère automatiquement les URLs avec paramètres de statut
- Supporte la navigation directe vers les pages filtrées

## 🎯 Fonctionnalités

### ✅ Compteurs Automatiques

Les compteurs sont automatiquement appliqués aux éléments suivants :

| Élément | URL | Compteurs disponibles |
|---------|-----|----------------------|
| **Dossiers** | `/assignments` | Tous, Ouverts, Réalisés, Rédigés, Validés, Fermés |
| **Utilisateurs** | `/administration/users` | Total, Actifs, Inactifs |
| **Assureurs** | `/gestion/assureurs` | Total, Actifs, Inactifs |
| **Réparateurs** | `/gestion/reparateurs` | Total, Actifs, Inactifs |
| **Véhicules** | `/administration/vehicles` | Total, Actifs, Inactifs |

### 🔗 Navigation par Statut

Cliquer sur un compteur navigue vers la page avec le filtre approprié :

```
/assignments → Tous les dossiers
/assignments?status=opened → Dossiers ouverts
/assignments?status=realized → Dossiers réalisés
/assignments?status=edited → Dossiers rédigés
/assignments?status=validated → Dossiers validés
/assignments?status=closed → Dossiers fermés
```

### 🎨 Styles Visuels

Les compteurs utilisent différents variants de badges :
- `secondary` : Compteurs généraux (par défaut)
- `default` : Éléments actifs/ouverts
- `destructive` : Éléments inactifs/problématiques

## 📱 Interface Utilisateur

### Structure de la Sidebar

```
Gestion des dossiers
├── Dossiers ▼
│   ├── Tous les dossiers        [42]
│   ├── Dossiers ouverts         [12]
│   ├── Dossiers réalisés        [8]
│   ├── Dossiers rédigés         [15]
│   ├── Dossiers validés         [6]
│   └── Dossiers fermés          [1]
└── Autres éléments...

Administration
├── Utilisateurs ▼
│   ├── Total                    [25]
│   ├── Actifs                   [23]
│   └── Inactifs                 [2]
```

### Command Menu

Le menu de commandes (`Ctrl+K`) affiche aussi les compteurs :
- Badge avec le total à côté du nom de l'élément
- Navigation directe vers les pages

## 🔧 Configuration

### Ajouter de Nouveaux Compteurs

1. **Étendre le hook** (`sidebar-counters-hook.tsx`) :

```typescript
const getNewEntityCounters = useMemo((): NavItemCounter[] => {
  if (!stats?.newEntity) return []
  
  return [
    {
      key: 'total',
      value: stats.newEntity.total.value,
      variant: 'secondary'
    },
    {
      key: 'active',
      value: stats.newEntity.active.value,
      variant: 'default'
    }
  ]
}, [stats?.newEntity])
```

2. **Appliquer aux éléments** dans `applyCountersToNavItems` :

```typescript
if (subItem.url === '/new-entity-path') {
  return {
    ...subItem,
    showCounters: true,
    dynamicCounters: getNewEntityCounters
  }
}
```

3. **Configurer les labels** dans `CountersSubMenu` :

```typescript
const getCounterLabel = (key: string) => {
  const labelMap: Record<string, string> = {
    // ... existants
    'new_status': 'Nouveau Statut'
  }
  return labelMap[key] || key
}
```

### Personnaliser les URLs

Modifier le mapping dans `getStatusUrl` :

```typescript
const statusMap: Record<string, string> = {
  'open': 'opened',        // /assignments?status=opened
  'custom': 'my-status',   // /assignments?status=my-status
  // ...
}
```

## 🔄 Intégration avec les Pages

### Page des Assignments

La page `/assignments` lit automatiquement le paramètre `status` de l'URL :

```typescript
// Initialiser le statut depuis l'URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const statusParam = urlParams.get('status')
  
  if (statusParam) {
    const statusMap: Record<string, string> = {
      'opened': 'open',
      'realized': 'realized',
      // ...
    }
    const mappedStatus = statusMap[statusParam] || statusParam
    setActiveTab(mappedStatus)
    setSelectedStatuses([mappedStatus])
  }
}, [setActiveTab])
```

## 🚀 Avantages

### ✅ Temps Réel
- Compteurs mis à jour automatiquement
- Synchronisation avec le dashboard

### ✅ Navigation Intuitive
- Clic direct vers les pages filtrées
- URLs bookmarkables avec filtres

### ✅ Performance
- Memoization des compteurs
- Chargement intelligent des stats

### ✅ ACL Intégré
- Respecte les permissions utilisateur
- Filtrage automatique des éléments

### ✅ Extensible
- Facile d'ajouter de nouveaux compteurs
- Configuration centralisée

## 🎨 Personnalisation Visuelle

### Variants de Badges

```typescript
// Compteur normal
{ key: 'total', value: 42, variant: 'secondary' }

// Compteur d'alerte
{ key: 'expired', value: 5, variant: 'destructive' }

// Compteur actif
{ key: 'active', value: 38, variant: 'default' }
```

### Styles CSS

Les compteurs utilisent les classes Tailwind :
- `rounded-full px-1 py-0 text-xs ml-auto`
- Variants de couleurs selon le type

## 📊 Métriques Supportées

### Dossiers d'Assignation
- Total des dossiers
- Dossiers ouverts
- Dossiers réalisés
- Dossiers rédigés
- Dossiers validés
- Dossiers fermés

### Entités
- Utilisateurs (total, actifs, inactifs)
- Assureurs (total, actifs, inactifs)
- Réparateurs (total, actifs, inactifs)
- Véhicules (total, actifs, inactifs)

## 🔮 Extensions Futures

### Possibilités d'Extension

1. **Compteurs en Temps Réel** avec WebSockets
2. **Graphiques Inline** dans la sidebar
3. **Alertes Visuelles** pour les seuils critiques
4. **Historique** des métriques
5. **Filtres Avancés** avec combinaisons de statuts

### API Future

```typescript
// Compteurs avec tendances
interface EnhancedNavItemCounter extends NavItemCounter {
  trend?: 'up' | 'down' | 'stable'
  percentage?: number
  alert?: boolean
}
```

## 📝 Notes Importantes

- Les statistiques sont chargées automatiquement au montage de la sidebar
- Le système respecte entièrement les permissions ACL
- Les URLs générées sont compatibles avec le système de routage existant
- La performance est optimisée avec `useMemo` pour éviter les recalculs inutiles

---

**🎉 Résultat** : Une sidebar intelligente qui affiche les métriques en temps réel avec navigation directe vers les contenus filtrés ! 