# Intégration des Tableaux de Dépréciation

Cette intégration fournit une gestion complète des tableaux de dépréciation des véhicules avec un calculateur de valeur vénale théorique moderne.

## 🚀 Fonctionnalités

### Gestion des Tableaux de Dépréciation
- **CRUD complet** : Création, lecture, mise à jour et suppression des tableaux
- **Interface moderne** : Tableau de données avec recherche et filtres
- **Validation** : Formulaires avec validation côté client
- **Notifications** : Feedback utilisateur avec toast notifications

### Calculateur de Valeur Vénale Théorique
- **Interface intuitive** : Formulaire moderne avec validation
- **Calculs en temps réel** : Résultats affichés avec animations
- **Visualisation riche** : Affichage détaillé des résultats avec graphiques
- **Responsive** : Interface adaptée mobile et desktop

## 📁 Structure des Fichiers

```
src/
├── services/
│   └── depreciationTableService.ts          # Service API
├── stores/
│   └── depreciationTablesStore.ts           # Store Zustand
├── features/
│   └── gestion/
│       └── depreciation-tables/
│           ├── index.tsx                     # Page principale
│           ├── theoretical-value.tsx         # Page de calcul
│           └── components/
│               ├── data-table.tsx            # Tableau de données
│               ├── depreciation-tables-dialogs.tsx  # Dialogues CRUD
│               ├── depreciation-tables-primary-buttons.tsx  # Boutons
│               ├── theoretical-value-calculator.tsx  # Calculateur
│               └── theoretical-value-result.tsx      # Affichage résultats
```

## 🔧 API Endpoints

### Tableaux de Dépréciation
- `GET /depreciation-tables` - Lister tous les tableaux
- `GET /depreciation-tables/{id}` - Récupérer un tableau
- `POST /depreciation-tables` - Créer un tableau
- `PUT /depreciation-tables/{id}` - Mettre à jour un tableau
- `DELETE /depreciation-tables/{id}` - Supprimer un tableau

### Calcul de Valeur Théorique
- `POST /depreciation-tables/calculate-theoretical-market-value` - Calculer la valeur

## 📊 Types de Données

### DepreciationTable
```typescript
interface DepreciationTable {
  id: number
  value: string
  vehicle_genre: VehicleGenre
  vehicle_age: VehicleAge
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}
```

### TheoreticalValueCalculationData
```typescript
interface TheoreticalValueCalculationData {
  first_entry_into_circulation_date: string
  expertise_date: string
  vehicle_genre_id: string
  vehicle_energy_id: string
  vehicle_new_value: number
  vehicle_mileage: number
}
```

### TheoreticalValueCalculationResult
```typescript
interface TheoreticalValueCalculationResult {
  expertise_date: string
  first_entry_into_circulation_date: string
  vehicle_new_value: number
  vehicle_age: number
  theorical_depreciation_rate: string
  theorical_vehicle_market_value: number
}
```

## 🎯 Utilisation

### Page Principale des Tableaux
```tsx
import { DepreciationTablesPage } from '@/features/gestion/depreciation-tables'

// Accès via route: /gestion/depreciation-tables
```

### Page de Calcul de Valeur Théorique
```tsx
import { TheoreticalValuePage } from '@/features/gestion/depreciation-tables/theoretical-value'

// Accès via route: /gestion/depreciation-tables/theoretical-value
```

### Store Zustand
```tsx
import { useDepreciationTablesStore } from '@/stores/depreciationTablesStore'

const {
  depreciationTables,
  loading,
  fetchDepreciationTables,
  createDepreciationTable,
  calculateTheoreticalValue,
  theoreticalValueResult
} = useDepreciationTablesStore()
```

## 🎨 Interface Utilisateur

### Tableau de Dépréciation
- **Recherche** : Filtrage par genre, âge, taux
- **Actions** : Visualiser, modifier, supprimer
- **Statuts** : Badges colorés pour les statuts
- **Pagination** : Navigation entre les pages

### Calculateur de Valeur
- **Formulaire** : Champs validés avec feedback
- **Résultats** : Affichage animé avec détails
- **Responsive** : Adaptation mobile/desktop
- **Animations** : Transitions fluides

## 🔒 Validation

### Formulaire de Calcul
- Dates obligatoires et valides
- Valeurs numériques positives
- Sélections de genre et énergie requises
- Kilométrage non négatif

### Tableaux de Dépréciation
- Taux entre 0 et 100%
- Genre et âge obligatoires
- Validation côté client et serveur

## 📱 Responsive Design

- **Mobile** : Interface adaptée aux petits écrans
- **Tablet** : Layout optimisé pour tablettes
- **Desktop** : Interface complète avec sidebar

## 🎯 Fonctionnalités Avancées

### Calcul de Valeur Théorique
- **Calcul automatique** : Basé sur les tableaux de dépréciation
- **Affichage détaillé** : Taux, montants, âge du véhicule
- **Formatage** : Monnaie, dates, pourcentages
- **Résumé visuel** : Synthèse des résultats

### Gestion des Erreurs
- **Validation** : Messages d'erreur contextuels
- **API** : Gestion des erreurs réseau
- **Fallback** : États de chargement et d'erreur

## 🚀 Déploiement

L'intégration est prête pour la production avec :
- **TypeScript** : Types stricts et sécurité
- **Tests** : Structure prête pour les tests
- **Documentation** : Code commenté et README
- **Performance** : Optimisations React

## 📈 Évolutions Futures

- **Graphiques** : Visualisation des tendances de dépréciation
- **Export** : Export PDF/Excel des résultats
- **Historique** : Sauvegarde des calculs
- **Comparaison** : Comparaison entre véhicules
- **API avancée** : Endpoints pour statistiques

## 🤝 Contribution

Pour contribuer à cette intégration :
1. Respecter les conventions de code
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Documenter les changements
4. Tester sur différents appareils

---

**Note** : Cette intégration utilise les composants UI existants et suit les patterns établis dans le projet. 