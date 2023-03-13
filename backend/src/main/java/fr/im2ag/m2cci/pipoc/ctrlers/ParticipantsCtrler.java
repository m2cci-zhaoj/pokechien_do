package fr.im2ag.m2cci.pipoc.ctrlers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.im2ag.m2cci.pipoc.dto.Participant;

@RestController

@CrossOrigin
@RequestMapping("/participants")
public class ParticipantsCtrler {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @CrossOrigin
    @GetMapping("/find")
    public List<Participant> find(@RequestParam(value = "nom", defaultValue = "") String nom) {
        nom = nom + "%";
       String query = """
        SELECT count(geom) as nbre_stops, nom, prenom, p.participant_id FROM test.participants p 
        LEFT JOIN test.stops s ON p.participant_id = s.participant_id 
           WHERE p.nom like ? GROUP BY nom, prenom , p.participant_id
           ORDER BY nom""";
        return jdbcTemplate.query(query, // la requête (prepared statement)
                new Object[] { nom }, // un tableau d'objets contenant les valeurs à substituer
                new int[] { java.sql.Types.VARCHAR }, // tableau d'entiers indiquant les types SQL des valeurs à
                                                      // substituer
                (rs) -> {   // traitement du ResultSet
                    List<Participant> lesParticipants = new ArrayList<>();
                    while (rs.next()) {
                        lesParticipants.add(new Participant(rs.getInt("participant_id"), rs.getString("nom"), rs.getString("prenom"), rs.getInt("nbre_stops")));
                    }
                    return lesParticipants;
                });

    }

    @CrossOrigin
    @GetMapping("/{id}")
    public Participant participant(@PathVariable("id") int id) {
        String query = """
            SELECT count(geom) as nbre_stops, nom, prenom, p.participant_id FROM test.participants p 
            LEFT JOIN test.stops s ON p.participant_id = s.participant_id 
               WHERE p.nom like ? GROUP BY nom, prenom, p.participant_id
                   """;
        return jdbcTemplate.query(query, // la requête (prepared statement)
                new Object[] { id }, // un tableau d'objets contenant les valeurs à substituer
                new int[] { java.sql.Types.INTEGER }, // tableau d'entiers indiquant les types SQL des valeurs à
                                                      // substituer
                (rs) -> {
                    if (rs.next()) {
                        return new Participant(rs.getInt("participant_id"), rs.getString("nom"), rs.getString("prenom"), rs.getInt("nbre_stops"));
                    }
                    return null;
                });

    }

}
