# CV Creator Pro

**CV Creator Pro** est une application web de création de CV qui permet de remplir ses informations, personnaliser la mise en page et visualiser le résultat en direct. L'application propose 22 modèles, la gestion de plusieurs versions d'un CV et plusieurs formats d'export.

Le projet est construit avec React, TypeScript et Vite. Les données des CV sont conservées localement dans le navigateur : aucun compte n'est nécessaire.

## Fonctionnalités

- **22 modèles de CV** : modernes, classiques, créatifs, professionnels et adaptés à différents secteurs (tech, santé, juridique, enseignement, commerce, études, freelance, etc.).
- **Aperçu en temps réel** pendant la saisie et la personnalisation.
- **Formulaire guidé** pour les informations personnelles, le résumé, les expériences professionnelles, les formations, les compétences, les langues, les projets et les certifications.
- **Réorganisation des sections** par glisser-déposer sur ordinateur et commandes de déplacement sur mobile.
- **Préréglages par secteur ou objectif professionnel** pour suggérer un modèle et un ordre de sections.
- **Gestion de plusieurs versions** : créer, dupliquer, renommer, supprimer et sélectionner différentes versions du CV.
- **Données d'exemple** pour découvrir rapidement les modèles.
- **Export** en PDF via l'impression du navigateur, en PDF texte adapté à la sélection du texte, ou en DOCX éditable.
- **Sauvegarde et restauration JSON** pour exporter ses versions et les réimporter plus tard.
- **Interface adaptée aux écrans mobiles** avec une disposition dédiée au petit écran.
- **Thème clair/sombre**.

## Captures et démonstration

Aucune URL de démonstration publique n'est indiquée dans ce dépôt. Pour utiliser l'application, lance-la localement en suivant les étapes ci-dessous.

## Technologies utilisées

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui et composants Radix UI
- React Router
- React Hook Form et Zod
- dnd-kit pour le réordonnancement
- jsPDF, html2canvas et docx pour les exports
- Vitest et Testing Library pour les tests

## Prérequis

- Node.js et npm
- Un navigateur moderne

## Installation et lancement

Clone le dépôt :

```bash
git clone https://github.com/XAlbert07/Generator-CV.git
cd Generator-CV
```

Installe les dépendances :

```bash
npm install
```

Lance le serveur de développement :

```bash
npm run dev
```

Vite est configuré pour utiliser le port **8080**. Ouvre ensuite [http://localhost:8080](http://localhost:8080).

## Commandes disponibles

```bash
npm run dev        # Démarrer le serveur de développement
npm run build      # Générer le build de production
npm run preview    # Prévisualiser le build de production
npm run lint       # Vérifier le code avec ESLint
npm test           # Exécuter les tests une fois
npm run test:watch # Exécuter les tests en mode surveillance
```

Avant une contribution ou une mise en ligne, lance au minimum :

```bash
npm run lint
npm test
npm run build
```

## Utilisation rapide

1. Ouvre l'application et accède à **Créer mon CV**.
2. Choisis un préréglage ou passe cette étape.
3. Renseigne les informations du CV et les différentes sections.
4. Sélectionne un modèle et ajuste l'ordre des sections.
5. Utilise l'aperçu pour vérifier la mise en page.
6. Exporte le CV au format souhaité.

Dans le menu secondaire de l'éditeur, tu peux aussi charger les données d'exemple, télécharger une sauvegarde JSON ou restaurer une sauvegarde existante.

## Stockage et confidentialité

Les versions de CV sont conservées dans le **localStorage du navigateur**. L'application n'exige pas de compte ni de base de données pour éditer un CV.

- Les données restent dans le profil de navigateur utilisé pour créer le CV.
- Elles ne sont pas automatiquement synchronisées entre appareils ou navigateurs.
- Vider les données du site ou supprimer le stockage du navigateur peut effacer les CV enregistrés.
- Pour éviter de perdre son travail, utilise régulièrement **Sauvegarder (JSON)** et conserve le fichier exporté dans un endroit sûr.

Les fichiers PDF et DOCX sont générés depuis l'application et téléchargés sur l'appareil de l'utilisateur.

## Structure du projet

```text
.
├── public/                 # Ressources statiques
├── src/
│   ├── components/
│   │   ├── cv/             # Formulaires, aperçu, modèles, versions et exports
│   │   ├── theme/          # Contrôle du thème
│   │   └── ui/             # Composants d'interface réutilisables
│   ├── hooks/              # Hooks, dont gestion des versions du CV
│   ├── lib/
│   │   ├── export/         # Génération des fichiers PDF et DOCX
│   │   ├── sampleData.ts   # Données d'exemple
│   │   ├── smartPresets.ts # Préréglages par secteur
│   │   └── templateRegistry.ts
│   ├── pages/              # Pages d'accueil, éditeur et page 404
│   ├── test/               # Configuration et tests
│   └── types/              # Types et modèle de données du CV
├── index.html
├── package.json
├── vite.config.ts
└── vitest.config.ts
```

## Notes de développement

- Les routes principales de l'interface sont `/` (accueil) et `/create` (éditeur).
- Les données et métadonnées des CV sont définies dans `src/types/cv.ts`.
- Les modèles sont enregistrés dans `src/lib/templateRegistry.ts`; les préréglages sont définis dans `src/lib/smartPresets.ts`.
- Le projet est une application frontend. Il ne contient pas de backend de comptes ou de synchronisation dans cette configuration.

## Contribution

Les améliorations sont les bienvenues : tests supplémentaires, accessibilité, ajustements des modèles et fiabilité des exports. Pour une contribution, décris clairement le changement proposé et vérifie le lint, les tests et le build avant de soumettre tes modifications.
