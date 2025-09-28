package com.sabiau.newsapi.auth.dto;

import lombok.Data;

@Data
public class PasswordResetConfirmDTO {
    private String token;
    private String newPassword;
}