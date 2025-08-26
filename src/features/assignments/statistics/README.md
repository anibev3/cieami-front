# Interface Unifiée des Statistiques

## Vue d'ensemble

Cette interface unifiée permet d'afficher et d'analyser trois types de statistiques différents avec une interface commune et moderne :

1. **Statistiques des Dossiers** (`/assignments/get/statistics`)
2. **Statistiques des Paiements** (`/payments/get/statistics`) 
3. **Statistiques des Factures** (`/invoices/get/statistics`)

## Architecture

### Types (`src/types/statistics.ts`)

- **Types de base** : `BaseStatisticsData`, `CountByMonth`, `AmountByMonth`
- **Types spécifiques** : `AssignmentStatistics`, `PaymentStatistics`, `InvoiceStatistics`
- **Types unifiés** : `StatisticsData`, `StatisticsFilters`
- **Configuration** : `StatisticsTypeConfig`, `STATISTICS_TYPES`

### Service (`src/services/statisticsService.ts`)

Service unifié qui gère les trois types de statistiques avec :
- Méthode `getStatistics(type, filters)` générique
- Gestion automatique des paramètres selon le type
- Support des includes spécifiques à chaque type
- Méthode `downloadExport()` pour télécharger les fichiers Excel

### Store (`src/stores/statisticsStore.ts`)

Store Zustand unifié avec :
- État partagé pour tous les types de statistiques
- Actions communes : `fetchStatistics`, `clearStatistics`, `downloadExport`
- Hooks spécialisés : `useAssignmentStatistics`, `usePaymentStatistics`, `useInvoiceStatistics`

### Composants

#### `StatisticsTypeSelector`
- Sélecteur visuel avec des cartes pour chaque type de statistique
- Affichage des filtres disponibles pour chaque type
- Design moderne avec icônes et badges

#### `UnifiedAdvancedFilters`
- Filtres avancés adaptatifs selon le type sélectionné
- Interface en sheet (panneau latéral)
- Gestion des filtres spécifiques à chaque type
- Bouton d'export Excel intégré

#### `UnifiedStatisticsDisplay`
- Affichage unifié des statistiques
- Cartes de résumé avec couleurs distinctives
- Détails par mois
- Bouton d'export Excel

## Utilisation

### 1. Sélection du type
L'utilisateur sélectionne d'abord le type de statistique qu'il souhaite consulter.

### 2. Configuration des filtres
- **Filtres de base** : Période (date début/fin)
- **Filtres avancés** : Spécifiques au type sélectionné

### 3. Recherche
Lancement de la recherche avec les filtres configurés.

### 4. Affichage
- Résumé avec 3 cartes (total, montant, moyenne)
- Détails par mois
- Bouton d'export Excel

## Filtres par type

### Dossiers
- Réparateur, Assureur, Nature du sinistre
- Statut, Créé par, Modifié par, Réalisé par
- Validé par, Dirigé par

### Paiements
- Méthode de paiement, Type de paiement
- Banque, Client, Dossier
- Créé par, Statut

### Factures
- Client, Dossier, Statut de paiement
- Créé par, Statut

## Fonctionnalités

- ✅ Interface unifiée pour 3 types de statistiques
- ✅ Filtres adaptatifs selon le type
- ✅ Export Excel intégré
- ✅ Design moderne et responsive
- ✅ Gestion d'erreurs avec toast
- ✅ États de chargement
- ✅ Synchronisation automatique des filtres
- ✅ Architecture extensible pour de nouveaux types

## Extensibilité

Pour ajouter un nouveau type de statistique :

1. Ajouter le type dans `StatisticsType`
2. Créer l'interface spécifique
3. Ajouter la configuration dans `STATISTICS_TYPES`
4. Étendre le service avec le nouveau cas
5. Ajouter les filtres spécifiques

## API Response Format

Tous les types suivent le même format :
```json
{
  "status": 200,
  "message": "Statistiques...",
  "data": {
    "[type]_by_year_and_month_count": [...],
    "[type]_by_year_and_month_amount": [...],
    "export_url": "..."
  }
}
```
