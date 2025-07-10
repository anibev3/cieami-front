# Intégration des Énergies de Véhicules

Ce document décrit l'intégration complète des énergies de véhicules dans l'application Expert Auto, incluant l'API, le store, les composants et l'interface d'administration.

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

L'intégration des énergies de véhicules permet de :
- Gérer les énergies de véhicules via une interface d'administration complète
- Utiliser un composant de sélection réutilisable dans les formulaires
- Effectuer toutes les opérations CRUD (Create, Read, Update, Delete)
- Rechercher et filtrer les énergies de véhicules
- Afficher les énergies avec leurs codes et descriptions

## 🔌 API

### Endpoints

```typescript
// Base URL: /api/v1/vehicle-energies

// Récupérer toutes les énergies de véhicules
GET /vehicle-energies

// Récupérer une énergie de véhicule par ID
GET /vehicle-energies/{id}

// Créer une nouvelle énergie de véhicule
POST /vehicle-energies

// Mettre à jour une énergie de véhicule
PUT /vehicle-energies/{id}

// Supprimer une énergie de véhicule
DELETE /vehicle-energies/{id}
```

### Structure des données

```typescript
interface VehicleEnergy {
  id: number
  code: string          // Code unique (ex: "VE01", "VE02")
  label: string         // Label affiché (ex: "ESSENCE", "DIESEL")
  description: string   // Description optionnelle
  status: {
    id: number
    code: string        // "active" ou "inactive"
    label: string       // "Actif(ve)" ou "Inactif(ve)"
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
# Créer une énergie de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-energies \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "label": "ESSENCE",
    "description": "Carburant essence"
  }'

# Mettre à jour une énergie de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-energies/{id} \
  --request PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "label": "DIESEL",
    "description": "Carburant diesel"
  }'

# Supprimer une énergie de véhicule
curl http://back.roomcodetraining.com/api/v1/vehicle-energies/{id} \
  --request DELETE \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

## 🗃️ Store Zustand

### Fichier : `src/stores/vehicleEnergiesStore.ts`

Le store gère l'état global des énergies de véhicules avec les fonctionnalités suivantes :

```typescript
interface VehicleEnergiesState {
  // État
  vehicleEnergies: VehicleEnergy[]
  loading: boolean
  error: string | null
  selectedVehicleEnergy: VehicleEnergy | null
  
  // Actions
  fetchVehicleEnergies: () => Promise<void>
  createVehicleEnergy: (data: CreateVehicleEnergyData) => Promise<void>
  updateVehicleEnergy: (id: number, data: UpdateVehicleEnergyData) => Promise<void>
  deleteVehicleEnergy: (id: number) => Promise<void>
  setSelectedVehicleEnergy: (vehicleEnergy: VehicleEnergy | null) => void
  clearError: () => void
}
```

### Utilisation du store

```typescript
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'

function MyComponent() {
  const { 
    vehicleEnergies, 
    loading, 
    fetchVehicleEnergies, 
    createVehicleEnergy 
  } = useVehicleEnergiesStore()

  useEffect(() => {
    fetchVehicleEnergies()
  }, [])

  const handleCreate = async () => {
    await createVehicleEnergy({
      label: "ESSENCE",
      description: "Carburant essence"
    })
  }

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        vehicleEnergies.map(energy => (
          <div key={energy.id}>{energy.label}</div>
        ))
      )}
    </div>
  )
}
```

## 🧩 Composants

### 1. Composant de sélection réutilisable

**Fichier :** `src/features/widgets/vehicle-energy-select.tsx`

Composant de sélection avec chargement automatique des données :

```tsx
import { VehicleEnergySelect } from '@/features/widgets'

function MyForm() {
  const [selectedEnergy, setSelectedEnergy] = useState('')

  return (
    <VehicleEnergySelect
      value={selectedEnergy}
      onValueChange={setSelectedEnergy}
      placeholder="Sélectionner une énergie"
      showDescription={true}
    />
  )
}
```

**Props disponibles :**
- `value?: string` - Valeur sélectionnée (ID de l'énergie)
- `onValueChange: (value: string) => void` - Callback de changement
- `placeholder?: string` - Placeholder personnalisé
- `disabled?: boolean` - État désactivé
- `className?: string` - Classes CSS personnalisées
- `showDescription?: boolean` - Afficher les descriptions

### 2. Page d'administration

**Fichier :** `src/features/administration/vehicle-energies/index.tsx`

Interface complète de gestion des énergies de véhicules avec :
- Tableau de données avec recherche
- Boutons d'actions (Créer, Voir, Modifier, Supprimer)
- Dialogues modaux pour toutes les opérations
- Gestion des états de chargement et d'erreur

### 3. Composants de support

- **DataTable** : Tableau avec recherche et actions
- **VehicleEnergiesDialogs** : Dialogues pour CRUD
- **VehicleEnergiesPrimaryButtons** : Boutons d'actions principales

## 💻 Utilisation

### 1. Utilisation du composant de sélection

```tsx
import { VehicleEnergySelect } from '@/features/widgets'
import { useForm } from 'react-hook-form'

function VehicleForm() {
  const { register, setValue, watch } = useForm()
  const selectedEnergy = watch('vehicleEnergyId')

  return (
    <form>
      <div className="space-y-4">
        <div>
          <label>Énergie du véhicule</label>
          <VehicleEnergySelect
            value={selectedEnergy}
            onValueChange={(value) => setValue('vehicleEnergyId', value)}
            placeholder="Sélectionner l'énergie du véhicule"
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
/administration/vehicle/energie
```

### 3. Intégration dans les formulaires existants

Pour intégrer le sélecteur d'énergie dans un formulaire de véhicule existant :

```tsx
import { VehicleEnergySelect } from '@/features/widgets'

// Dans le formulaire de véhicule
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label>Marque</Label>
    <BrandSelect {...brandProps} />
  </div>
  <div>
    <Label>Énergie</Label>
    <VehicleEnergySelect
      value={formData.vehicleEnergyId}
      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleEnergyId: value }))}
      placeholder="Sélectionner l'énergie"
    />
  </div>
</div>
```

## ⚙️ Configuration

### 1. Configuration du service API

Le service utilise l'instance axios configurée dans `src/lib/axios.ts`. Assurez-vous que l'URL de base et les headers d'authentification sont correctement configurés.

### 2. Configuration des types

Les types TypeScript sont définis dans `src/services/vehicleEnergyService.ts` et peuvent être étendus selon les besoins :

```typescript
// Extension possible des types
interface VehicleEnergyWithRelations extends VehicleEnergy {
  // Propriétés supplémentaires si nécessaire
  relatedVehicles?: Vehicle[]
  statistics?: EnergyStatistics
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
<VehicleEnergySelect
  className="w-full max-w-md"
  // Autres props...
/>
```

### 2. Personnalisation des messages

Les messages de succès et d'erreur peuvent être personnalisés dans le store :

```typescript
// Dans vehicleEnergiesStore.ts
toast.success('Énergie de véhicule créée avec succès') // Personnalisable
toast.error('Erreur lors de la création') // Personnalisable
```

### 3. Ajout de fonctionnalités

Pour ajouter de nouvelles fonctionnalités :

1. **Filtres avancés** : Étendre l'interface `VehicleEnergyFilters`
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
const { vehicleEnergies, loading, error } = useVehicleEnergiesStore()
console.log('Vehicle Energies:', vehicleEnergies)
console.log('Loading:', loading)
console.log('Error:', error)

// Debug du service
import { vehicleEnergyService } from '@/services/vehicleEnergyService'
vehicleEnergyService.getAll().then(console.log).catch(console.error)
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

- `src/services/vehicleEnergyService.ts` - Service API
- `src/stores/vehicleEnergiesStore.ts` - Store Zustand
- `src/features/widgets/vehicle-energy-select.tsx` - Composant de sélection
- `src/features/administration/vehicle-energies/` - Interface d'administration

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