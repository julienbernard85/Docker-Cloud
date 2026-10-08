# Benchmarks des containers

## Voici les différents benchmarks à différents moments de vie et selon les paramètres

cpus: "0.25"
memory: 128M

### A la création des containers en stand-by

CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT   MEM %     NET I/O       BLOCK I/O       PIDS
7e33876bed53   games-server-proxy   0.00%     12.7MiB / 128MiB    9.92%     896B / 0B     4.1kB / 4.1kB   17
b0b12665f278   games-front          0.00%     15.11MiB / 128MiB   11.80%    1.05kB / 0B   0B / 0B         7
97477cbe820c   games-back           0.02%     22.16MiB / 128MiB   17.32%    1.05kB / 0B   188kB / 0B      1

### Lors d'un chargement d'une page de détail
CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT   MEM %     NET I/O       BLOCK I/O       PIDS
7e33876bed53   games-server-proxy   0.63%     12.86MiB / 128MiB   10.05%    34.4kB / 34.4kB   4.1kB / 8.19kB   17
b0b12665f278   games-front          1.33%     14.48MiB / 128MiB   11.32%    20.8kB / 10.8kB   1.69MB / 0B      11
97477cbe820c   games-back           0.45%     22.25MiB / 128MiB   17.39%    4.77kB / 4.59kB   193kB / 172kB    1

On peut constater que le front travaille beaucoup plus que les deux autres pour afficher les informations, tandis que le proxy utilise un peu de ressources pour transiter les données et demandes et le back très peu pour envoyer les données demandées.
Pour la mémoire, le back en utilise davantage que les autres, certainements pour garder en mémoire les informations du site à afficher.

cpus: "0.5"
memory: 256M

### En stand-by 

CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT   MEM %     NET I/O       BLOCK I/O         PIDS
cd040cb3bfbe   games-server-proxy   0.00%     12.87MiB / 256MiB   5.03%     986B / 0B     1.57MB / 8.19kB   17
fb32a2a09e50   games-front          0.00%     12.46MiB / 256MiB   4.87%     1.49kB / 0B   3.66MB / 0B       7
d349ca3d7460   games-back           0.04%     22.14MiB / 256MiB   8.65%     1.49kB / 0B   8.2MB / 172kB     1

### Lors d'un chargement d'une page de détail

CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O         PIDS
cd040cb3bfbe   games-server-proxy   0.52%     13.45MiB / 256MiB   5.26%     40.7kB / 40.7kB   1.57MB / 8.19kB   17
fb32a2a09e50   games-front          0.94%     14.77MiB / 256MiB   5.77%     25kB / 12.9kB     5.35MB / 0B       11
d349ca3d7460   games-back           0.48%     22.23MiB / 256MiB   8.68%     7.07kB / 5.25kB   8.2MB / 172kB     1

La différence en stand-by est presque inexistante, tandis qu'en chargement on peut voir un peu la différence, cependant le pourcentage d'utilisation du CPU lors d'un chargement d'une page change beaucoup sur le moment.

### Résultats des tests de ressources
| Configuration | Situation | Service | CPU | Mémoire utilisée | Mémoire % | Réseau |
|---|---|---|---:|---:|---:|---:|
| **0.25 CPU / 128M** | Stand-by | Proxy Nginx | 0.00% | 12.70 MiB | 9.92% | 896 B / 0 B |
| **0.25 CPU / 128M** | Stand-by | Front Node.js | 0.00% | 15.11 MiB | 11.80% | 1.05 kB / 0 B |
| **0.25 CPU / 128M** | Stand-by | Back Flask | 0.02% | 22.16 MiB | 17.32% | 1.05 kB / 0 B |
| **0.25 CPU / 128M** | Chargement détail | Proxy Nginx | 0.63% | 12.86 MiB | 10.05% | 34.4 kB / 34.4 kB |
| **0.25 CPU / 128M** | Chargement détail | Front Node.js | **1.33%** | 14.48 MiB | 11.32% | 20.8 kB / 10.8 kB |
| **0.25 CPU / 128M** | Chargement détail | Back Flask | 0.45% | **22.25 MiB** | **17.39%** | 4.77 kB / 4.59 kB |
| **0.50 CPU / 256M** | Stand-by | Proxy Nginx | 0.00% | 12.87 MiB | 5.03% | 986 B / 0 B |
| **0.50 CPU / 256M** | Stand-by | Front Node.js | 0.00% | 12.46 MiB | 4.87% | 1.49 kB / 0 B |
| **0.50 CPU / 256M** | Stand-by | Back Flask | 0.04% | 22.14 MiB | 8.65% | 1.49 kB / 0 B |
| **0.50 CPU / 256M** | Chargement détail | Proxy Nginx | 0.52% | 13.45 MiB | 5.26% | 40.7 kB / 40.7 kB |
| **0.50 CPU / 256M** | Chargement détail | Front Node.js | **0.94%** | 14.77 MiB | 5.77% | 25 kB / 12.9 kB |
| **0.50 CPU / 256M** | Chargement détail | Back Flask | 0.48% | **22.23 MiB** | 8.68% | 7.07 kB / 5.25 kB |


Les ressources du CPU ne dépassent jamais 5% et très rarement 1% lors d'un chargement et la mémoire est plutôt stable, la vitesse de chargement d'une page est toujours rapide et instantanée.
On peut en conclure que limiter au plus bas les containers reste raisonable car augmenter la limite n'apporte pas d'amélioration à l'utilisation de l'application.