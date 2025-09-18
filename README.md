Projet 16: Gestion de ticket dans un station téléphérique
- RAJAONAH Mickael, L2IDEV, n°57
- RAZAFINIRINA Carenne Fanoëlah, L2IDEV, n°37
- RASOANAIVO Harena Fitiavana, L2IDEV, n°35
- RATEFINJANAHARY Finaritra Ny Avo, L2IDEV, n°4
- RAMANDIMBIMANANA Tojoniaina Mickael, L2IDEV, n°3
- RAZAKANTOANINA Tiavina Miarivola, L2IDEV, n°5


# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.




--Documentation du projet my-telepherique-api--

1. Outils et technologies utilisés
Langage & environnement

TypeScript : langage basé sur JavaScript avec typage fort.

Node.js : environnement d’exécution côté serveur.

Framework principal

NestJS : framework backend qui structure le projet en modules, contrôleurs et services, favorisant une architecture claire et évolutive.

Base de données

PostgreSQL : système de gestion de base de données relationnelle.

TypeORM : ORM qui fait le lien entre les entités du code et les tables SQL (gère relations, migrations, requêtes, etc.).

Tests

Jest : framework de tests intégré au projet pour valider les fonctionnalités.

Outils de développement

Nodemon : relance automatique du serveur lors de modifications.

ESLint : vérification des règles de style et de bonne pratique du code.

Scripts npm : automatisent le démarrage, la compilation et les tests.

Configuration

Fichier .env : contient les variables sensibles (connexion DB, port du serveur, secret JWT).

Fichier tsconfig.json : configure la compilation TypeScript.

Fichier package.json : centralise les dépendances et les scripts.

2. Structure du projet

Le projet suit une architecture NestJS classique :

main.ts : point d’entrée qui démarre l’application.

app.module.ts : module racine qui regroupe et configure les autres modules.

app.controller.ts : fournit des routes simples (par ex. une route de test ou de santé).

Modules métier

AuthModule

Gère l’authentification et l’inscription des utilisateurs.

Utilise des jetons JWT pour sécuriser l’accès.

UsersModule

Centralise les opérations liées aux utilisateurs (création, liste, mise à jour, suppression).

S’appuie sur une entité User pour stocker les informations en base.

TicketsModule

Responsable de la gestion des tickets du téléphérique.

Relié à l’utilisateur afin de suivre qui possède quel ticket.

PaymentsModule

Permet de gérer les paiements associés aux tickets.

Relie un paiement à un utilisateur et à un ticket.

Chaque module est composé de :

Contrôleurs → définissent les routes HTTP (endpoints).

Services → contiennent la logique métier.

Entités → représentent les tables de la base de données.

3. Fonctionnement général

Lancement de l’application

Le serveur démarre via NestJS.

La connexion à PostgreSQL est initialisée grâce à TypeORM.

Authentification

Lorsqu’un utilisateur se connecte ou s’inscrit, un service vérifie ses données et renvoie un JWT.

Ce jeton est utilisé pour accéder aux routes protégées.

Gestion des utilisateurs

Les contrôleurs du module Users permettent de consulter, créer, modifier ou supprimer des utilisateurs.

Gestion des tickets

Les utilisateurs authentifiés peuvent obtenir leurs tickets.

Les tickets sont reliés à des comptes utilisateurs en base.

Gestion des paiements

Lorsqu’un ticket est acheté, une opération de paiement est enregistrée.

Le système peut suivre l’état et l’historique des transactions.