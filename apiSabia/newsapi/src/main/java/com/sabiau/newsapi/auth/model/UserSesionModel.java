package com.sabiau.newsapi.auth.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSesionModel {
    @Id
    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    private Instant createdAt;
    private Instant lastAccess;
    private boolean active;
}
