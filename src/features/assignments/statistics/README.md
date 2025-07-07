# Statistiques des Dossiers

Cette fonctionnalité permet d'analyser les performances et les tendances des dossiers d'expertise automobile.

## Fonctionnalités

### Filtres de recherche

- **Date de début** : Sélection de la date de début de la période d'analyse
- **Date de fin** : Sélection de la date de fin de la période d'analyse
- **Dossier spécifique** : Filtrage par dossier d'assignation spécifique (optionnel)

### Résumé des statistiques

- **Total des dossiers** : Nombre total de dossiers sur la période
- **Montant total** : Montant total des dossiers
- **Moyenne par dossier** : Montant moyen par dossier

### Tableaux détaillés

- **Nombre de dossiers par mois** : Répartition mensuelle du nombre de dossiers
- **Montants par mois** : Répartition mensuelle des montants

## Utilisation

1. Accédez à la page via `/assignments/statistics`
2. Sélectionnez une période avec les calendriers de début et fin
3. Optionnellement, filtrez par dossier spécifique
4. Cliquez sur "Rechercher" pour obtenir les statistiques
5. Explorez les résultats dans les tableaux expansibles

## API

L'endpoint utilisé : `GET /api/v1/assignments/statistics`

### Paramètres

- `start_date` : Date de début (format: YYYY-MM-DD)
- `end_date` : Date de fin (format: YYYY-MM-DD)
- `assignment_id` : ID du dossier d'assignation (optionnel)

### Réponse

```json
{
  "status": 200,
  "message": "Statistiques des dossiers",
  "data": {
    "assignments_by_year_and_month_count": [
      {
        "year": 2025,
        "month": 7,
        "count": 1
      }
    ],
    "assignments_by_year_and_month_amount": [
      {
        "year": 2025,
        "month": 7,
        "amount": "29915.00"
      }
    ]
  }
}
```

## Architecture

### Composants

- `AssignmentStatisticsPage` : Page principale
- `AssignmentStatisticsTable` : Tableau des statistiques avec sections expansibles
- `AssignmentSelect` : Sélecteur de dossier d'assignation

### Stores

- `useAssignmentStatisticsStore` : Gestion de l'état des statistiques

### Services

- `assignmentStatisticsService` : Appels API pour les statistiques

## Technologies utilisées

- **React** avec TypeScript
- **Zustand** pour la gestion d'état
- **TanStack Table** pour les tableaux
- **date-fns** pour la manipulation des dates
- **Lucide React** pour les icônes
- **Shadcn/ui** pour les composants UI
