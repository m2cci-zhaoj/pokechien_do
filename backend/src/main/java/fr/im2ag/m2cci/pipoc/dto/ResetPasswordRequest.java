package fr.im2ag.m2cci.pipoc.dto;

public record ResetPasswordRequest(String login, String nom, String prenom, String newPassword) {
}
