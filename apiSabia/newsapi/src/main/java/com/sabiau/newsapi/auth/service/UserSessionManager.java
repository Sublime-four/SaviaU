package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.model.UserModel;
import com.sabiau.newsapi.auth.model.UserSesionModel;
import com.sabiau.newsapi.auth.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserSessionManager {
    private final UserSessionRepository sessionRepository;

    public UserSesionModel createSession(UserModel user) {
        UserSesionModel session = UserSesionModel.builder()
                .sessionId(UUID.randomUUID().toString())
                .user(user)
                .createdAt(Instant.now())
                .lastAccess(Instant.now())
                .active(true)
                .build();
        return sessionRepository.save(session);
    }

    public Optional<UserSesionModel> getSession(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public void invalidate(String sessionId) {
        sessionRepository.findById(sessionId).ifPresent(s -> {
            s.setActive(false);
            sessionRepository.save(s);
        });
    }
}
