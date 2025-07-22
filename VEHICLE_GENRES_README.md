# Intégration des Genres de Véhicules

Ce document décrit l'intégration complète des genres de véhicules dans l'application, incluant les API, les stores, les composants et leur utilisation.

## 📋 Table des matières

1. [API Integration](#api-integration)
2. [Store Management](#store-management)
3. [Composants](#composants)
4. [Utilisation](#utilisation)
5. [Exemples](#exemples)

## 🔌 API Integration

### Service API (`src/services/vehicleGenreService.ts`)

Le service gère toutes les opérations CRUD pour les genres de véhicules :

```typescript
// Récupérer tous les genres
const response = await vehicleGenreService.getAll()

// Créer un nouveau genre
const newGenre = await vehicleGenreService.create({
  code: "VG01",
  label: "VOITURE PARTICULIER",
  description: "Voiture particulière, SUV, 4x4"
})

// Mettre à jour un genre
const updatedGenre = await vehicleGenreService.update(id, {
  label: "Nouveau label",
  description: "Nouvelle description"
})

// Supprimer un genre
await vehicleGenreService.delete(id)
```

### Endpoints API

- `GET /vehicle-genres` - Récupérer tous les genres
- `GET /vehicle-genres/{id}` - Récupérer un genre par ID
- `POST /vehicle-genres` - Créer un nouveau genre
- `PUT /vehicle-genres/{id}` - Mettre à jour un genre
- `DELETE /vehicle-genres/{id}` - Supprimer un genre

## 🗃️ Store Management

### Store Zustand (`src/stores/vehicleGenresStore.ts`)

Le store gère l'état global des genres de véhicules :

```typescript
const { 
  vehicleGenres, 
  loading, 
  fetchVehicleGenres,
  createVehicleGenre,
  updateVehicleGenre,
  deleteVehicleGenre 
} = useVehicleGenresStore()
```

### Actions disponibles

- `fetchVehicleGenres()` - Charger tous les genres
- `createVehicleGenre(data)` - Créer un nouveau genre
- `updateVehicleGenre(id, data)` - Mettre à jour un genre
- `deleteVehicleGenre(id)` - Supprimer un genre
- `setSelectedVehicleGenre(genre)` - Définir le genre sélectionné

## 🧩 Composants

### 1. Composant de Sélection (`src/features/widgets/vehicle-genre-select.tsx`)

Composant réutilisable pour sélectionner un genre de véhicule :

```tsx
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'

<VehicleGenreSelect
  value={selectedGenre}
  onValueChange={setSelectedGenre}
  placeholder="Sélectionner un genre de véhicule"
  showDescription={true}
  disabled={false}
/>
```

#### Props disponibles

- `value?: string` - Valeur sélectionnée (ID du genre)
- `onValueChange: (value: string) => void` - Callback lors du changement
- `placeholder?: string` - Texte d'aide
- `disabled?: boolean` - État désactivé
- `className?: string` - Classes CSS personnalisées
- `showDescription?: boolean` - Afficher la description

### 2. Page d'Administration (`src/features/administration/vehicle-genres/index.tsx`)

Page complète pour gérer les genres de véhicules avec :
- Tableau de données avec recherche
- Création, édition, visualisation et suppression
- Interface utilisateur moderne

### 3. Composants de Dialogue

- `VehicleGenresDialogs` - Gestion des modales CRUD
- `DataTable` - Affichage tabulaire avec actions
- `VehicleGenresPrimaryButtons` - Boutons d'action principaux

## 🚀 Utilisation

### 1. Dans un formulaire

```tsx
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'

<FormField
  control={form.control}
  name="vehicle_genre_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Genre de véhicule</FormLabel>
      <FormControl>
        <VehicleGenreSelect
          value={field.value}
          onValueChange={field.onChange}
          placeholder="Sélectionner un genre de véhicule"
          showDescription={true}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 2. Dans un composant personnalisé

```tsx
import { useVehicleGenres } from '@/features/widgets/vehicle-genre-select'

function MyComponent() {
  const { vehicleGenres, loading, fetchVehicleGenres } = useVehicleGenres()
  
  useEffect(() => {
    fetchVehicleGenres()
  }, [])
  
  return (
    <div>
      {vehicleGenres.map(genre => (
        <div key={genre.id}>
          <strong>{genre.label}</strong>
          <p>{genre.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## 📝 Exemples

### Exemple 1 : Intégration dans un formulaire de véhicule

```tsx
// Dans src/features/administration/vehicles/components/vehicle-mutate-dialog.tsx
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'

<FormField
  control={form.control}
  name="vehicle_genre_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Genre de véhicule</FormLabel>
      <FormControl>
        <VehicleGenreSelect
          value={field.value}
          onValueChange={field.onChange}
          placeholder="Sélectionner un genre de véhicule"
          showDescription={true}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Exemple 2 : Utilisation dans une page de création de dossier

```tsx
// Dans src/features/assignments/create.tsx
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'

<FormField
  control={form.control}
  name="vehicle_genre_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Genre de véhicule</FormLabel>
      <FormControl>
        <VehicleGenreSelect
          value={field.value}
          onValueChange={field.onChange}
          placeholder="Sélectionner le genre du véhicule"
          showDescription={false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 🔧 Configuration

### Ajout d'un nouveau genre

1. Accéder à la page d'administration : `/administration/vehicle-genres`
2. Cliquer sur "Nouveau genre"
3. Remplir les champs :
   - **Code** : Code unique (ex: VG01)
   - **Label** : Nom du genre (ex: VOITURE PARTICULIER)
   - **Description** : Description détaillée

### Modification d'un genre existant

1. Dans le tableau, cliquer sur l'icône d'édition
2. Modifier les champs souhaités
3. Sauvegarder les modifications

## 🎨 Personnalisation

### Styles personnalisés

```tsx
<VehicleGenreSelect
  className="custom-select-class"
  // ... autres props
/>
```

### Affichage personnalisé

```tsx
// Afficher avec description
<VehicleGenreSelect showDescription={true} />

// Afficher sans description
<VehicleGenreSelect showDescription={false} />
```

## 🐛 Dépannage

### Problèmes courants

1. **Les genres ne se chargent pas**
   - Vérifier la connexion API
   - Vérifier les permissions d'authentification

2. **Erreur de validation**
   - Vérifier que le code est unique
   - Vérifier que tous les champs requis sont remplis

3. **Composant ne s'affiche pas**
   - Vérifier l'import du composant
   - Vérifier que le store est initialisé

### Logs de débogage

```typescript
// Activer les logs de débogage
const { vehicleGenres, loading, error } = useVehicleGenresStore()
console.log('Genres:', vehicleGenres)
console.log('Loading:', loading)
console.log('Error:', error)
```

## 📚 Ressources

- [Documentation API](https://back.roomcodetraining.com/api/v1/vehicle-genres)
- [Types TypeScript](./src/services/vehicleGenreService.ts)
- [Store Zustand](./src/stores/vehicleGenresStore.ts)
- [Composant de sélection](./src/features/widgets/vehicle-genre-select.tsx) 