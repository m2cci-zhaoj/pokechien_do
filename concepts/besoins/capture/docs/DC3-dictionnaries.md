## Tables et dictionnaire des variables (Fichiers GEOMAS)

Pour l'instant, le modèle de base de données à partager est composé de 7 tables : 
  
  - Table brute des points GPS - `mesure_gps` contient l'ensemble des points GPS capturés pendant la semaine de collecte (résolution temporelle de 1s)
  
  - Tables issues de la segmentation des points GPS et enrichies par les périodes d'accélérométrie (intensité de l'activité physique associée à chaque MOVE ou STOP détecté) : `move_mbgp` - elle contient l'ensemble des LIGNES constituant chaque SEGMENT détecté entre 2 arrêts (les stops). Rappel : elle n'est pas enrichie sémantiquement (on ne connaît pas le mode de transport associé à un segment).  
`stop_mbgp` - elle contient l'ensemble des POINTS constituant chaque arrêt détecté (Un arrêt peut tout aussi bien être le lieu de travail fréquenté pendant plusieurs heures continues que le feu rouge sur la route pendant quelques dizaines de secondes).   

L'accélérométrie est caractérisée, pour chaque séquence (`stop` ou `move`), par 4 variables qui indiquent le temps d'activité compté (secondes) en fonction de 4 niveaux d'intensité (sédentaire, léger, modéré et fort). NB : dans le descriptif des champs pour ces variables, PA = Physical Activity.
  
  - Tables issues d'un support de capture papier, le carnet de bord (activités/déplacements/poi) : `carnet_deplacement` - ensemble des déplacements déclarés par le participant pendant une semaine de collecte (attention, un déplacement peut inclure des moves et des stops issus de la segmentation et différents modes de transport) - elle renseigne les modes des transports utilisés (y compris s'il s'agit des déplacements de loisirs), la durée des déplacements et les accompagnants éventuels.  
  `carnet_activite` - ensemble des activités déclarées dans différents lieux fréquentés pendant la semaine de collecte (domicile, travail, courses, loisirs, etc.)  
  `carnet_poi` - ensemble des POI fréquentés par le participant (un POI est un lieu fréquenté plus d'une fois dans la semaine de collecte).
  
  - Table issue du capteur de particules fines : `pm_concentration` - elle contient l'ensemble des mesures régulièrement enregistrées par le capteur porté par chaque participant (rappel : 2 mesures enregistrées à 10s d'intervalle toutes les 2 minutes) ;
  

### Table traitée issue du capteur GPS (mise en forme mais non passée par l'algo de segmentation) `mesure_gps`

Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_pid             | bigint                   | Identifiant unique du point GPS NON NULL PK  
 i_id_pers_session | smallint                 | Identifiant combiné du participant et de sa session
 i_id_pers         | smallint                 | Numéro du participant  
 i_id_session      | smallint                 | Numéro de session de collecte  
 i_ts              | bigint                   | Timestamp de capture du point en UNIX (ms)
 dt_ts_utc         | timestamp with time zone | Timestamp de capture du point GPS (UTC)
 r_lat             | double precision         | Latitude du point WGS84 (4326)
 r_long            | double precision         | Longitude du point WGS84(4326)
 r_speed           | double precision         | Vitesse estimée par le capteur (km/h)
 r_course          | double precision         | ...
 s_mode            | varchar(3)               | ...
 s_fix             | varchar(3)               | ...
 i_alt             | smallint                 | Altitude estimée par le capteur (m)
 s_mode1           | varchar(3)               | ...
 i_mode2           | integer                  | ...
 i_sat_used        | smallint                 | Nombre de satellites utilisés pour la mesure
 r_pdop            | double precision         | Precision of Dilution
 r_hdop            | double precision         | Horizontal Dilution
 r_vdop            | double precicion         | Vertical Dilution
 i_sat_in_view     | smallint                 | Nombre de satellites visibles pour effectuer la mesure
 geom_2154         | geometry                 | Géométrie de la table (POINTS), en Lambert93 (2154)

### Table issue de la segmentation `move_mbgp`  
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_move_id          | integer                  |  Identifiant unique du déplacement NON NULL PK  
 i_id_pers_session  | smallint                 |  Identifiant combiné du participant et de sa session
 i_id_pers          | smallint                 |  Identifiant du participant  
 i_id_session       | smallint                 |  Identifiant de la session
 i_id_seq           | integer                  |  Identifiant de la séquence de déplacement
 dt_start_utc       | timestamp with time zone |  Timestamp de début de déplacement (UTC)
 dt_end_utc         | timestamp with time zone |  Timestamp de fin de déplacement (UTC)
 dt_start_paris     | varchar(50)              |  Timestamp de début de déplacement (fuseau Europe/Paris sauvé en character)
 dt_end_paris       | varchar(50)              |  Timestamp de fin de déplacement (fuseau Europe/Paris sauvé en character)
 i_pid_start        | integer                  |  Identifiant du premier point gps de la séquence de déplacement
 i_pid_end          | integer                  |  Identifiant du dernier point gps de la séquence de déplacement
 i_duration_secs    | integer                  |  Durée de la séquence de déplacement en secondes
 i_distance_m       | integer                  |  Distance parcourue (m) pendant la séquence (arrondi au m près)
 r_speed_ms         | real                     |  Vitesse en m/s de la séquence de déplacement
 geom_2154          | geometry                 |  Géométrie de la table (LIGNES), en Lambert93 (2154)
 i_weartime         | integer                  |  Temps de port du capteur
 i_time_sed_secs    | integer                  |  Accel - temps de sédentarité pendant la séquence
 i_time_light_secs  | integer                  |  Accel - temps de PA légère pendant la séquence
 i_time_mod_secs    | integer                  |  Accel - temps de PA modérée pendant la séquence
 i_time_vig_secs    | integer                  |  Accel - temps de PA intense pendant la séquence
 i_n_sedbreaks      | integer                  |  *(à vérifier auprès de Colin)*
 i_id_carnet_a      | integer                  |  Identifiant unique d'activité (FK associée à la table `carnet_activite`)
 i_id_carnet_d      | integer                  |  Identifiant unique de déplacement (FK associée à la table `carnet_deplacement`)


### Table issue de la segmentation `stop_mbgp`  
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_stop_id          | integer                  |  Identifiant unique de l'arrêt NON NULL PK  
 i_id_pers_session  | smallint                 |  Identifiant combiné du participant et de sa session
 i_id_pers          | smallint                 |  Identifiant du participant  
 i_id_session       | smallint                 |  Identifiant de la session
 i_id_seq           | integer                  |  Identifiant de la séquence d'arrêt
 dt_start_utc       | timestamp with time zone |  Timestamp de début de la séquence d'arrêt (UTC)
 dt_end_utc         | timestamp with time zone |  Timestamp de fin de la séquence d'arrêt (UTC)
 dt_start_paris     | varchar(50)              |  Timestamp de début de la séquence d'arrêt (fuseau Europe/Paris sauvé en character)
 dt_end_paris       | varchar(50)              |  Timestamp de fin de la séquence d'arrêt (fuseau Europe/Paris sauvé en character)
 i_pid_start        | integer                  |  Identifiant du premier point gps inclus à la séquence d'arrêt
 i_pid_end          | integer                  |  Identifiant du dernier point gps inclus à la séquence d'arrêt
 i_duration_secs    | integer                  |  Durée de la séquence d'arrêt en secondes
 geom_2154          | geometry                 |  Géométrie de la table (POINTS) en Lambert93 (2154)
 i_weartime         | integer                  |  Temps de port du capteur
 i_time_sed_secs    | integer                  |  Accel - temps de sédentarité pendant la séquence
 i_time_light_secs  | integer                  |  Accel - temps de PA légère pendant la séquence
 i_time_mod_secs    | integer                  |  Accel - temps de PA modérée pendant la séquence
 i_time_vig_secs    | integer                  |  Accel - temps de PA intense pendant la séquence
 i_n_sedbreaks      | integer                  |  *(à vérifier auprès de Colin)*
 i_id_carnet_a      | integer                  |  Identifiant unique d'activité (FK associée à la table `carnet_activite`)
 i_id_carnet_d      | integer                  |  Identifiant unique de déplacement (FK associée à la table `carnet_deplacement`)


### Table `carnet_deplacement`  
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_id_carnet_d      | integer                  |  Identifiant unique du déplacement NON NULL PK
 i_id_pers_session  | smallint                 |  Identifiant combiné du participant 
 i_id_pers          | smallint                 |  Identifiant du participant *(à ajouter dans le code car non existant aujour'hui)*
 i_id_session       | smallint                 |  Identifiant de la session *(à ajouter dans le code car non existant aujourd'hui)*
 i_id_dep_jour      | smallint                 |  Numéro identifiant du déplacement pendant la journée de collecte
 dt_start_dep_utc   | timestamp with time zone |  Timestamp du début de déplacement (UTC)
 dt_end_dep_utc     | timestamp with time zone |  Timestamp de fin du déplacement (UTC)
 i_duree_mins       | real                     |  Durée du déplacement (minutes)
 s_code_dep         | varchar(15)              |  Mode(s) de déplacement *(séparés par ; si multiples)*
 b_dep_loisir       | boolean                  |  Le déplacement est-il associé à la pratique d'une activité de loisir ?
 i_enf_menage       | smallint                 |  Nombre d'enfants du ménage accompagnant
 i_enf_autre        | smallint                 |  Nombre d'enfants hors ménage accompagnant
 i_adul_menage      | smallint                 |  Adulte du ménage accompagnant 
 i_adul_autre       | smallint                 |  Nombre d'adultes hors ménage accompagnant


### Table `carnet_activite`  
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_id_carnet_a      | integer                  |  Identifiant unique de l'activité NON NULL PK
 i_id_pers_session  | smallint                 |  Identifiant combiné du participant et de sa session, élément 1 de FK pour associer à la table des POI
 i_id_pers          | smallint                 |  Identifiant du participant *(à ajouter dans le code car non existant aujour'hui)*
 i_id_session       | smallint                 |  Identifiant de la session *(à ajouter dans le code car non existant aujourd'hui)*
 i_id_act_jour      | smallint                 |  Numéro identifiant de l'activité pratiquée pendant la journée
 dt_start_act_utc   | timestamp with time zone |  Timestamp du début de l'activité (UTC)
 dt_end_act_utc     | timestamp with time zone |  Timestamp de fin de l'activité (UTC)
 i_duree_mins       | real                     |  Durée de l'activité pratiquée (minutes)
 i_code_act         | smallint                 |  Code identifiant le type d'activité pratiquée 
 s_code_poi         | character(1)             |  Lettre identifiant le POI, élément 2 de la FK pour associer à la table des POI 
 s_non_poi          | text                     |  Identifiant/Nom de lieu non POI


### Table `carnet_poi`  
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_id_poi           | integer                  |  Identifiant unique du POI NON NULL 
 i_id_pers_session  | smallint                 |  Identifiant combiné du participant et de sa session, élément 1 de la PK
 i_id_pers          | smallint                 |  Identifiant du participant *(à ajouter dans le code car non existant aujour'hui)*
 i_id_session       | smallint                 |  Identifiant de la session *(à ajouter dans le code car non existant aujourd'hui)*
 s_code_poi         | character(1)             |  Lettre identifiant le POI, élément 2 de la PK
 s_nom_poi          | text                     |  Nom du POI
 i_num_rue          | smallint                 |  Numéro de la rue
 s_nom_rue          | text                     |  Nom de la rue
 i_code_postal      | integer                  |  Code postal
 s_nom_com          | varchar(60)              |  Nom de la commune
 s_information      | text                     |  Autres informations de localisation
 s_obs_enq          | text                     |  Observations de l'enquêteur
 s_obs_saisie       | text                     |  Observations lors de la saisie
   
   
### Table traitée issue du capteur `pm_concentration`
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_pm_id           | integer                  | Numéro de ligne NON NULL PK  
 i_id_session      | smallint                 | Numéro de session de collecte  
 i_id_pers         | smallint                 | Numéro du participant     
 i_id_pers_session | smallint                 | Identifiant combiné du participant et de sa session
 s_id_micropem     | character(10)            | Numéro de série du capteur   
 s_id_filtre       | character varying(10)    | Numéro de série du filtre 
 r_pm_measure      | real                     | Concentration en PM2.5 (microg/m3) 
 dt_ts_utc         | timestamp with time zone | Timestamp associé à la concentration mesurée (UTC)
 dt_date_utc       | date                     | Date seule issue du timestamp
 dt_time_utc       | time without time zone   | Heure seule issue du timestamp
 i_ts_eup          | integer                  | Timestamp converti en UNIX (fuseau Europe/Paris)
 i_mois_eup        | smallint                 | Mois associé à la concentration mesurée
 i_jour_collecte   | smallint                 | Jour de collecte de la mesure (de 1 à 7)
 i_id_carnet_a     | integer                  | Champ FK pour associer la mesure à une activité déclarée (table `carnet_activite`)
 i_id_carnet_d     | integer                  | Champ FK pour associer la mesure à un déplacement déclaré (table `carnet_deplacement`)
 i_move_id         | integer                  | Champ FK pour associer la mesure à un MOVE (table `move_mbgp`)
 i_stop_id         | integer                  | Champ FK pour associer la mesure à un STOP (table `stop_mbgp`)

**Pour compléter, structure des tables donnant la correspondance des codes pour les modes de déplacement et les activités : **

### Table `code_mode_dep`
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 s_code_dep  | varchar(15)          | Code identifiant un mode de déplacement
 s_mode_dep  | varchar(40)          | Mode de déplacement (complet) 
 
### Table `code_activite`
  
Nom du champ |   Type du champ |   Description   
-------------|-----------------|---------------
 i_code_act      | smallint        |  Code identifiant le type d'activité pratiquée
 s_type_activite | text            |  Descriptif complet de l'activité

   
