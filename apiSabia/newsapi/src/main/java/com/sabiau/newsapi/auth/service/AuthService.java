package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.dto.UserDTO;
import com.sabiau.newsapi.auth.dto.PasswordResetRequestDTO;
import com.sabiau.newsapi.auth.dto.PasswordResetConfirmDTO;
import com.sabiau.newsapi.auth.model.PasswordResetToken;
import com.sabiau.newsapi.auth.model.UserModel;
import com.sabiau.newsapi.auth.repository.PasswordResetTokenRepository;
import com.sabiau.newsapi.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository tokenRepository;

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
    public String requestPasswordReset(PasswordResetRequestDTO request) {
        Optional<UserModel> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + request.getEmail());
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .email(request.getEmail())
                .expiryDate(LocalDateTime.now().plusMinutes(15)) // token válido 15 min
                .build();

        tokenRepository.save(resetToken);


        return token;
    }

    public void confirmPasswordReset(PasswordResetConfirmDTO request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        UserModel user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordHasher.hash(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
    public record LoginResponse(String token, String username, String email) {}
}
