package com.hospital.backend.controller;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.service.DoctorService;
import com.hospital.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hospital.backend.payload.request.SignupRequest;
import com.hospital.backend.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AuthService authService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getDashboardStats() {
        return reportService.getAdminDashboardStats();
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorService.saveDoctor(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @PostMapping("/register-doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerDoctor(@RequestBody SignupRequest doctorRequest) {
        return authService.registerDoctor(doctorRequest);
    }
}
