package com.sabiau.newsapi.auth.controller;

import com.sabiau.newsapi.auth.dto.*;
import com.sabiau.newsapi.auth.service.AuthService;
import com.sabiau.newsapi.auth.service.UserSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {

    private final AuthService authService;
    private final UserSessionManager sessionManager;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO request) {
        UserDTO user = authService.register(
                request.getUsername(), request.getEmail(), request.getPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        return authService.login(request.getEmail(), request.getPassword())
                .map(loginResponse -> ResponseEntity.ok(Map.of(
                        "token", loginResponse.token(),
                        "username", loginResponse.username(),
                        "email", loginResponse.email(),
                        "message", "Login successful"
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "error", "Invalid credentials"
                )));
    }

    @PostMapping("/logout/{sessionId}")
    public ResponseEntity<?> logout(@PathVariable String sessionId) {
        sessionManager.invalidate(sessionId);
        return ResponseEntity.ok(Map.of(
                "message", "Session invalidated",
                "sessionId", sessionId
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody PasswordResetRequestDTO request) {
        authService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetConfirmDTO request) {
        boolean success = authService.resetPassword(request.getToken(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Invalid or expired token"
            ));
        }
    }
}
