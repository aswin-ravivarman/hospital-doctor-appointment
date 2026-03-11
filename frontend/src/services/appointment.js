import api from './auth';

class AppointmentService {
    getAllAppointments() {
        return api.get('/appointments');
    }

    getAppointmentsByPatient(patientId) {
        return api.get(`/appointments/patient/${patientId}`);
    }

    getAppointmentsByDoctor(doctorId) {
        return api.get(`/appointments/doctor/${doctorId}`);
    }

    bookAppointment(patientId, doctorId, availabilityId, reason) {
        return api.post(`/appointments/book?patientId=${patientId}&doctorId=${doctorId}&availabilityId=${availabilityId}`, { reason });
    }

    updateStatus(appointmentId, status) {
        return api.put(`/appointments/${appointmentId}/status`, { status });
    }
}

export const appointmentService = new AppointmentService();
