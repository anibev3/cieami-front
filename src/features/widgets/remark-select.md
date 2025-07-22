# RemarkSelect

Un composant Combobox réutilisable pour sélectionner les remarques d'experts avec possibilité de recherche.

## Fonctionnalités

- ✅ **Recherche en temps réel** : Recherche par label
- ✅ **Affichage du statut** : Badge optionnel pour le statut actif/inactif
- ✅ **Affichage de la description** : Option pour afficher la description dans la liste
- ✅ **Chargement automatique** : Charge les données depuis le store si nécessaire
- ✅ **États de chargement** : Spinner pendant le chargement
- ✅ **Accessibilité** : Support complet des attributs ARIA
- ✅ **Responsive** : Design adaptatif
- ✅ **TypeScript** : Types stricts
- ✅ **Icône distinctive** : Icône FileText pour identifier les remarques

## Utilisation

### Import

```tsx
import { RemarkSelect } from '@/features/widgets'
```

### Exemple basique

```tsx
import { useState } from 'react'
import { RemarkSelect } from '@/features/widgets'

function MyComponent() {
  const [selectedRemark, setSelectedRemark] = useState<number | null>(null)

  return (
    <RemarkSelect
      value={selectedRemark}
      onValueChange={setSelectedRemark}
      placeholder='Sélectionner une remarque...'
    />
  )
}
```

### Exemple avec statut

```tsx
<RemarkSelect
  value={selectedRemark}
  onValueChange={setSelectedRemark}
  showStatus={true}
  placeholder='Sélectionner une remarque...'
/>
```

### Exemple avec description

```tsx
<RemarkSelect
  value={selectedRemark}
  onValueChange={setSelectedRemark}
  showStatus={true}
  showDescription={true}
  placeholder='Sélectionner une remarque...'
/>
```

### Exemple désactivé

```tsx
<RemarkSelect
  value={null}
  onValueChange={() => {}}
  disabled={true}
  placeholder='Composant désactivé...'
/>
```

## Props

| Prop              | Type                              | Défaut                           | Description                               |
| ----------------- | --------------------------------- | -------------------------------- | ----------------------------------------- |
| `value`           | `number \| null`                  | `undefined`                      | ID de la remarque sélectionnée            |
| `onValueChange`   | `(value: number \| null) => void` | -                                | Callback appelé quand la sélection change |
| `placeholder`     | `string`                          | `"Sélectionner une remarque..."` | Texte affiché quand aucune sélection      |
| `disabled`        | `boolean`                         | `false`                          | Désactive le composant                    |
| `className`       | `string`                          | `undefined`                      | Classes CSS supplémentaires               |
| `showStatus`      | `boolean`                         | `false`                          | Affiche le badge de statut                |
| `showDescription` | `boolean`                         | `false`                          | Affiche la description dans la liste      |

## Structure des données

Le composant utilise les données du store `useRemarkStore` qui contient des objets avec cette structure :

```typescript
interface Remark {
  id: number
  label: string
  description: string
  status: {
    id: number
    code: string | null
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_at: string
  updated_at: string
}
```

## Dépendances

- `@/stores/remarkStore` : Store Zustand pour les remarques
- `@/components/ui/command` : Composants Command de shadcn/ui
- `@/components/ui/popover` : Composants Popover de shadcn/ui
- `@/components/ui/badge` : Composant Badge de shadcn/ui
- `lucide-react` : Icônes

## Notes techniques

- Le composant charge automatiquement les données depuis l'API si elles ne sont pas encore disponibles
- La recherche se fait côté client sur les données déjà chargées
- Le composant gère automatiquement les états de chargement et d'erreur
- Les données sont mises en cache dans le store Zustand pour éviter les rechargements inutiles
- La description HTML est automatiquement nettoyée pour l'affichage dans la liste
- Icône FileText distinctive pour identifier facilement les remarques

## Différences avec ClaimNatureSelect

- **Icône distinctive** : FileText au lieu de l'icône par défaut
- **Recherche simplifiée** : Recherche uniquement par label (pas de code)
- **Description HTML** : Gestion spéciale du contenu HTML dans la description
- **Couleur d'icône** : Icône bleue pour différencier des autres sélecteurs
