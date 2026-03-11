package com.hospital.backend.repository;

import com.hospital.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorId(Long doctorId);
    List<DoctorAvailability> findByDoctorIdAndAvailabilityDate(Long doctorId, LocalDate availabilityDate);
    List<DoctorAvailability> findByDoctorIdAndIsBookedFalse(Long doctorId);
}
