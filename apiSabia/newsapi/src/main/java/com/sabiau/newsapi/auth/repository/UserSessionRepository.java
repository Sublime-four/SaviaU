package com.sabiau.newsapi.auth.repository;

import com.sabiau.newsapi.auth.model.UserSesionModel;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserSessionRepository extends JpaRepository<UserSesionModel, String> {
}

