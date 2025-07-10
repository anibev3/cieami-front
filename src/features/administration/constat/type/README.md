# Gestion des Types de Constat

Ce module gère les types de constat dans le système d'expertise automobile.

## Fonctionnalités

- ✅ **CRUD complet** : Création, lecture, mise à jour et suppression des types de constat
- ✅ **Pagination** : Gestion de la pagination avec métadonnées
- ✅ **Recherche** : Recherche en temps réel avec debounce
- ✅ **Validation** : Validation des formulaires côté client
- ✅ **Notifications** : Feedback utilisateur avec toast notifications
- ✅ **Composants réutilisables** : Sélecteurs pour intégration dans d'autres modules

## Structure des fichiers

```
src/features/administration/constat/type/
├── index.tsx                           # Page principale
├── components/
│   ├── data-table.tsx                  # Tableau de données avec pagination
│   ├── ascertainment-type-dialogs.tsx  # Dialogues CRUD
│   └── ascertainment-type-select.tsx   # Composants de sélection
└── README.md                           # Documentation
```

## API Endpoints

### Base URL

```
/api/v1/ascertainment-types
```

### Endpoints disponibles

| Méthode  | Endpoint                    | Description                                        |
| -------- | --------------------------- | -------------------------------------------------- |
| `GET`    | `/ascertainment-types`      | Lister tous les types de constat (avec pagination) |
| `GET`    | `/ascertainment-types/{id}` | Récupérer un type de constat par ID                |
| `POST`   | `/ascertainment-types`      | Créer un nouveau type de constat                   |
| `PUT`    | `/ascertainment-types/{id}` | Mettre à jour un type de constat                   |
| `DELETE` | `/ascertainment-types/{id}` | Supprimer un type de constat                       |

### Paramètres de requête

- `q` : Terme de recherche
- `page` : Numéro de page (défaut: 1)
- `per_page` : Nombre d'éléments par page (défaut: 20)

## Types TypeScript

### AscertainmentType

```typescript
interface AscertainmentType {
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
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}
```

### Données de création/modification

```typescript
interface CreateAscertainmentTypeData {
  label: string
  description: string
}

interface UpdateAscertainmentTypeData {
  label?: string
  description?: string
}
```

## Services

### AscertainmentTypeService

Service centralisé pour toutes les opérations API :

```typescript
// Récupérer tous les types avec pagination
await ascertainmentTypeService.getAll({ search: 'bon', page: 1 })

// Créer un nouveau type
await ascertainmentTypeService.create({
  label: 'Très bon',
  description: 'Excellent état',
})

// Mettre à jour un type
await ascertainmentTypeService.update(1, { label: 'Excellent' })

// Supprimer un type
await ascertainmentTypeService.delete(1)
```

## Store Zustand

### useAscertainmentTypeStore

Store centralisé pour la gestion de l'état :

```typescript
const {
  ascertainmentTypes, // Liste des types
  loading, // État de chargement
  error, // Erreurs
  pagination, // Métadonnées de pagination
  fetchAscertainmentTypes, // Charger les données
  createAscertainmentType, // Créer
  updateAscertainmentType, // Modifier
  deleteAscertainmentType, // Supprimer
} = useAscertainmentTypeStore()
```

## Composants

### AscertainmentTypeDataTable

Tableau de données avec :

- Pagination automatique
- Recherche en temps réel
- Actions CRUD
- États de chargement
- Gestion des erreurs

### Dialogues CRUD

- `CreateAscertainmentTypeDialog` : Création
- `EditAscertainmentTypeDialog` : Modification
- `ViewAscertainmentTypeDialog` : Visualisation
- `DeleteAscertainmentTypeDialog` : Suppression

### Composants de sélection

- `AscertainmentTypeSelect` : Sélection simple
- `AscertainmentTypeMultiSelect` : Sélection multiple

## Utilisation

### Dans une page

```tsx
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { AscertainmentTypeDataTable } from './components/data-table'

export default function MyPage() {
  const { fetchAscertainmentTypes } = useAscertainmentTypeStore()

  useEffect(() => {
    fetchAscertainmentTypes()
  }, [fetchAscertainmentTypes])

  return (
    <AscertainmentTypeDataTable
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  )
}
```

### Dans un formulaire

```tsx
import { AscertainmentTypeSelect } from '@/widgets/ascertainment-type-select'

export function MyForm() {
  const [selectedType, setSelectedType] = useState<number | null>(null)

  return (
    <AscertainmentTypeSelect
      value={selectedType}
      onValueChange={setSelectedType}
      placeholder='Choisir un type de constat'
      showStatus={true}
    />
  )
}
```

## Validation

### Côté client

- Label obligatoire
- Validation des formats
- Gestion des erreurs API

### Côté serveur

- Validation des données
- Gestion des contraintes
- Messages d'erreur localisés

## États et statuts

### Statuts disponibles

- `active` : Actif
- `inactive` : Inactif

### Gestion des états

- Loading states
- Error states
- Success feedback
- Optimistic updates

## Améliorations futures

- [ ] Filtres avancés (par statut, date de création, etc.)
- [ ] Export des données (CSV, Excel)
- [ ] Import en lot
- [ ] Historique des modifications
- [ ] Permissions granulaires
- [ ] Audit trail
- [ ] Cache intelligent
- [ ] Synchronisation en temps réel

## Dépendances

- `@/lib/axios` : Client HTTP
- `@/components/ui/*` : Composants UI
- `@/stores/ascertainmentTypes` : Store Zustand
- `@/utils/format-date` : Utilitaires de formatage
- `@/hooks/use-debounce` : Hook de debounce
- `sonner` : Notifications toast
- `lucide-react` : Icônes
