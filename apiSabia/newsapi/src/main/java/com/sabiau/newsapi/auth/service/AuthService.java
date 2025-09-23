package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.dto.UserDTO;
import com.sabiau.newsapi.auth.model.UserModel;
import com.sabiau.newsapi.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;

   public UserDTO register(String username, String email, String password) {
            UserModel user = UserModel.builder()
                    .username(username)
                    .email(email)
                    .password(passwordHasher.hash(password))
                    .build();

            UserModel savedUser = userRepository.save(user);

            return new UserDTO(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getEmail()
            );
   }


    public Optional<LoginResponse> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordHasher.verify(password, user.getPassword()))
                .map(user -> {
                    String token = jwtService.generateToken(user); // ya recibe el UserModel
                    return new LoginResponse(token, user.getUsername(), user.getEmail());
                });
    }

    // Respuesta de login con más info que solo el token
    public record LoginResponse(String token, String username, String email) {}
}
