# Docker

Pour ce projet, il est possible d'utiliser Docker pour installer localement une base de données PostgreSQL/PostGIS ainsi que le client Pgadmin4.

## Fichier docker-compose.yaml

Le fichier `docker-compose.yaml` permet de définir et de gérer des conteneurs Docker pour le projet. Il contient la configuration nécessaire pour lancer les services PostgreSQL/PostGIS et Pgadmin4. Voici un aperçu des services définis dans ce fichier :

- **postgres** : Ce service utilise l'image `postgis/postgis` pour créer une base de données PostgreSQL avec l'extension PostGIS. Il expose le port 5432 pour permettre les connexions à la base de données.
- **pgadmin** : Ce service utilise l'image `dpage/pgadmin4` pour créer une interface web Pgadmin4. Il expose le port 80 pour accéder à l'interface via un navigateur web.

Pour lancer les services définis dans le fichier `docker-compose.yaml`, placez vous dans le répertoire `docker` du projet (là où se trouve le fichier `docker-compose.yaml`) puis utilisez la commande suivante :
```sh
docker-compose up -d
```

Pour arrêter les services, utilisez la commande suivante :
```sh
docker-compose down
```


