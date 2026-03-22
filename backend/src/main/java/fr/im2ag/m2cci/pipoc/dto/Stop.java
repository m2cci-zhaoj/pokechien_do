package fr.im2ag.m2cci.pipoc.dto;

public record Stop(int stopId, int participantId, double longitude, double latitude, String commentaire, String dateDebut, String dateFin, boolean isPublic, String photo) {

    public String toWKT() {
        return "POINT(" + longitude + "  " + latitude + ")";
    }
    
}
