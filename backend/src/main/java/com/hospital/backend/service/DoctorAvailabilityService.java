package com.hospital.backend.service;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.DoctorAvailability;
import com.hospital.backend.repository.DoctorAvailabilityRepository;
import com.hospital.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorAvailability> getAvailabilityByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }
    
    public List<DoctorAvailability> getAvailableSlotsByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctorIdAndIsBookedFalse(doctorId);
    }

    public DoctorAvailability addAvailability(Long doctorId, DoctorAvailability availability) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        availability.setDoctor(doctor);
        availability.setIsBooked(false);
        return availabilityRepository.save(availability);
    }

    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
}
