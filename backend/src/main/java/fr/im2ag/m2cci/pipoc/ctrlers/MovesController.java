package fr.im2ag.m2cci.pipoc.ctrlers;

import static java.sql.Types.INTEGER;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovesController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @CrossOrigin
    @GetMapping("/moves/{participant_id}")
    public String moves(@PathVariable("participant_id") int participantId) {
        String query = """
                SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', COALESCE(json_agg(ST_AsGeoJSON(m.*)::json), '[]'::json)
                )
                FROM test_pi.move_mbgp m
                JOIN test_pi.mesure_gps g ON m.i_pid_start = g.i_pid
                WHERE g.i_id_pers = ?
                """;
        return jdbcTemplate.query(query,
                new Object[] { participantId },
                new int[] { INTEGER },
                (rs) -> {
                    if (rs.next()) return rs.getString(1);
                    return "{}";
                });
    }
}
