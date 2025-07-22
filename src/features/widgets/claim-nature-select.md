# ClaimNatureSelect

Un composant Combobox réutilisable pour sélectionner les natures de sinistres avec possibilité de recherche.

## Fonctionnalités

- ✅ **Recherche en temps réel** : Recherche par label, code ou description
- ✅ **Affichage du statut** : Badge optionnel pour le statut actif/inactif
- ✅ **Affichage de la description** : Option pour afficher la description dans la liste
- ✅ **Chargement automatique** : Charge les données depuis le store si nécessaire
- ✅ **États de chargement** : Spinner pendant le chargement
- ✅ **Accessibilité** : Support complet des attributs ARIA
- ✅ **Responsive** : Design adaptatif
- ✅ **TypeScript** : Types stricts

## Utilisation

### Import

```tsx
import { ClaimNatureSelect } from '@/features/widgets'
```

### Exemple basique

```tsx
import { useState } from 'react'
import { ClaimNatureSelect } from '@/features/widgets'

function MyComponent() {
  const [selectedNature, setSelectedNature] = useState<number | null>(null)

  return (
    <ClaimNatureSelect
      value={selectedNature}
      onValueChange={setSelectedNature}
      placeholder='Sélectionner une nature de sinistre...'
    />
  )
}
```

### Exemple avec statut

```tsx
<ClaimNatureSelect
  value={selectedNature}
  onValueChange={setSelectedNature}
  showStatus={true}
  placeholder='Sélectionner une nature de sinistre...'
/>
```

### Exemple avec description

```tsx
<ClaimNatureSelect
  value={selectedNature}
  onValueChange={setSelectedNature}
  showStatus={true}
  showDescription={true}
  placeholder='Sélectionner une nature de sinistre...'
/>
```

### Exemple désactivé

```tsx
<ClaimNatureSelect
  value={null}
  onValueChange={() => {}}
  disabled={true}
  placeholder='Composant désactivé...'
/>
```

## Props

| Prop              | Type                              | Défaut                                     | Description                               |
| ----------------- | --------------------------------- | ------------------------------------------ | ----------------------------------------- |
| `value`           | `number \| null`                  | `undefined`                                | ID de la nature de sinistre sélectionnée  |
| `onValueChange`   | `(value: number \| null) => void` | -                                          | Callback appelé quand la sélection change |
| `placeholder`     | `string`                          | `"Sélectionner une nature de sinistre..."` | Texte affiché quand aucune sélection      |
| `disabled`        | `boolean`                         | `false`                                    | Désactive le composant                    |
| `className`       | `string`                          | `undefined`                                | Classes CSS supplémentaires               |
| `showStatus`      | `boolean`                         | `false`                                    | Affiche le badge de statut                |
| `showDescription` | `boolean`                         | `false`                                    | Affiche la description dans la liste      |

## Structure des données

Le composant utilise les données du store `useClaimNatureStore` qui contient des objets avec cette structure :

```typescript
interface ClaimNature {
  id: number
  code: string
  label: string
  description: string
  status: {
    id: number
    code: string
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  updated_by: any
  deleted_by: any
  created_at: string
  updated_at: string
  deleted_at: string | null
}
```

## Dépendances

- `@/stores/claimNatureStore` : Store Zustand pour les natures de sinistres
- `@/components/ui/command` : Composants Command de shadcn/ui
- `@/components/ui/popover` : Composants Popover de shadcn/ui
- `@/components/ui/badge` : Composant Badge de shadcn/ui
- `lucide-react` : Icônes

## Notes techniques

- Le composant charge automatiquement les données depuis l'API si elles ne sont pas encore disponibles
- La recherche se fait côté client sur les données déjà chargées
- Le composant gère automatiquement les états de chargement et d'erreur
- Les données sont mises en cache dans le store Zustand pour éviter les rechargements inutiles
