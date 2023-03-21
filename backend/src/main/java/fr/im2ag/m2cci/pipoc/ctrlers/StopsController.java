package fr.im2ag.m2cci.pipoc.ctrlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static java.sql.Types.*;

import fr.im2ag.m2cci.pipoc.dto.Stop;

@RestController
public class StopsController {

	@Autowired
	JdbcTemplate jdbcTemplate;

	@CrossOrigin
	@GetMapping("/stops")
	public String points() {
		String query = """
				SELECT
				  json_build_object(
				    'type', 'FeatureCollection',
				    'features', json_agg(ST_AsGeoJSON(t.*)::json)
				  )
				FROM
				test.stops AS t""";
		return jdbcTemplate.queryForObject(query, String.class);
	}

	@CrossOrigin
	@GetMapping("/stops/{participant_id}")
	public String stops(@PathVariable("participant_id") int participant_id) {
		String query = """
				SELECT
					json_build_object(
					  'type', 'FeatureCollection',
					  'features', json_agg(ST_AsGeoJSON(t.*)::json)
					)
				  FROM
					test.stops AS t
				  WHERE
					t.participant_id = ?
				""";

		return jdbcTemplate.query(query, // la requête (prepared statement)
				new Object[] { participant_id }, // un tableau d'objets contenant les valeurs à substituer
				new int[] { java.sql.Types.INTEGER }, // tableau d'entiers indiquant les types SQL des valeurs à
														// substituer
				(rs) -> {
					if (rs.next()) {
						return rs.getString(1); // le résultat de la requête est une chaîne GeoJSON
					}
					// pas de stops , mais on devrait jamais arriver ici car si il n'existe pas de
					// stops pour le participant, la requête renvoie tout de même une réponse
					// GeoJSOn avec l'attibut features égal à null:
					// {"type" : "FeatureCollection", "features" : null}
					return ("");
				});
	}

	@CrossOrigin
	@PostMapping(path = "/stop")
	// @PostMapping(path = "/stop", consumes = "application/json", produces = "application/json")
	public String addStop(@RequestBody Stop stop) {
		String query = """
				INSERT into test.stops(participant_id, geom)
				     values (?, ST_GeomFromText(?, 4326));
					""";
		jdbcTemplate.update(query,
				new Object[] { stop.participantId(), stop.toWKT() },
				new int[] { INTEGER, VARCHAR }
		);
		return "OK";
	}

}
