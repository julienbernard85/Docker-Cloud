# Projet Docker

## Présentation du projet

Ce projet a pour objectif de mettre en place une application web conteneurisée avec Docker.

L'application prend la forme d'une vitrine de jeux vidéo permettant d'afficher plusieurs jeux sous forme de cartes visuelles.

Chaque jeu pourra contenir :

- une image de présentation ;
- un GIF animé au survol ;
- le nom du jeu ;
- une description détaillée ;
- des notes provenant de sites spécialisés ;
- les plateformes disponibles ;
- des liens vers les sites d'achat officiels.

L'objectif principal du projet n'est pas uniquement de développer l'application, mais surtout de mettre en pratique plusieurs notions liées à Docker :

- création d'images Docker personnalisées ;
- utilisation de plusieurs Dockerfiles ;
- communication entre plusieurs conteneurs ;
- utilisation d'un reverse proxy ;
- gestion des ports ;
- création d'un réseau Docker ;
- limitation des ressources CPU et mémoire ;
- orchestration des conteneurs avec Docker Compose ;
- gestion du cycle de vie des conteneurs.


## Architecture de l'application

L'application est composée de trois conteneurs principaux :

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
               │ /                         │ /api/
               ▼                           ▼
      ┌─────────────────┐         ┌─────────────────┐
      │      FRONT      │         │      BACK       │
      │      Node.js    │         │ Python / Flask  │
      │    Port 3000    │         │    Port 5000    │
      └────────┬────────┘         └────────┬────────┘
               │                           │
               │                           │
               ▼                           ▼
        HTML / CSS / JS              games.json
        Images / GIFs          Données des jeux