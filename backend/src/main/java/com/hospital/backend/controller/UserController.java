package com.hospital.backend.controller;

import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            return ResponseEntity.ok(userData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if(userDetails.getFullName() != null) user.setFullName(userDetails.getFullName());
            if(userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
            if(userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(encoder.encode(userDetails.getPassword()));
            }
            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
