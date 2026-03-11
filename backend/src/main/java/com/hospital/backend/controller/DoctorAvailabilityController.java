package com.hospital.backend.controller;

import com.hospital.backend.entity.DoctorAvailability;
import com.hospital.backend.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DoctorAvailabilityController {
    
    @Autowired
    private DoctorAvailabilityService availabilityService;

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorAvailability> getByDoctor(@PathVariable Long doctorId) {
        return availabilityService.getAvailabilityByDoctor(doctorId);
    }

    @GetMapping("/doctor/{doctorId}/available")
    public List<DoctorAvailability> getAvailableSlots(@PathVariable Long doctorId) {
        return availabilityService.getAvailableSlotsByDoctor(doctorId);
    }

    @PostMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorAvailability> addAvailability(@PathVariable Long doctorId, @RequestBody DoctorAvailability availability) {
        return ResponseEntity.ok(availabilityService.addAvailability(doctorId, availability));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}
