-- ============================================================
-- ETAPE 1 : Créer les tables (exécuter dans pgAdmin4 Query Tool)
-- ============================================================

-- GPS bruts
CREATE TABLE test_pi.mesure_gps (
    i_pid         INTEGER PRIMARY KEY,
    i_id_pers     INTEGER,
    i_id_session  INTEGER,
    dt_date_utc   TIMESTAMP,
    r_lat         DOUBLE PRECISION,
    r_lon         DOUBLE PRECISION,
    geometry      TEXT  -- WKB hex, sera converti à l'étape 3
);

-- Stops calculés
CREATE TABLE test_pi.stop_mbgp (
    i_stop_id   INTEGER PRIMARY KEY,
    i_pid_start INTEGER,
    i_pid_end   INTEGER,
    geometry    TEXT  -- WKB hex, sera converti à l'étape 3
);

-- Moves calculés (lignes de déplacement)
CREATE TABLE test_pi.move_mbgp (
    i_move_id   INTEGER PRIMARY KEY,
    i_pid_start INTEGER,
    i_pid_end   INTEGER,
    geometry    TEXT  -- WKB hex, sera converti à l'étape 3
);

-- Carnet de déplacements (contient le moyen de transport)
CREATE TABLE test_pi.carnet_deplacement (
    i_id_carnet_d      INTEGER PRIMARY KEY,
    i_jour_collecte    INTEGER,
    i_id_dep_jour      INTEGER,
    i_id_pers_session  INTEGER,
    dt_start_dep_utc   TIMESTAMPTZ,
    dt_end_dep_utc     TIMESTAMPTZ,
    i_duree_secs       INTEGER,
    s_code_dep         VARCHAR(100),
    s_dep_loisirs      VARCHAR(255),
    i_enf_menage       INTEGER,
    i_enf_autre        INTEGER,
    i_adul_menage      INTEGER,
    i_adul_autre       INTEGER,
    b_false_ts_row     BOOLEAN,
    b_false_ts_lead    BOOLEAN
);

-- Carnet d'activités
CREATE TABLE test_pi.carnet_activite (
    i_id_carnet_a     INTEGER PRIMARY KEY,
    i_jour_collecte   INTEGER,
    i_id_act_jour     INTEGER,
    i_id_pers_session INTEGER,
    dt_start_act_utc  TIMESTAMPTZ,
    dt_end_act_utc    TIMESTAMPTZ,
    i_duree_secs      INTEGER,
    s_code_act        VARCHAR(100),
    s_code_poi        VARCHAR(100),
    s_non_poi         VARCHAR(255),
    b_false_ts_row    BOOLEAN,
    b_false_ts_lead   BOOLEAN
);

-- Points d'intérêt
CREATE TABLE test_pi.carnet_poi (
    i_id_poi          INTEGER PRIMARY KEY,
    i_id_pers_session INTEGER,
    s_code_poi        VARCHAR(100),
    s_code_act        VARCHAR(100),
    s_nom_poi         VARCHAR(255),
    i_num_rue         INTEGER,
    s_nom_rue         VARCHAR(255),
    i_code_postal     INTEGER,
    s_nom_com         VARCHAR(255),
    s_information     VARCHAR(500),
    s_obs_enq         VARCHAR(500),
    s_obs_saisie      VARCHAR(500)
);


-- ============================================================
-- ETAPE 2 : Importer les CSV via pgAdmin4 Import/Export
-- ============================================================
-- Pour chaque table : clic droit > Import/Export Data...
--
-- mesure_gps_2025.csv  → test_pi.mesure_gps
--   Séparateur : ,   Guillemet : "   En-tête : oui
--
-- stop_mbgp_2025.csv   → test_pi.stop_mbgp
--   Séparateur : ,   Guillemet : "   En-tête : oui
--
-- move_mbgp_2025.csv   → test_pi.move_mbgp
--   Séparateur : ,   Guillemet : "   En-tête : oui
--
-- carnet_deplacement.csv → test_pi.carnet_deplacement
--   Séparateur : ;   Guillemet : "   En-tête : oui
--
-- carnet_activite.csv  → test_pi.carnet_activite
--   Séparateur : ;   Guillemet : "   En-tête : oui
--
-- carnet_poi.csv       → test_pi.carnet_poi
--   Séparateur : ;   Guillemet : "   En-tête : oui


-- ============================================================
-- ETAPE 3 : Convertir les géométries (exécuter après import)
-- ============================================================

-- mesure_gps : utiliser r_lat et r_lon (plus simple que le WKB)
ALTER TABLE test_pi.mesure_gps ADD COLUMN geom geometry(Point, 4326);
UPDATE test_pi.mesure_gps SET geom = ST_SetSRID(ST_MakePoint(r_lon, r_lat), 4326);
ALTER TABLE test_pi.mesure_gps DROP COLUMN geometry;

-- stop_mbgp : convertir WKB hex (Lambert 93) → WGS84
ALTER TABLE test_pi.stop_mbgp ADD COLUMN geom geometry(Point, 4326);
UPDATE test_pi.stop_mbgp SET geom = ST_Transform(ST_GeomFromEWKB(decode(geometry, 'hex')), 4326);
ALTER TABLE test_pi.stop_mbgp DROP COLUMN geometry;

-- move_mbgp : convertir WKB hex (Lambert 93) → WGS84
ALTER TABLE test_pi.move_mbgp ADD COLUMN geom geometry(LineString, 4326);
UPDATE test_pi.move_mbgp SET geom = ST_Transform(ST_GeomFromEWKB(decode(geometry, 'hex')), 4326);
ALTER TABLE test_pi.move_mbgp DROP COLUMN geometry;
