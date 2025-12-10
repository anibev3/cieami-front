# Expert Auto

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

## Run Locally

Clone the project

Go to the project directory

```bash
  cd shadcn-admin
```

Install dependencies

```bash
  pnpm install
```

### Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration de l'API
VITE_API_BASE_URL=https://api.example.com
VITE_API_SUFIX=/api/v1

# Configuration du rafraîchissement automatique des informations utilisateur
# Intervalle de rafraîchissement en millisecondes (défaut: 20000 = 20 secondes)
VITE_USER_REFRESH_INTERVAL=20000

# Activer le rafraîchissement uniquement quand la fenêtre est visible (défaut: true)
VITE_USER_REFRESH_ONLY_VISIBLE=true

# Activer le rafraîchissement immédiat quand la fenêtre redevient visible (défaut: true)
VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=true
```

**Note:** Les variables d'environnement doivent commencer par `VITE_` pour être accessibles dans le code client.

Start the server

```bash
  pnpm run dev
```

## Author

Crafted with 🤍 by [@satnaing](https://github.com/anibev3)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

zapreoumar@bca-ci.com
akealexandre@bca-ci.com
fanebakary@bca-ci.com

git@github.com:anibev3/expert-auto.git
git@github.com:anibev3/cieami-front.git

{
"status": 201,
"message": "Shock created successfully",
"data": {
"id": "shock_qZwENz9BDLvVQ",
"position": 4,
"with_tax": false,
"is_before_quote": false,
"is_validated": false,
"obsolescence_amount_excluding_tax": null,
"obsolescence_amount_tax": null,
"obsolescence_amount": null,
"recovery_amount_excluding_tax": null,
"recovery_amount_tax": null,
"recovery_amount": null,
"new_amount_excluding_tax": null,
"new_amount_tax": null,
"new_amount": null,
"workforce_amount_excluding_tax": null,
"workforce_amount_tax": null,
"workforce_amount": null,
"amount_excluding_tax": null,
"amount_tax": null,
"amount": null,
"deleted_at": null,
"created_at": "2025-11-19 02:52:28",
"updated_at": "2025-11-19 02:52:28"
}
}

voici le retour de l'api quand j'ajoute un point de choc, actuellement quand j'ajoute un point de choc le modal reste toujour affiché




