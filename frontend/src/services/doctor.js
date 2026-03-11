import api from './auth';

class DoctorService {
    getAllDoctors() {
        return api.get('/doctors');
    }

    getDoctorById(id) {
        return api.get(`/doctors/${id}`);
    }

    getDoctorsByDepartment(departmentId) {
        return api.get(`/doctors/department/${departmentId}`);
    }

    updateDoctor(id, doctorDetails) {
        return api.put(`/doctors/${id}`, doctorDetails);
    }

    deleteDoctor(id) {
        return api.delete(`/doctors/${id}`);
    }

    // Availability methods
    getAvailabilityByDoctor(doctorId) {
        return api.get(`/availability/doctor/${doctorId}`);
    }

    getAvailableSlots(doctorId) {
        return api.get(`/availability/doctor/${doctorId}/available`);
    }

    addAvailability(doctorId, availability) {
        return api.post(`/availability/doctor/${doctorId}`, availability);
    }

    deleteAvailability(id) {
        return api.delete(`/availability/${id}`);
    }
}

export const doctorService = new DoctorService();
