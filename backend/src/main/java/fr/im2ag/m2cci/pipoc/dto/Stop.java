package fr.im2ag.m2cci.pipoc.dto;

public record Stop(int stopId, int participantId, double longitude, double latitude, String commentaire) {

    public String toWKT() {
        return "POINT(" + longitude + "  " + latitude + ")";
    }
    
}
