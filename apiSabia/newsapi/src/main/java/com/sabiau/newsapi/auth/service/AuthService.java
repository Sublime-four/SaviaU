package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.dto.UserDTO;
import com.sabiau.newsapi.auth.model.UserModel;
import com.sabiau.newsapi.auth.repository.UserRepository;
import com.sabiau.newsapi.common.exceptions.BadRequestException;
import com.sabiau.newsapi.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;

    public UserDTO register(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("El correo ya está registrado");
        } else if (userRepository.existsByUsername(username)){
            throw new BadRequestException("El username ya existe");
        }

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


    public LoginResponse login(String email, String password) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));

        if (!passwordHasher.verify(password, user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        try {
            String token = jwtService.generateToken(user);
            return new LoginResponse(token, user.getUsername(), user.getEmail());
        } catch (Exception e) {
            throw new BadRequestException("Error generating token");
        }
    }

    public record LoginResponse(String token, String username, String email) {}
}
