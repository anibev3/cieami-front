# Modals Components

Ce dossier contient les composants modaux réutilisables de l'application.

## ShockPointCreateModal

Modal réutilisable pour la création et l'ajout de points de choc dans les dossiers d'expertise.

### Usage

```tsx
import { ShockPointCreateModal } from '@/components/modals'

function ExampleComponent() {
  const [showModal, setShowModal] = useState(false)
  const [selectedShockPointId, setSelectedShockPointId] = useState(0)

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Ajouter un point de choc
      </Button>

      <ShockPointCreateModal
        open={showModal}
        onOpenChange={setShowModal}
        selectedShockPointId={selectedShockPointId}
        onSelectedShockPointIdChange={setSelectedShockPointId}
        shockPoints={shockPoints}
        shocks={shocks}
        onCreateShockPoint={() => {
          // Logique pour créer un nouveau point de choc
          console.log('Créer un nouveau point de choc')
        }}
        onAddShock={(shockPointId) => {
          // Logique pour ajouter le point de choc sélectionné
          console.log('Ajouter point de choc:', shockPointId)
        }}
      />
    </>
  )
}
```

### Props

- `open`: boolean - Contrôle l'ouverture du modal
- `onOpenChange`: (open: boolean) => void - Callback pour changer l'état d'ouverture
- `selectedShockPointId`: number - ID du point de choc sélectionné
- `onSelectedShockPointIdChange`: (id: number) => void - Callback pour changer la sélection
- `shockPoints`: ShockPoint[] - Array des points de choc disponibles
- `shocks`: Shock[] - Array des chocs actuels (pour les statistiques)
- `onCreateShockPoint`: () => void - Callback pour créer un nouveau point de choc
- `onAddShock`: (shockPointId: number) => void - Callback pour ajouter le point sélectionné

### Types

```tsx
interface ShockPoint {
  id: number
  code: string
  label: string
  description?: string
}

interface Shock {
  id?: number
  shock_point_id: number
  [key: string]: any
}
```

### Fonctionnalités

- ✅ Sélection de point de choc avec ShockPointSelect
- ✅ Bouton pour créer un nouveau point de choc
- ✅ Statistiques (points disponibles vs points ajoutés)
- ✅ Validation (bouton d'ajout désactivé si aucune sélection)
- ✅ Gestion automatique de la fermeture et du reset
- ✅ Design cohérent avec l'interface de l'application
