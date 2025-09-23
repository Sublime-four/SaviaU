package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.dto.AuthResponseDTO;
import com.sabiau.newsapi.auth.model.UserModel;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationSeconds;

    // Constructor explícito: Spring inyecta jwt.secret (y opcionalmente jwt.expiration)
    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:3600}") long expirationSeconds // por defecto 3600s
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    // Genera token + refresh + rellena AuthResponseDTO (sin exponer password)
    public String generateToken(UserModel user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationSeconds * 1000L);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validate(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Optional<Long> getUserId(String token) {
        try {
            String subject = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return Optional.of(Long.parseLong(subject));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<String> getUsernameFromToken(String token) {
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("username", String.class);
            return Optional.ofNullable(username);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
