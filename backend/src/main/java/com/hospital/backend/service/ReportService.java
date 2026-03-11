package com.hospital.backend.service;

import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();

        long confirmedAppointments = appointmentRepository.countAppointmentsByStatus("CONFIRMED");
        long completedAppointments = appointmentRepository.countAppointmentsByStatus("COMPLETED");

        stats.put("totalUsers", totalUsers);
        stats.put("totalDoctors", totalDoctors);
        stats.put("totalAppointments", totalAppointments);
        stats.put("confirmedAppointments", confirmedAppointments);
        stats.put("completedAppointments", completedAppointments);

        return stats;
    }
}
