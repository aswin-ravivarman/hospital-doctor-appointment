package com.hospital.backend.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String role; // "patient", "doctor", "admin"
    
    // For Doctors
    private Long departmentId;
    private String specialization;
    private Integer experienceYears;
    private Double consultationFee;
    
    // Generics
    private String fullName;
    private String phone;
}
