
DROP SCHEMA IF EXISTS test_pi CASCADE;

CREATE SCHEMA test_pi;

CREATE TABLE test_pi.participants(
	participant_id INTEGER PRIMARY KEY,
	prenom VARCHAR(255),
	nom VARCHAR(255)
);

CREATE TABLE test_pi.stops (
    stop_id SERIAL PRIMARY KEY, -- serial c'est un auto increment
    participant_id INTEGER , 
    date_debut TIMESTAMP ,
    date_fin TIMESTAMP,
    commentaire VARCHAR(255),
    geom geometry(Point, 4326), -- 4326 c'est le code EPSG pour des coordonnées WGS84 (longitude, latitude),
    CONSTRAINT fk_stop_participant FOREIGN KEY(participant_id) REFERENCES test_pi.participants(participant_id)
);

