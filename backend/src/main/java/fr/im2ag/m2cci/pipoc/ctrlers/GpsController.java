package fr.im2ag.m2cci.pipoc.ctrlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.GpsPoint;

@RestController
@RequestMapping("/api/gps")
public class GpsController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    // -------------------------------------------------------
    // ETAPE 1 : recevoir un point GPS et l'insérer dans mesure_gps
    // POST /api/gps
    // Body: { "i_id_pers": 8, "dt_date_utc": "2025-03-09T10:30:00", "r_lat": 45.18, "r_lon": 5.73 }
    // -------------------------------------------------------
    @CrossOrigin
    @PostMapping
    public ResponseEntity<String> addGpsPoint(@RequestBody GpsPoint point) {
        // générer un nouvel i_pid (MAX + 1)
        Integer maxPid = jdbcTemplate.queryForObject(
            "SELECT COALESCE(MAX(i_pid), 0) FROM test_pi.mesure_gps",
            Integer.class
        );
        int newPid = (maxPid != null ? maxPid : 0) + 1;

        jdbcTemplate.update("""
                INSERT INTO test_pi.mesure_gps (i_pid, i_id_pers, i_id_session, dt_date_utc, r_lat, r_lon, geom)
                VALUES (?, ?, 1, ?::timestamp, ?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326))
                """,
            newPid,
            point.i_id_pers(),
            point.dt_date_utc(),
            point.r_lat(),
            point.r_lon(),
            point.r_lon(),
            point.r_lat()
        );

        return ResponseEntity.ok("GPS point ajouté : i_pid=" + newPid);
    }

    // -------------------------------------------------------
    // ETAPE 2 : calculer les stops et moves pour un participant
    // POST /api/gps/process/{i_id_pers}
    // Algorithme simplifié : stop = points consécutifs dans un rayon de 50m pendant 5 min
    // -------------------------------------------------------
    @CrossOrigin
    @PostMapping("/process/{i_id_pers}")
    public ResponseEntity<String> processStopsAndMoves(@PathVariable int i_id_pers) {

        // Supprimer les anciens stops/moves calculés pour ce participant
        jdbcTemplate.update("""
                DELETE FROM test_pi.stop_mbgp
                WHERE i_pid_start IN (
                    SELECT i_pid FROM test_pi.mesure_gps WHERE i_id_pers = ?
                )
                """, i_id_pers);

        jdbcTemplate.update("""
                DELETE FROM test_pi.move_mbgp
                WHERE i_pid_start IN (
                    SELECT i_pid FROM test_pi.mesure_gps WHERE i_id_pers = ?
                )
                """, i_id_pers);

        // Insérer les stops : points consécutifs dans un rayon de 50m pendant >= 5 minutes
        jdbcTemplate.update("""
                INSERT INTO test_pi.stop_mbgp (i_stop_id, i_pid_start, i_pid_end, geom)
                WITH pts AS (
                    SELECT i_pid, dt_date_utc, geom,
                           LAG(i_pid)       OVER (ORDER BY dt_date_utc) AS prev_pid,
                           LAG(geom)        OVER (ORDER BY dt_date_utc) AS prev_geom,
                           LAG(dt_date_utc) OVER (ORDER BY dt_date_utc) AS prev_date
                    FROM test_pi.mesure_gps
                    WHERE i_id_pers = ?
                ),
                transitions AS (
                    SELECT i_pid, dt_date_utc, geom,
                           CASE WHEN prev_geom IS NOT NULL
                                 AND ST_DWithin(geom::geography, prev_geom::geography, 100)
                                THEN 0 ELSE 1 END AS new_group
                    FROM pts
                ),
                groups AS (
                    SELECT i_pid, dt_date_utc, geom,
                           SUM(new_group) OVER (ORDER BY dt_date_utc) AS grp
                    FROM transitions
                ),
                stop_candidates AS (
                    SELECT
                        MIN(i_pid) AS pid_start,
                        MAX(i_pid) AS pid_end,
                        MIN(dt_date_utc) AS t_start,
                        MAX(dt_date_utc) AS t_end,
                        ST_Centroid(ST_Collect(geom)) AS center
                    FROM groups
                    GROUP BY grp
                    HAVING EXTRACT(EPOCH FROM (MAX(dt_date_utc) - MIN(dt_date_utc))) >= 300
                )
                SELECT
                    COALESCE((SELECT MAX(i_stop_id) FROM test_pi.stop_mbgp), 0)
                        + ROW_NUMBER() OVER () AS i_stop_id,
                    pid_start,
                    pid_end,
                    center
                FROM stop_candidates
                """, i_id_pers);

        // Insérer les moves : segments entre deux stops consécutifs
        jdbcTemplate.update("""
                INSERT INTO test_pi.move_mbgp (i_move_id, i_pid_start, i_pid_end, geom)
                WITH stops AS (
                    SELECT i_stop_id, i_pid_start, i_pid_end,
                           LEAD(i_pid_start) OVER (ORDER BY i_pid_start) AS next_pid_start
                    FROM test_pi.stop_mbgp
                    WHERE i_pid_start IN (
                        SELECT i_pid FROM test_pi.mesure_gps WHERE i_id_pers = ?
                    )
                ),
                move_candidates AS (
                    SELECT
                        s.i_pid_end   AS pid_start,
                        s.next_pid_start AS pid_end
                    FROM stops s
                    WHERE s.next_pid_start IS NOT NULL
                )
                SELECT
                    COALESCE((SELECT MAX(i_move_id) FROM test_pi.move_mbgp), 0)
                        + ROW_NUMBER() OVER () AS i_move_id,
                    mc.pid_start,
                    mc.pid_end,
                    ST_MakeLine(g.geom ORDER BY g.dt_date_utc) AS geom
                FROM move_candidates mc
                JOIN test_pi.mesure_gps g ON g.i_pid BETWEEN mc.pid_start AND mc.pid_end
                    AND g.i_id_pers = ?
                GROUP BY mc.pid_start, mc.pid_end
                """, i_id_pers, i_id_pers);

        return ResponseEntity.ok("Stops et moves calculés pour i_id_pers=" + i_id_pers);
    }
}
