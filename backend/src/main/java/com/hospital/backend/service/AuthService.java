package com.hospital.backend.service;

import com.hospital.backend.entity.Department;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Role;
import com.hospital.backend.entity.User;
import com.hospital.backend.payload.request.LoginRequest;
import com.hospital.backend.payload.request.SignupRequest;
import com.hospital.backend.payload.response.JwtResponse;
import com.hospital.backend.payload.response.MessageResponse;
import com.hospital.backend.repository.DepartmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.security.jwt.JwtUtils;
import com.hospital.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                role));
    }

    @Transactional
    public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {


        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Role userRole = Role.ROLE_PATIENT;
        if (signUpRequest.getRole() != null) {
            switch (signUpRequest.getRole().toLowerCase()) {
                case "admin":
                    userRole = Role.ROLE_ADMIN;
                    break;
                case "doctor":
                    userRole = Role.ROLE_DOCTOR;
                    break;
                case "patient":
                default:
                    userRole = Role.ROLE_PATIENT;
                    break;
            }
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(userRole)
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .build();

        user = userRepository.save(user);

        // If Doctor, create doctor entity
        if (userRole == Role.ROLE_DOCTOR) {
            Department dept = null;
            if (signUpRequest.getDepartmentId() != null) {
                dept = departmentRepository.findById(signUpRequest.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Error: Department not found."));
            }

            Doctor doctor = Doctor.builder()
                    .user(user)
                    .department(dept)
                    .specialization(signUpRequest.getSpecialization())
                    .experienceYears(signUpRequest.getExperienceYears())
                    .consultationFee(signUpRequest.getConsultationFee())
                    .build();
            doctorRepository.save(doctor);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
