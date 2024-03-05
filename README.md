# POC (Proof Of Concepts) pour le projet d'intégration

Ce projet contient le code pour une application servant de preuve de concepts (POC ou Proof Of concepet) pour le projet d'intégration du M2CCI/M2 GEOMAS. Il contient 3 dossiers :

- **bd** : ce dossier regroupe les scripts de création de la base de données Postgres/PostGIS. **Attention**, avant d'exécuter les scripts il faudra 
au préalable que vous ayez créé un schema <kbd>test</kbd> sur votre base.
- **backend** : ce dossier contient le code source du backend (Springboot/Java) qui permet d'offrir un API REST pour l'accès aux données de la base
- **frontend** : ce dossier contient le code source du front-end (il utilise Leaflet pour le web Mapping et Vue3)

Pour pouvoir exécuter cette application il faut 

1. créer le schema **test** dans votre base de données qui doit bénéficier de l'extension PostGIS
2. exécuter les scripts **createSchema.sql** puis **createData.sql** situés dans le dossier bd
3. modifier le fichier **application.properties** situé dans le back-end (chemin d'accès `backend/src/main/resources`) afin 
d'accéder à votre base de données (voir les idnications en commentaire dans ce fichier).
4. lancer le serveur back-end en exécutant le *main* de la classe  **SpringjdbcApplication** (situé dans `main/java`)
5. ouvrir avec LiveShare la page **index.html** du front-end

