package fr.im2ag.m2cci.pipoc.dto;

public record Stop(int participantId, double longitude, double latitude) {

    public String toWKT() {
        return "POINT(" + longitude + "  " + latitude + ")";
    }
    
}
