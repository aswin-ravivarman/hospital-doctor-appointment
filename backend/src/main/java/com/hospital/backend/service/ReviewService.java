package com.hospital.backend.service;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Review;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.ReviewRepository;
import com.hospital.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;

    public List<Review> getReviewsByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    public Review addReview(Long patientId, Long doctorId, Review review) {
        User patient = userRepository.findById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));

        review.setPatient(patient);
        review.setDoctor(doctor);
        review.setReviewDate(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
}
