package fr.im2ag.m2cci.pipoc.dto;

// DTO 用于创建或更新 carnet_deplacement 记录，并关联到 move_mbgp
public record CarnetDeplacementRequest(
    int moveId,        // move_mbgp.i_move_id
    String sCodeDep    // 交通方式代码（如 "marche", "velo", "bus", "voiture" 等）
) {}
