package com.hospital.backend.controller;

import com.hospital.backend.entity.Review;
import com.hospital.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/doctor/{doctorId}")
    public List<Review> getDoctorReviews(@PathVariable Long doctorId) {
        return reviewService.getReviewsByDoctor(doctorId);
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Review> addReview(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(patientId, doctorId, review));
    }
}
