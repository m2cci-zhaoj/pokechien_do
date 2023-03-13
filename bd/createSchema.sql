DROP TABLE IF EXISTS test.participants;

CREATE TABLE test.participants(
	participant_id INTEGER PRIMARY KEY,
	prenom VARCHAR(255),
	nom VARCHAR(255)
);


DROP TABLE IF EXISTS test.stops;

CREATE TABLE test.stops (
    stop_id SERIAL PRIMARY KEY, -- serial c'est un auto increment
    participant_id INTEGER , 
    date_debut TIMESTAMP ,
    date_fin TIMESTAMP,
    geom geometry(Point, 4326), -- 4326 c'est le code EPSG pour des coordonnées WGS84 (longitude, latitude),
    CONSTRAINT fk_stop_participant FOREIGN KEY(participant_id) REFERENCES test.participants(participant_id)
);

