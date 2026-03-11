import api from './auth';

class ReviewService {
    getDoctorReviews(doctorId) {
        return api.get(`/reviews/doctor/${doctorId}`);
    }

    addReview(patientId, doctorId, reviewData) {
        return api.post(`/reviews?patientId=${patientId}&doctorId=${doctorId}`, reviewData);
    }
}

export const reviewService = new ReviewService();
