package com.hospital.backend.service;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public List<Doctor> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = getDoctorById(id);
        if (doctor != null) {
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setExperienceYears(doctorDetails.getExperienceYears());
            doctor.setConsultationFee(doctorDetails.getConsultationFee());
            return doctorRepository.save(doctor);
        }
        return null;
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
