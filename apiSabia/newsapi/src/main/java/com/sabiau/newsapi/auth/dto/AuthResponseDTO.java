package com.sabiau.newsapi.auth.dto;
import lombok.Builder;
import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String refreshToken;
    private Long userId;
    private String username;
    private String email;
}
