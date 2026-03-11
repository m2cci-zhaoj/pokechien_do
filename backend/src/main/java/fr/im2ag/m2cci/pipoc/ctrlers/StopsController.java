
//轨迹组件，未区分stop中的arret lieu 和arret d'activite
package fr.im2ag.m2cci.pipoc.ctrlers;

import static java.sql.Types.INTEGER;
import static java.sql.Types.VARCHAR;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.Stop;
import fr.im2ag.m2cci.pipoc.dto.StopMbgpUpdate;

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
				test_pi.stops AS t""";
		return jdbcTemplate.queryForObject(query, String.class);
	}

	@CrossOrigin
	@GetMapping("/stops/{participant_id}")
	public String stops(
			@PathVariable("participant_id") int participant_id,
			@RequestParam(value = "dateDebut", required = false) String dateDebut,
			@RequestParam(value = "dateFin", required = false) String dateFin) {

		String query;
		Object[] params;
		int[] types;

		if (dateDebut != null && dateFin != null) {
			// filtre par période
			query = """
					SELECT
						json_build_object(
						  'type', 'FeatureCollection',
						  'features', json_agg(ST_AsGeoJSON(t.*)::json)
						)
					  FROM
						test_pi.stops AS t
					  WHERE
						t.participant_id = ?
						AND t.date_debut >= ?::timestamp
						AND t.date_debut <= ?::timestamp
					""";
			params = new Object[] { participant_id, dateDebut, dateFin };
			types = new int[] { java.sql.Types.INTEGER, java.sql.Types.VARCHAR, java.sql.Types.VARCHAR };
		} else {
			// sans filtre
			query = """
					SELECT
						json_build_object(
						  'type', 'FeatureCollection',
						  'features', json_agg(ST_AsGeoJSON(t.*)::json)
						)
					  FROM
						test_pi.stops AS t
					  WHERE
						t.participant_id = ?
					""";
			params = new Object[] { participant_id };
			types = new int[] { java.sql.Types.INTEGER };
		}

		return jdbcTemplate.query(query, params, types, (rs) -> {
			if (rs.next()) {
				return rs.getString(1);
			}
			return ("");
		});
	}

	@CrossOrigin
	@GetMapping("/stops-mbgp/{participant_id}")
	public String stopsMbgp(@PathVariable("participant_id") int participantId) {
		String query = """
				SELECT json_build_object(
				    'type', 'FeatureCollection',
				    'features', COALESCE(json_agg(ST_AsGeoJSON(t.*)::json), '[]'::json)
				)
				FROM (
				    SELECT
				        s.i_stop_id,
				        s.commentaire,
				        g_start.dt_date_utc AS date_debut,
				        g_end.dt_date_utc   AS date_fin,
				        s.geom
				    FROM test_pi.stop_mbgp s
				    JOIN test_pi.mesure_gps g_start ON s.i_pid_start = g_start.i_pid
				    JOIN test_pi.mesure_gps g_end   ON s.i_pid_end   = g_end.i_pid
				    WHERE g_start.i_id_pers = ?
				) t
				""";
		return jdbcTemplate.query(query,
				new Object[] { participantId },
				new int[] { java.sql.Types.INTEGER },
				(rs) -> {
					if (rs.next()) return rs.getString(1);
					return "{}";
				});
	}

	// Dans les API REST une bonne pratique est d'utiliser
	// - PUT pour mettre à jour/remplacer une ressource existante
	// - POST  pour créer une nouvelle ressource
	// les deux méthodes suivantes illustre cela :
	// - addStop ajoute un nouveau stop
	// - upDateStop met à jour un stop (son commentaire)

	@CrossOrigin
	@PostMapping(path = "/stop")
	// @PostMapping(path = "/stop", consumes = "application/json", produces =
	// "application/json")
	public String addStop(@RequestBody Stop stop) {
		String query = """
				INSERT into test_pi.stops(participant_id, geom)
				     values (?, ST_GeomFromText(?, 4326));
					""";
		jdbcTemplate.update(query,
				new Object[] { stop.participantId(), stop.toWKT() },
				new int[] { INTEGER, VARCHAR });
		return "OK";
	}

	@CrossOrigin
	@PutMapping(path = "/stop")
	// @PutMapping(path = "/stop", consumes = "application/json", produces =
	// "application/json")
	public String updateStop(@RequestBody Stop stop) {
		String query = """
				UPDATE test_pi.stops SET commentaire = ? WHERE stop_id = ?
						""";
		jdbcTemplate.update(query,
				new Object[] { stop.commentaire(), stop.stopId() },
				new int[] { VARCHAR, INTEGER });
		return "OK";
	}

	// 更新 GPS 计算得到的 stop_mbgp 表中的备注
	@CrossOrigin
	@PutMapping(path = "/stop-mbgp")
	public String updateStopMbgp(@RequestBody StopMbgpUpdate stopUpdate) {
		String query = """
				UPDATE test_pi.stop_mbgp SET commentaire = ? WHERE i_stop_id = ?
						""";
		jdbcTemplate.update(query,
				new Object[] { stopUpdate.commentaire(), stopUpdate.stopId() },
				new int[] { VARCHAR, INTEGER });
		return "OK";
	}

}
