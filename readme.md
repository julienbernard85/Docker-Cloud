# Projet Docker

## Présentation du projet

Ce projet a pour objectif de mettre en place une application web conteneurisée avec Docker.

L'application prend la forme d'une vitrine de jeux vidéo permettant d'afficher plusieurs jeux sous forme de cartes visuelles.

Chaque jeu pourra contenir :

- une image de présentation ;
- un GIF animé au survol si disponible ;
- le nom du jeu ;

En cliquant sur l'image de présentation, l'utilisateur est emmené sur une page détaillé du jeu avec : 

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
- limitation des ressources CPU et mémoire.

---

## Fonctionnement général

L'application repose sur trois services principaux :

- **Frontend Node.js / Express** : affiche l'interface, les images et les informations des jeux ;
- **Backend Python / Flask** : fournit les données des jeux via une API ;
- **Nginx** : sert de reverse proxy entre l'utilisateur, le frontend et le backend.

L'utilisateur accède uniquement au proxy Nginx.

Nginx redirige ensuite les requêtes :

```text
/       → Frontend
/api/   → Backend
```

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

Les trois conteneurs communiquent à travers un réseau Docker privé.

---

## Frontend

Le frontend utilise **Node.js avec Express**.

Son rôle est de servir :

- les pages HTML ;
- les fichiers CSS ;
- les fichiers JavaScript ;
- les images ;
- les futurs GIFs animés.

Le frontend récupère les informations des jeux depuis le backend via l'API.

---

## Backend

Le backend utilise **Python avec Flask**.

Il fournit les données des jeux au frontend sous forme de JSON.

Les informations sont actuellement stockées dans :

```text
back/data/games.json
```

Le backend propose notamment les routes :

```text
GET /games
GET /games/<id>
```

---

## Reverse proxy

Le troisième conteneur utilise **Nginx**.

Il sert de point d'entrée unique pour l'application.

Les requêtes normales sont envoyées vers le frontend :

```text
/ 
front:3000
```

Les requêtes destinées à l'API sont envoyées vers le backend :

```text
/api/  
back:5000
```

Le frontend et le backend ne sont donc pas directement exposés à l'utilisateur.

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

| Partie | Technologie |
|---|---|
| Frontend | Node.js / Express |
| Backend | Python / Flask |
| Proxy | Nginx |
| Données | JSON |
| Conteneurisation | Docker |
| Orchestration | Docker Compose |

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