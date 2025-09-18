# API Téléphérique - Documentation d'Installation

# Description
Application de gestion des billets de téléphérique développée avec Fresh (Deno) et PostgreSQL.

# Prérequis
- Deno v1.38+ installé
- PostgreSQL v12+ installé et en fonctionnement
- Git (optionnel)

# Installation

## 1. Télécharger le projet
```bash
cd my-telepherique-api
```

## 2. Installer Deno (si pas déjà installé)
```bash
# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh
```

#### Important pour Windows : Après l'installation, ajouter Deno au PATH :
1. Ouvrir "Variables d'environnement système"
2. Modifier la variable "Path"
3. Ajouter : `C:\Users\User\.deno\bin`
4. Redémarrer le terminal

#### Alternative Windows := Si vous ne voulez pas modifier le PATH, utilisez le chemin complet :
```cmd
"C:\Users\User\.deno\bin\deno.exe" task start
```

## 3. Configuration de la base de données PostgreSQL

#### Créer la base de données
```sql
CREATE DATABASE ticketsdb;
CREATE USER postgres WITH PASSWORD '0000';
GRANT ALL PRIVILEGES ON DATABASE ticketsdb TO postgres;
```

#### Créer la table tickets
```sql
\c ticketsdb;

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    passenger VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données exemple
INSERT INTO tickets (code, passenger, price, status) VALUES
('TK240917001', 'Mickael Rajaonah', 25.00, 'active'),
('TK240917002', 'Mickael Ramamandimbimanana', 30.00, 'boarding'),
('TK240917003', 'Carenne Razafinirina', 25.00, 'used');
```

## 4. Configuration des variables d'environnement
Créer un fichier `.env` à la racine du projet :
```bash
DATABASE_URL=postgresql://postgres:0000@localhost:5432/ticketsdb
PORT=8000
```

### 5. Installer les dépendances et démarrer l'application
```bash
# Vérifier et installer les dépendances
deno task check

# Démarrer en mode développement
deno task start

# Si deno n'est pas dans le PATH (Windows uniquement) :
"C:\Users\User\.deno\bin\deno.exe" task start
```

L'application sera accessible à l'adresse : http://localhost:8000

# Scripts disponibles

```bash
# Démarrer en mode développement
deno task start

# Construire pour la production
deno task build

# Exécuter en mode production
deno task preview

# Exécuter les tests
deno task test

# Tests en mode watch
deno task test:watch

# Vérification du code
deno task check
```

# Fonctionnalités

## Interface utilisateur
- ✅ Tableau de bord en temps réel
- ✅ Création de billets avec code auto-généré
- ✅ Gestion des statuts (Actif, Embarquement, Utilisé, Annulé)
- ✅ Filtrage par statut
- ✅ Interface responsive en français

# API REST
- ✅ `GET /api/tickets` - Liste tous les billets
- ✅ `POST /api/tickets` - Crée un nouveau billet
- ✅ `GET /api/tickets/:id` - Récupère un billet spécifique
- ✅ `PUT /api/tickets/:id` - Met à jour un billet
- ✅ `DELETE /api/tickets/:id` - Supprime un billet

# Tests automatisés
- ✅ Tests unitaires des fonctions utilitaires
- ✅ Tests d'intégration de l'API
- ✅ Tests de validation des données

# Structure du projet

```
my-telepherique-api/
├── components/           # Composants réutilisables
│   └── Button.tsx
├── islands/             # Composants interactifs côté client
│   └── TicketList.tsx
├── lib/                 # Utilitaires et configuration
│   └── db.ts           # Configuration PostgreSQL
├── routes/              # Routes de l'application
│   ├── api/            # API REST
│   │   ├── tickets.ts
│   │   └── tickets/[id].ts
│   ├── index.tsx       # Page principale
│   └── _app.tsx        # Layout principal
├── static/             # Fichiers statiques
├── tests/              # Tests automatisés
│   ├── utils.test.ts
│   ├── api.test.ts
│   └── db.test.ts
├── deno.json           # Configuration Deno
├── fresh.config.ts     # Configuration Fresh
└── .env               # Variables d'environnement
```

# Dépannage

## Erreur de connexion à la base de données
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans le fichier `.env`
3. Vérifier que la base de données `ticketsdb` existe

## Port 8000 déjà utilisé
Modifier la variable `PORT` dans le fichier `.env`

## Erreurs de permissions Deno
Utiliser les flags `--allow-all` ou spécifier les permissions nécessaires

# Support
Pour toute question ou problème, consulter :
- [Documentation Deno](https://deno.land/manual)
- [Documentation Fresh](https://fresh.deno.dev/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)