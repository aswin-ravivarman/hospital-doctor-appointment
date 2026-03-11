package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    
    // For overlap check
    boolean existsByDoctorIdAndAppointmentDate(Long doctorId, LocalDateTime appointmentDate);
    
    // For admin aggregation queries
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countAppointmentsByStatus(@Param("status") String status);
}
