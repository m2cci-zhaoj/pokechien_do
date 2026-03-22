
//轨迹组件，未区分stop中的arret lieu 和arret d'activite
package fr.im2ag.m2cci.pipoc.ctrlers;

import static java.sql.Types.INTEGER;
import static java.sql.Types.VARCHAR;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.CarnetActiviteRequest;
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
				pokechien_do.stops AS t""";
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
						pokechien_do.stops AS t
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
						pokechien_do.stops AS t
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
	public String stopsMbgp(
			@PathVariable("participant_id") int participantId,
			@RequestParam(value = "dateDebut", required = false) String dateDebut,
			@RequestParam(value = "dateFin", required = false) String dateFin) {

		String baseSelect = """
				    SELECT
				        s.i_stop_id,
				        s.commentaire,
				        s.i_id_carnet_a,
				        ca.s_code_act,
				        ca.s_non_poi,
				        g_start.dt_date_utc AS date_debut,
				        g_end.dt_date_utc   AS date_fin,
				        s.geom
				    FROM pokechien_do.stop_mbgp s
				    JOIN pokechien_do.mesure_gps g_start ON s.i_pid_start = g_start.i_pid
				    JOIN pokechien_do.mesure_gps g_end   ON s.i_pid_end   = g_end.i_pid
				    LEFT JOIN pokechien_do.carnet_activite ca ON s.i_id_carnet_a = ca.i_id_carnet_a
				    WHERE g_start.i_id_pers = ?
				""";

		String query;
		Object[] params;
		int[] types;

		if (dateDebut != null && dateFin != null) {
			query = "SELECT json_build_object('type','FeatureCollection','features',COALESCE(json_agg(ST_AsGeoJSON(t.*)::json),'[]'::json)) FROM (" + baseSelect + "AND g_start.dt_date_utc >= ?::timestamp AND g_start.dt_date_utc <= ?::timestamp) t";
			params = new Object[] { participantId, dateDebut, dateFin };
			types = new int[] { INTEGER, VARCHAR, VARCHAR };
		} else {
			query = "SELECT json_build_object('type','FeatureCollection','features',COALESCE(json_agg(ST_AsGeoJSON(t.*)::json),'[]'::json)) FROM (" + baseSelect + ") t";
			params = new Object[] { participantId };
			types = new int[] { INTEGER };
		}

		return jdbcTemplate.query(query, params, types, (rs) -> {
			if (rs.next()) return rs.getString(1);
			return "{}";
		});
	}

	// 创建 carnet_activite 记录并关联到 stop_mbgp（当 stop 还没有活动记录时）
	@CrossOrigin
	@Transactional
	@PostMapping(path = "/carnet-activite")
	public ResponseEntity<String> createCarnetActivite(@RequestBody CarnetActiviteRequest req) {
		// 获取下一个可用的 i_id_carnet_a
		Integer nextId = jdbcTemplate.queryForObject(
				"SELECT COALESCE(MAX(i_id_carnet_a), 0) + 1 FROM pokechien_do.carnet_activite",
				Integer.class);

		// 从 stop_mbgp 获取时间信息（通过 mesure_gps）
		String insertQuery = """
				INSERT INTO pokechien_do.carnet_activite
				    (i_id_carnet_a, i_id_pers_session, dt_start_act_utc, dt_end_act_utc, s_code_act, s_non_poi)
				SELECT ?, g_start.i_id_pers,
				       g_start.dt_date_utc, g_end.dt_date_utc,
				       ?, ?
				FROM pokechien_do.stop_mbgp s
				JOIN pokechien_do.mesure_gps g_start ON s.i_pid_start = g_start.i_pid
				JOIN pokechien_do.mesure_gps g_end   ON s.i_pid_end   = g_end.i_pid
				WHERE s.i_stop_id = ?
				""";
		int inserted = jdbcTemplate.update(insertQuery,
				new Object[] { nextId, req.sCodeAct(), req.sNonPoi(), req.stopId() },
				new int[] { INTEGER, VARCHAR, VARCHAR, INTEGER });

		if (inserted == 0) {
			return ResponseEntity.status(500).body("Stop introuvable ou données GPS manquantes");
		}

		// 更新 stop_mbgp，关联刚插入的 carnet_activite
		jdbcTemplate.update(
				"UPDATE pokechien_do.stop_mbgp SET i_id_carnet_a = ? WHERE i_stop_id = ?",
				new Object[] { nextId, req.stopId() },
				new int[] { INTEGER, INTEGER });
		return ResponseEntity.ok("OK");
	}

	// 更新已有的 carnet_activite 记录（当 stop 已关联活动时）
	@CrossOrigin
	@PutMapping(path = "/carnet-activite")
	public String updateCarnetActivite(@RequestBody CarnetActiviteRequest req) {
		// 根据 stop_mbgp 找到对应的 i_id_carnet_a
		Integer carnetId = jdbcTemplate.queryForObject(
				"SELECT i_id_carnet_a FROM pokechien_do.stop_mbgp WHERE i_stop_id = ?",
				new Object[] { req.stopId() },
				new int[] { INTEGER },
				Integer.class);
		if (carnetId == null) return "NOT_FOUND";

		jdbcTemplate.update(
				"UPDATE pokechien_do.carnet_activite SET s_code_act = ?, s_non_poi = ? WHERE i_id_carnet_a = ?",
				new Object[] { req.sCodeAct(), req.sNonPoi(), carnetId },
				new int[] { VARCHAR, VARCHAR, INTEGER });
		return "OK";
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
				INSERT into pokechien_do.stops(participant_id, geom, commentaire, date_debut, date_fin, is_public, photo)
				     values (?, ST_GeomFromText(?, 4326), ?, ?::timestamp, ?::timestamp, ?, ?);
					""";
		jdbcTemplate.update(query,
				new Object[] { stop.participantId(), stop.toWKT(), stop.commentaire(), stop.dateDebut(), stop.dateFin(), stop.isPublic(), stop.photo() },
				new int[] { INTEGER, VARCHAR, VARCHAR, VARCHAR, VARCHAR, java.sql.Types.BOOLEAN, VARCHAR });
		return "OK";
	}

	@CrossOrigin
	@DeleteMapping(path = "/stop/{stopId}")
	public String deleteStop(@PathVariable("stopId") int stopId) {
		jdbcTemplate.update("DELETE FROM pokechien_do.stops WHERE stop_id = ?",
				new Object[] { stopId }, new int[] { INTEGER });
		return "OK";
	}

	@CrossOrigin
	@PutMapping(path = "/stop")
	public String updateStop(@RequestBody Stop stop) {
		String query = """
				UPDATE pokechien_do.stops SET commentaire = ? WHERE stop_id = ?
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
				UPDATE pokechien_do.stop_mbgp SET commentaire = ? WHERE i_stop_id = ?
						""";
		jdbcTemplate.update(query,
				new Object[] { stopUpdate.commentaire(), stopUpdate.stopId() },
				new int[] { VARCHAR, INTEGER });
		return "OK";
	}

}
