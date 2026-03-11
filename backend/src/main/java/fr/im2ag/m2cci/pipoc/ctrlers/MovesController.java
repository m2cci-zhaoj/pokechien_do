
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
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.CarnetDeplacementRequest;

@RestController
public class MovesController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    // LEFT JOIN carnet_deplacement 以便在 GeoJSON 属性中包含交通方式
    @CrossOrigin
    @GetMapping("/moves/{participant_id}")
    public String moves(@PathVariable("participant_id") int participantId) {
        String query = """
                SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', COALESCE(json_agg(ST_AsGeoJSON(t.*)::json), '[]'::json)
                )
                FROM (
                    SELECT
                        m.i_move_id,
                        m.i_id_carnet_d,
                        cd.s_code_dep,
                        g_start.dt_date_utc AS date_debut,
                        g_end.dt_date_utc   AS date_fin,
                        m.geom
                    FROM test_pi.move_mbgp m
                    JOIN test_pi.mesure_gps g_start ON m.i_pid_start = g_start.i_pid
                    JOIN test_pi.mesure_gps g_end   ON m.i_pid_end   = g_end.i_pid
                    LEFT JOIN test_pi.carnet_deplacement cd ON m.i_id_carnet_d = cd.i_id_carnet_d
                    WHERE g_start.i_id_pers = ?
                ) t
                """;
        return jdbcTemplate.query(query,
                new Object[] { participantId },
                new int[] { INTEGER },
                (rs) -> {
                    if (rs.next()) return rs.getString(1);
                    return "{}";
                });
    }

    // 创建 carnet_deplacement 记录并关联到 move_mbgp（当 move 还没有出行记录时）
    @CrossOrigin
    @PostMapping(path = "/carnet-deplacement")
    public String createCarnetDeplacement(@RequestBody CarnetDeplacementRequest req) {
        // 获取下一个可用的 i_id_carnet_d
        Integer nextId = jdbcTemplate.queryForObject(
                "SELECT COALESCE(MAX(i_id_carnet_d), 0) + 1 FROM test_pi.carnet_deplacement",
                Integer.class);

        // 从 move_mbgp 获取时间信息（通过 mesure_gps）
        String insertQuery = """
                INSERT INTO test_pi.carnet_deplacement
                    (i_id_carnet_d, i_id_pers_session, dt_start_dep_utc, dt_end_dep_utc, s_code_dep)
                SELECT ?, g_start.i_id_pers,
                       g_start.dt_date_utc, g_end.dt_date_utc,
                       ?
                FROM test_pi.move_mbgp m
                JOIN test_pi.mesure_gps g_start ON m.i_pid_start = g_start.i_pid
                JOIN test_pi.mesure_gps g_end   ON m.i_pid_end   = g_end.i_pid
                WHERE m.i_move_id = ?
                """;
        jdbcTemplate.update(insertQuery,
                new Object[] { nextId, req.sCodeDep(), req.moveId() },
                new int[] { INTEGER, VARCHAR, INTEGER });

        // 更新 move_mbgp，关联刚插入的 carnet_deplacement
        jdbcTemplate.update(
                "UPDATE test_pi.move_mbgp SET i_id_carnet_d = ? WHERE i_move_id = ?",
                new Object[] { nextId, req.moveId() },
                new int[] { INTEGER, INTEGER });
        return "OK";
    }

    // 更新已有的 carnet_deplacement 记录（当 move 已关联出行时）
    @CrossOrigin
    @PutMapping(path = "/carnet-deplacement")
    public String updateCarnetDeplacement(@RequestBody CarnetDeplacementRequest req) {
        // 根据 move_mbgp 找到对应的 i_id_carnet_d
        Integer carnetId = jdbcTemplate.queryForObject(
                "SELECT i_id_carnet_d FROM test_pi.move_mbgp WHERE i_move_id = ?",
                new Object[] { req.moveId() },
                new int[] { INTEGER },
                Integer.class);
        if (carnetId == null) return "NOT_FOUND";

        jdbcTemplate.update(
                "UPDATE test_pi.carnet_deplacement SET s_code_dep = ? WHERE i_id_carnet_d = ?",
                new Object[] { req.sCodeDep(), carnetId },
                new int[] { VARCHAR, INTEGER });
        return "OK";
    }
}
