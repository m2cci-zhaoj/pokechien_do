package fr.im2ag.m2cci.pipoc.dto;

// DTO 用于创建或更新 carnet_activite 记录，并关联到 stop_mbgp
public record CarnetActiviteRequest(
    int participantId,   // 用户 participant_id（对应 mesure_gps.i_id_pers）
    int stopId,          // stop_mbgp.i_stop_id
    String sCodeAct,     // 活动类型代码（如 "domicile", "travail" 等）
    String sNonPoi       // 地点名称（自由文本）
) {}
