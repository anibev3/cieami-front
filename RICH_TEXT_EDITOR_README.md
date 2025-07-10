# Éditeur de Texte Riche - Documentation

## 🎯 Vue d'ensemble

L'application utilise maintenant des **éditeurs de texte riche (WYSIWYG)** pour les champs suivants :
- **Circonstances** : Description détaillée des circonstances de l'accident
- **Dégâts déclarés** : Description des dégâts déclarés par le client
- **Points notés** : Observations importantes notées lors de l'expertise
- **Observation générale** : Observations générales de l'expert

## 🛠️ Technologies utilisées

- **TipTap** : Éditeur de texte riche basé sur ProseMirror
- **React** : Interface utilisateur
- **Tailwind CSS** : Styles et design
- **Lucide React** : Icônes

## ✨ Fonctionnalités disponibles

### Barre d'outils complète

#### 📝 Style de texte
- **Gras** : `Ctrl+B` ou bouton **B**
- **Italique** : `Ctrl+I` ou bouton *I*
- **Souligné** : `Ctrl+U` ou bouton _U_

#### 📐 Alignement
- **Gauche** : Aligner le texte à gauche
- **Centre** : Centrer le texte
- **Droite** : Aligner le texte à droite
- **Justifié** : Justifier le texte

#### 🎨 Couleurs et mise en forme
- **Couleur de texte** : Palette de couleurs
- **Surlignage** : Mettre en surbrillance du texte

#### 📋 Structure
- **Titre H2** : Titre de niveau 2
- **Titre H3** : Titre de niveau 3
- **Liste à puces** : Créer des listes

## 🚀 Utilisation

### Dans la page de rédaction

1. **Accéder à la section "Vue d'ensemble"**
2. **Cliquer sur un éditeur** pour commencer à écrire
3. **Utiliser la barre d'outils** pour formater le texte
4. **Cliquer sur "Sauvegarder"** pour enregistrer les modifications

### Exemple d'utilisation

```jsx
<RichTextEditor
  label="Circonstances"
  value={circumstance}
  onChange={setCircumstance}
  placeholder="Décrivez les circonstances de l'accident..."
  className="mb-4"
/>
```

## 💾 Sauvegarde

- Les modifications sont **automatiquement détectées**
- Cliquer sur **"Sauvegarder"** pour envoyer les données à l'API
- Le contenu est sauvegardé au format **HTML**
- **Rafraîchissement automatique** après sauvegarde

## 🎨 Personnalisation

### Styles CSS

Les styles sont définis dans `src/index.css` :

```css
/* Styles pour l'éditeur */
.ProseMirror {
  outline: none;
  min-height: 80px;
}

/* Styles pour la barre d'outils */
.rich-text-toolbar button {
  transition: all 0.2s ease-in-out;
}
```

### Extensions disponibles

- **StarterKit** : Fonctionnalités de base
- **Placeholder** : Texte d'aide
- **TextAlign** : Alignement du texte
- **Underline** : Soulignement
- **TextStyle** : Styles de texte
- **Color** : Couleurs
- **Highlight** : Surlignage

## 🔧 Développement

### Ajouter une nouvelle extension

```jsx
import NewExtension from '@tiptap/extension-new'

const editor = useEditor({
  extensions: [
    StarterKit,
    NewExtension.configure({
      // Configuration
    }),
  ],
})
```

### Ajouter un nouveau bouton

```jsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => editor.chain().focus().newCommand().run()}
  className={cn(
    "h-8 w-8 p-0",
    editor.isActive('newCommand') && "bg-blue-100 text-blue-700"
  )}
>
  <NewIcon className="h-4 w-4" />
</Button>
```

## 📱 Responsive Design

- **Barre d'outils adaptative** : S'adapte aux petits écrans
- **Boutons flexibles** : Se réorganisent automatiquement
- **Hauteur minimale** : Garantit une bonne expérience utilisateur

## 🐛 Dépannage

### Problèmes courants

1. **L'éditeur ne se charge pas**
   - Vérifier les imports TipTap
   - Contrôler les dépendances

2. **Les styles ne s'appliquent pas**
   - Vérifier les classes CSS
   - Contrôler les variables Tailwind

3. **La sauvegarde ne fonctionne pas**
   - Vérifier la fonction `onChange`
   - Contrôler les appels API

## 📚 Ressources

- [Documentation TipTap](https://tiptap.dev/)
- [ProseMirror](https://prosemirror.net/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités :

1. **Installer les extensions** nécessaires
2. **Ajouter les boutons** dans la barre d'outils
3. **Tester** sur différents navigateurs
4. **Documenter** les nouvelles fonctionnalités

---

*Dernière mise à jour : Décembre 2024* 