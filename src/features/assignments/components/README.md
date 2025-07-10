# Composants Réutilisables pour les Assignments

Ce dossier contient des composants réutilisables pour la gestion des assignments, notamment des composants Select pour différents types de données.

## Composants Select Réutilisables

### OtherCostTypeSelect

Composant Select pour sélectionner un type de coût autre.

```tsx
import { OtherCostTypeSelect } from './components/reusable-selects'

;<OtherCostTypeSelect
  value={selectedTypeId}
  onValueChange={(value) => setSelectedTypeId(value)}
  otherCostTypes={otherCostTypes}
  required={true}
  showError={!selectedTypeId}
  label='Type de coût'
/>
```

### WorkforceTypeSelect

Composant Select pour sélectionner un type de main d'œuvre.

```tsx
import { WorkforceTypeSelect } from './components/reusable-selects'

;<WorkforceTypeSelect
  value={selectedWorkforceTypeId}
  onValueChange={(value) => setSelectedWorkforceTypeId(value)}
  workforceTypes={workforceTypes}
  required={true}
  showError={!selectedWorkforceTypeId}
  label="Type de main d'œuvre"
/>
```

### PaintTypeSelect

Composant Select pour sélectionner un type de peinture.

```tsx
import { PaintTypeSelect } from './components/reusable-selects'

;<PaintTypeSelect
  value={selectedPaintTypeId}
  onValueChange={(value) => setSelectedPaintTypeId(value)}
  paintTypes={paintTypes}
  required={true}
  showError={!selectedPaintTypeId}
  label='Type de peinture'
/>
```

### HourlyRateSelect

Composant Select pour sélectionner un taux horaire.

```tsx
import { HourlyRateSelect } from './components/reusable-selects'

;<HourlyRateSelect
  value={selectedHourlyRateId}
  onValueChange={(value) => setSelectedHourlyRateId(value)}
  hourlyRates={hourlyRates}
  required={true}
  showError={!selectedHourlyRateId}
  label='Taux horaire'
/>
```

### SelectedItemInfo

Composant pour afficher les informations d'un élément sélectionné.

```tsx
import { SelectedItemInfo } from './components/reusable-selects'

;<SelectedItemInfo
  type='otherCost'
  selectedId={selectedTypeId}
  items={otherCostTypes}
/>
```

## Props Communes

Tous les composants Select partagent les mêmes props de base :

- `value`: La valeur sélectionnée (number)
- `onValueChange`: Callback appelé lors du changement de valeur
- `placeholder`: Texte d'aide (optionnel)
- `label`: Label du champ (optionnel)
- `required`: Si le champ est requis (optionnel, défaut: false)
- `disabled`: Si le champ est désactivé (optionnel, défaut: false)
- `className`: Classes CSS supplémentaires (optionnel)
- `showError`: Afficher l'état d'erreur (optionnel, défaut: false)
- `errorMessage`: Message d'erreur personnalisé (optionnel)

## Types de Données

Les composants attendent des données avec la structure suivante :

```typescript
interface BaseType {
  id: number
  label: string
  code: string
  description?: string
}

type OtherCostType = BaseType
type WorkforceType = BaseType
type PaintType = BaseType

interface HourlyRate extends BaseType {
  rate?: number
}
```

## Utilisation dans les Modals

Ces composants sont particulièrement utiles dans les modals pour :

1. **Validation visuelle** : Affichage d'erreurs avec styles appropriés
2. **Cohérence UI** : Design uniforme dans toute l'application
3. **Réutilisabilité** : Même logique dans différents contextes
4. **Accessibilité** : Labels et messages d'erreur appropriés

## Exemple Complet

```tsx
import {
  OtherCostTypeSelect,
  SelectedItemInfo,
} from './components/reusable-selects'

function AddOtherCostModal({ otherCostTypes, onSave }) {
  const [selectedTypeId, setSelectedTypeId] = useState(0)
  const [amount, setAmount] = useState(0)

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un coût autre</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <OtherCostTypeSelect
            value={selectedTypeId}
            onValueChange={setSelectedTypeId}
            otherCostTypes={otherCostTypes}
            required={true}
            showError={!selectedTypeId}
          />

          {selectedTypeId > 0 && (
            <SelectedItemInfo
              type='otherCost'
              selectedId={selectedTypeId}
              items={otherCostTypes}
            />
          )}

          <div>
            <Label>Montant (FCFA)</Label>
            <Input
              type='number'
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```
