# Projet Docker

## Présentation du projet

Ce projet a pour objectif de mettre en place une application web conteneurisée avec Docker.

L'application prend la forme d'une vitrine de jeux vidéo permettant d'afficher plusieurs jeux sous forme de cartes visuelles.

Chaque jeu peut contenir :

- une image de présentation ;
- un GIF animé au survol si disponible ;
- le nom du jeu.

En cliquant sur l'image de présentation, l'utilisateur est redirigé vers une page détaillée du jeu contenant :

- une description détaillée ;
- des notes provenant de sites spécialisés ;
- les plateformes disponibles ;
- des liens vers les sites d'achat officiels.

L'objectif principal du projet n'est pas uniquement de développer l'application, mais surtout de mettre en pratique plusieurs notions liées à Docker :

- création d'images Docker personnalisées ;
- utilisation de plusieurs Dockerfiles ;
- communication entre plusieurs conteneurs ;
- utilisation d'un reverse proxy ;
- orchestration avec Docker Compose ;
- gestion des ports et du réseau Docker ;
- utilisation de variables d'environnement ;
- limitation des ressources CPU et mémoire ;
- gestion du cycle de vie des conteneurs.

---

## Fonctionnement général

L'application repose sur trois services principaux :

- **Frontend Node.js / Express** : affiche l'interface, les images, les GIFs et les informations des jeux ;
- **Backend Python / Flask** : fournit les données des jeux via une API ;
- **Nginx** : sert de reverse proxy entre l'utilisateur, le frontend et le backend.

L'utilisateur accède uniquement au proxy Nginx.

Nginx redirige ensuite les requêtes :

```text
/       → Frontend
/api/   → Backend
```

Le frontend et le backend ne sont donc pas directement exposés à l'utilisateur.

---

## Architecture de l'application

```text
                         UTILISATEUR
                             │
                             │
                    http://localhost:8080
                             │
                             ▼
                    ┌─────────────────┐
                    │      NGINX      │
                    │  Reverse Proxy  │
                    │     Port 80     │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
             / │                           │ /api/
               ▼                           ▼
      ┌─────────────────┐         ┌─────────────────┐
      │      FRONT      │         │      BACK       │
      │     Node.js     │         │ Python / Flask  │
      │    Port 3000    │         │    Port 5000    │
      └────────┬────────┘         └────────┬────────┘
               │                           │
               ▼                           ▼
        HTML / CSS / JS              games.json
        Images / GIFs              Données des jeux
```

Les trois conteneurs communiquent à travers un réseau Docker privé de type `bridge`.

Docker permet aux services de communiquer grâce à leur nom :

```text
front:3000
back:5000
```

Il n'est donc pas nécessaire de définir manuellement les adresses IP des conteneurs.

---

## Frontend

Le frontend utilise **Node.js avec Express**.

Son rôle est de servir :

- les pages HTML ;
- les fichiers CSS ;
- les fichiers JavaScript ;
- les images ;
- les GIFs animés.

Express est utilisé comme serveur web léger pour rendre les fichiers présents dans le dossier `public`.

Les dépendances du frontend sont déclarées dans :

```text
front/package.json
```

puis installées lors de la construction de l'image Docker avec :

```bash
npm install
```

Le frontend récupère ensuite les informations des jeux depuis le backend à travers l'API.

---

## Backend

Le backend utilise **Python avec Flask**.

Flask permet de créer une API simple chargée de transmettre les données des jeux au frontend.

Les dépendances Python sont déclarées dans :

```text
back/requirements.txt
```

et installées lors de la construction de l'image.

Les informations des jeux sont stockées dans :

```text
back/data/games.json
```

Ce fichier contient notamment :

- le nom du jeu ;
- sa description ;
- le nom de son image et éventuellement de son GIF ;
- les plateformes disponibles ;
- les notes de sites spécialisés ;
- les liens vers les différentes boutiques.

Le backend propose notamment les routes :

```text
GET /games
GET /games/<id>
```

La première retourne la liste des jeux tandis que la seconde retourne les informations d'un jeu précis.

---

## Reverse proxy

Le troisième conteneur utilise **Nginx**.

Il constitue le point d'entrée unique de l'application.

Les requêtes destinées au site sont envoyées vers le frontend :

```text
/
↓
front:3000
```

Les requêtes destinées à l'API sont envoyées vers le backend :

```text
/api/
↓
back:5000
```

La configuration de cette redirection est définie dans :

```text
server/nginx.conf
```

Seul Nginx publie un port vers la machine hôte.

---

## Variables d'environnement

La configuration générale est regroupée dans le fichier `.env`.

```env
APP_PORT=8080

FRONT_PORT=3000
BACK_PORT=5000
PROXY_PORT=80

NODE_ENV=production
FLASK_ENV=production
```

Ces variables permettent notamment de définir :

- le port d'accès à l'application ;
- le port interne du frontend ;
- le port interne du backend ;
- le port du proxy ;
- l'environnement d'exécution de Node.js et Flask.

Docker Compose récupère ces valeurs et les transmet aux conteneurs concernés.

Cela permet de modifier certains paramètres de l'application sans avoir à modifier directement les Dockerfiles ou le code source.

---

## Orchestration avec Docker Compose

Le fichier `docker-compose.yml` permet de construire et de démarrer les trois services ensemble.

Il gère notamment :

- la construction des images Docker ;
- les variables d'environnement ;
- les ports ;
- le réseau Docker ;
- les dépendances entre services ;
- les limites de ressources.

Le proxy dépend du frontend et du backend :

```yaml
depends_on:
  - front
  - back
```

Cela permet de démarrer le frontend et le backend avant le reverse proxy.

---

## Gestion des ressources

Chaque conteneur possède actuellement une limite de :

```yaml
cpus: "0.25"
memory: 128M
```

Ces valeurs ont été choisies après observation de la consommation des différents services avec `docker stats`.

Les résultats et comparaisons des différentes allocations testées sont détaillés dans :

```text
benchmarks.md
```

---

## Gestion de l'arrêt des conteneurs

Le frontend Node.js et le backend Python gèrent les signaux :

```text
SIGTERM
SIGINT
```

Lorsqu'un conteneur est arrêté, l'application intercepte le signal et ferme proprement son serveur.

Cela permet notamment d'éviter qu'un processus soit interrompu brutalement et permet aux conteneurs de terminer avec un code de sortie `0`.

---

## Stockage des données

Les données des jeux sont actuellement stockées dans :

```text
back/data/games.json
```

Les ressources visuelles sont stockées dans :

```text
front/public/images/
```

Aucun volume Docker n'est utilisé pour le moment.

Ce choix est volontaire : les données et les images sont actuellement statiques et font partie directement de l'application lors de la construction des images Docker.

Un volume deviendrait utile si l'application permettait plus tard de modifier les données pendant son fonctionnement, par exemple pour :

- ajouter un nouveau jeu ;
- modifier une description ;
- téléverser une nouvelle image ;
- supprimer un jeu.

---

## Structure du projet

```text
Docker/
│
├── front/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── index.html
│       ├── game.html
│       ├── style.css
│       ├── index.js
│       ├── game.js
│       └── images/
│
├── back/
│   ├── Dockerfile
│   ├── app.py
│   ├── requirements.txt
│   └── data/
│       └── games.json
│
├── server/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .env
├── benchmarks.md
└── README.md
```

---

## Technologies utilisées

| Partie | Technologie | Rôle |
|---|---|---|
| Frontend | Node.js / Express | Interface et ressources statiques |
| Backend | Python / Flask | API et gestion des données |
| Proxy | Nginx | Reverse proxy |
| Données | JSON | Informations des jeux |
| Conteneurisation | Docker | Construction et exécution des conteneurs |
| Orchestration | Docker Compose | Gestion des différents services |

---

## Lancement

Construire et démarrer les conteneurs :

```bash
docker compose up --build
```

L'application est ensuite accessible sur :

```text
http://localhost:8080
```

Arrêter les conteneurs :

```bash
docker compose down
```