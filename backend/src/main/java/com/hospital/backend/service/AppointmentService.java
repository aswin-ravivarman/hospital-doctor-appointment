package com.hospital.backend.service;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.DoctorAvailability;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorAvailabilityRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Appointment bookAppointment(Long patientId, Long doctorId, Long availabilityId, String reason) {
        DoctorAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability slot not found"));
                
        if (Boolean.TRUE.equals(availability.getIsBooked())) {
            throw new RuntimeException("This slot is already booked.");
        }
        
        LocalDateTime appointmentDateTime = LocalDateTime.of(availability.getAvailabilityDate(), availability.getStartTime());
        
        boolean overlap = appointmentRepository.existsByDoctorIdAndAppointmentDate(doctorId, appointmentDateTime);
        if (overlap) {
            throw new RuntimeException("Doctor already has an appointment at this time.");
        }
        
        User patient = userRepository.findById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .doctorAvailability(availability)
                .appointmentDate(appointmentDateTime)
                .status("PENDING")
                .reason(reason)
                .build();
                
        availability.setIsBooked(true);
        availabilityRepository.save(availability);
        
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        
        if ("CANCELLED".equals(status) || "REJECTED".equals(status)) {
            DoctorAvailability availability = appointment.getDoctorAvailability();
            if (availability != null) {
                availability.setIsBooked(false);
                availabilityRepository.save(availability);
            }
        }
        
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
