package fr.im2ag.m2cci.pipoc.dto;

public record GpsPoint(
    int i_id_pers,
    String dt_date_utc,
    double r_lat,
    double r_lon
) {}
