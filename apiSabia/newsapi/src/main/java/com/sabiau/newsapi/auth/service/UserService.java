package com.sabiau.newsapi.auth.service;

import com.sabiau.newsapi.auth.dto.UserDTO;
import com.sabiau.newsapi.auth.dto.RegisterRequestDTO;
import com.sabiau.newsapi.auth.model.UserModel;
import com.sabiau.newsapi.auth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }


    public UserDTO createUser(RegisterRequestDTO request) {
        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordHasher.hash(request.getPassword()));

        UserModel savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::toDTO);
    }


    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    public Optional<UserDTO> updateUser(Long id, UserDTO userDto) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            // ❌ no se toca password aquí
            UserModel updatedUser = userRepository.save(user);
            return toDTO(updatedUser);
        });
    }


    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }


    private UserDTO toDTO(UserModel user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
    }
}
