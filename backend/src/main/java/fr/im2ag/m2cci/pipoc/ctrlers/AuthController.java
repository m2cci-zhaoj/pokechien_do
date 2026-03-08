package fr.im2ag.m2cci.pipoc.ctrlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.LoginRequest;
import fr.im2ag.m2cci.pipoc.dto.LoginResponse;
import fr.im2ag.m2cci.pipoc.dto.RegisterRequest;
import fr.im2ag.m2cci.pipoc.dto.ResetPasswordRequest;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        String query = """
                SELECT participant_id, nom, prenom FROM test_pi.participants
                WHERE login = ? AND password = ?
                """;
        LoginResponse loginResponse = jdbcTemplate.query(
                query,
                new Object[] { loginRequest.login(), loginRequest.password() },
                new int[] { java.sql.Types.VARCHAR, java.sql.Types.VARCHAR },
                (rs) -> {
                    if (rs.next()) {
                        return new LoginResponse(
                                "welcome",
                                rs.getInt("participant_id"),
                                rs.getString("nom"),
                                rs.getString("prenom"));
                    }
                    return null;
                });

        if (loginResponse != null) {
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @CrossOrigin
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        // vérifier si le login existe déjà
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM test_pi.participants WHERE login = ?",
                new Object[] { req.login() },
                new int[] { java.sql.Types.VARCHAR },
                Integer.class);
        if (count != null && count > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Login déjà utilisé");
        }
        // insérer le nouveau participant (participant_id = MAX + 1)
        String query = """
                INSERT INTO test_pi.participants(participant_id, prenom, nom, login, password)
                VALUES ((SELECT COALESCE(MAX(participant_id), 0) + 1 FROM test_pi.participants), ?, ?, ?, ?)
                """;
        jdbcTemplate.update(query,
                new Object[] { req.prenom(), req.nom(), req.login(), req.password() },
                new int[] { java.sql.Types.VARCHAR, java.sql.Types.VARCHAR,
                        java.sql.Types.VARCHAR, java.sql.Types.VARCHAR });
        return ResponseEntity.status(HttpStatus.CREATED).body("Compte créé");
    }

    @CrossOrigin
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest req) {
        // vérifier l'identité : login + nom + prenom
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM test_pi.participants WHERE login = ? AND LOWER(nom) = LOWER(?) AND LOWER(prenom) = LOWER(?)",
                new Object[] { req.login(), req.nom(), req.prenom() },
                new int[] { java.sql.Types.VARCHAR, java.sql.Types.VARCHAR, java.sql.Types.VARCHAR },
                Integer.class);
        if (count == null || count == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identité non vérifiée");
        }
        jdbcTemplate.update(
                "UPDATE test_pi.participants SET password = ? WHERE login = ?",
                new Object[] { req.newPassword(), req.login() },
                new int[] { java.sql.Types.VARCHAR, java.sql.Types.VARCHAR });
        return ResponseEntity.ok("Mot de passe modifié");
    }
}
