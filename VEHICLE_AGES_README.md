# Intégration des Âges de Véhicules

Ce document décrit l'intégration complète des âges de véhicules dans l'application Expert Auto, incluant l'API, le store, les composants et l'interface d'administration.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [API](#api)
- [Store Zustand](#store-zustand)
- [Composants](#composants)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [Personnalisation](#personnalisation)
- [Dépannage](#dépannage)
- [Ressources](#ressources)

## 🎯 Vue d'ensemble

L'intégration des âges de véhicules permet de :
- Gérer les âges de véhicules via une interface d'administration complète
- Utiliser un composant de sélection réutilisable dans les formulaires
- Effectuer toutes les opérations CRUD (Create, Read, Update, Delete)
- Rechercher et filtrer les âges de véhicules
- Afficher les âges avec leurs valeurs en mois

## 🔌 API

### Endpoints

```typescript
// Base URL: /api/v1/vehicle-ages

// Récupérer tous les âges de véhicules
GET /vehicle-ages

// Récupérer un âge de véhicule par ID
GET /vehicle-ages/{id}

// Créer un nouvel âge de véhicule
POST /vehicle-ages

// Mettre à jour un âge de véhicule
PUT /vehicle-ages/{id}

// Supprimer un âge de véhicule
DELETE /vehicle-ages/{id}
```

### Structure des données

```typescript
interface VehicleAge {
  id: number
  value: number          // Valeur en mois
  label: string          // Label affiché (ex: "24 mois")
  description: string    // Description optionnelle
  status: {
    id: number
    code: string         // "active" ou "inactive"
    label: string        // "Actif(ve)" ou "Inactif(ve)"
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  deleted_at: string | null
  created_at: string
  updated_at: string
}
```

### Exemples d'utilisation API

```bash
# Créer un âge de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-ages \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "value": 24,
    "label": "24 mois",
    "description": "Véhicule de 2 ans"
  }'

# Mettre à jour un âge de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-ages/{id} \
  --request PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "value": 36,
    "label": "36 mois",
    "description": "Véhicule de 3 ans"
  }'

# Supprimer un âge de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-ages/{id} \
  --request DELETE \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

## 🗃️ Store Zustand

### Fichier : `src/stores/vehicleAgesStore.ts`

Le store gère l'état global des âges de véhicules avec les fonctionnalités suivantes :

```typescript
interface VehicleAgesState {
  // État
  vehicleAges: VehicleAge[]
  loading: boolean
  error: string | null
  selectedVehicleAge: VehicleAge | null
  
  // Actions
  fetchVehicleAges: () => Promise<void>
  createVehicleAge: (data: CreateVehicleAgeData) => Promise<void>
  updateVehicleAge: (id: number, data: UpdateVehicleAgeData) => Promise<void>
  deleteVehicleAge: (id: number) => Promise<void>
  setSelectedVehicleAge: (vehicleAge: VehicleAge | null) => void
  clearError: () => void
}
```

### Utilisation du store

```typescript
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'

function MyComponent() {
  const { 
    vehicleAges, 
    loading, 
    fetchVehicleAges, 
    createVehicleAge 
  } = useVehicleAgesStore()

  useEffect(() => {
    fetchVehicleAges()
  }, [])

  const handleCreate = async () => {
    await createVehicleAge({
      value: 24,
      label: "24 mois",
      description: "Véhicule de 2 ans"
    })
  }

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        vehicleAges.map(age => (
          <div key={age.id}>{age.label}</div>
        ))
      )}
    </div>
  )
}
```

## 🧩 Composants

### 1. Composant de sélection réutilisable

**Fichier :** `src/features/widgets/vehicle-age-select.tsx`

Composant de sélection avec chargement automatique des données :

```tsx
import { VehicleAgeSelect } from '@/features/widgets'

function MyForm() {
  const [selectedAge, setSelectedAge] = useState('')

  return (
    <VehicleAgeSelect
      value={selectedAge}
      onValueChange={setSelectedAge}
      placeholder="Sélectionner un âge"
      showDescription={true}
    />
  )
}
```

**Props disponibles :**
- `value?: string` - Valeur sélectionnée (ID de l'âge)
- `onValueChange: (value: string) => void` - Callback de changement
- `placeholder?: string` - Placeholder personnalisé
- `disabled?: boolean` - État désactivé
- `className?: string` - Classes CSS personnalisées
- `showDescription?: boolean` - Afficher les descriptions

### 2. Page d'administration

**Fichier :** `src/features/administration/vehicle-ages/index.tsx`

Interface complète de gestion des âges de véhicules avec :
- Tableau de données avec recherche
- Boutons d'actions (Créer, Voir, Modifier, Supprimer)
- Dialogues modaux pour toutes les opérations
- Gestion des états de chargement et d'erreur

### 3. Composants de support

- **DataTable** : Tableau avec recherche et actions
- **VehicleAgesDialogs** : Dialogues pour CRUD
- **VehicleAgesPrimaryButtons** : Boutons d'actions principales

## 💻 Utilisation

### 1. Utilisation du composant de sélection

```tsx
import { VehicleAgeSelect } from '@/features/widgets'
import { useForm } from 'react-hook-form'

function VehicleForm() {
  const { register, setValue, watch } = useForm()
  const selectedAge = watch('vehicleAgeId')

  return (
    <form>
      <div className="space-y-4">
        <div>
          <label>Âge du véhicule</label>
          <VehicleAgeSelect
            value={selectedAge}
            onValueChange={(value) => setValue('vehicleAgeId', value)}
            placeholder="Sélectionner l'âge du véhicule"
            showDescription={true}
          />
        </div>
        
        {/* Autres champs du formulaire */}
      </div>
    </form>
  )
}
```

### 2. Accès à l'interface d'administration

L'interface d'administration est accessible via la route :
```
/administration/vehicle-ages
```

### 3. Intégration dans les formulaires existants

Pour intégrer le sélecteur d'âge dans un formulaire de véhicule existant :

```tsx
import { VehicleAgeSelect } from '@/features/widgets'

// Dans le formulaire de véhicule
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label>Marque</Label>
    <BrandSelect {...brandProps} />
  </div>
  <div>
    <Label>Âge</Label>
    <VehicleAgeSelect
      value={formData.vehicleAgeId}
      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleAgeId: value }))}
      placeholder="Sélectionner l'âge"
    />
  </div>
</div>
```

## ⚙️ Configuration

### 1. Configuration du service API

Le service utilise l'instance axios configurée dans `src/lib/axios.ts`. Assurez-vous que l'URL de base et les headers d'authentification sont correctement configurés.

### 2. Configuration des types

Les types TypeScript sont définis dans `src/services/vehicleAgeService.ts` et peuvent être étendus selon les besoins :

```typescript
// Extension possible des types
interface VehicleAgeWithRelations extends VehicleAge {
  // Propriétés supplémentaires si nécessaire
  relatedVehicles?: Vehicle[]
  statistics?: AgeStatistics
}
```

### 3. Configuration des notifications

Le store utilise `sonner` pour les notifications. Assurez-vous que le composant `Toaster` est présent dans votre application :

```tsx
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      {/* Votre application */}
      <Toaster />
    </>
  )
}
```

## 🎨 Personnalisation

### 1. Personnalisation du style

Le composant utilise les classes Tailwind CSS et peut être personnalisé :

```tsx
<VehicleAgeSelect
  className="w-full max-w-md"
  // Autres props...
/>
```

### 2. Personnalisation des messages

Les messages de succès et d'erreur peuvent être personnalisés dans le store :

```typescript
// Dans vehicleAgesStore.ts
toast.success('Âge de véhicule créé avec succès') // Personnalisable
toast.error('Erreur lors de la création') // Personnalisable
```

### 3. Ajout de fonctionnalités

Pour ajouter de nouvelles fonctionnalités :

1. **Filtres avancés** : Étendre l'interface `VehicleAgeFilters`
2. **Tri personnalisé** : Ajouter des options de tri dans le DataTable
3. **Export de données** : Ajouter des boutons d'export CSV/Excel
4. **Validation personnalisée** : Étendre les schémas de validation

## 🔧 Dépannage

### Problèmes courants

1. **Erreur 401/403** : Vérifiez l'authentification et les permissions
2. **Données non chargées** : Vérifiez la connexion réseau et l'URL de l'API
3. **Composant non affiché** : Vérifiez les imports et les exports
4. **Erreurs TypeScript** : Vérifiez la cohérence des types

### Debug

```typescript
// Debug du store
const { vehicleAges, loading, error } = useVehicleAgesStore()
console.log('Vehicle Ages:', vehicleAges)
console.log('Loading:', loading)
console.log('Error:', error)

// Debug du service
import { vehicleAgeService } from '@/services/vehicleAgeService'
vehicleAgeService.getAll().then(console.log).catch(console.error)
```

### Logs utiles

```typescript
// Dans le service
console.log('API Response:', response.data)

// Dans le store
console.log('Store State:', get())
```

## 📚 Ressources

### Fichiers principaux

- `src/services/vehicleAgeService.ts` - Service API
- `src/stores/vehicleAgesStore.ts` - Store Zustand
- `src/features/widgets/vehicle-age-select.tsx` - Composant de sélection
- `src/features/administration/vehicle-ages/` - Interface d'administration

### Dépendances

- `zustand` - Gestion d'état
- `axios` - Requêtes HTTP
- `sonner` - Notifications
- `lucide-react` - Icônes
- `@/components/ui/*` - Composants UI

### Documentation liée

- [Documentation Zustand](https://github.com/pmndrs/zustand)
- [Documentation Axios](https://axios-http.com/)
- [Documentation Sonner](https://sonner.emilkowal.ski/)

---

## 🚀 Prochaines étapes

1. **Tests unitaires** : Ajouter des tests pour le service et le store
2. **Tests d'intégration** : Tester l'interface d'administration
3. **Optimisation** : Implémenter la pagination côté client si nécessaire
4. **Monitoring** : Ajouter des métriques et des logs
5. **Documentation API** : Générer une documentation OpenAPI/Swagger

Pour toute question ou problème, consultez la documentation du projet ou contactez l'équipe de développement. 