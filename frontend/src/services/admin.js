import api from './auth';
import axios from 'axios';

const API_URL = "http://localhost:8080/api/";

const publicApi = axios.create({
  baseURL: API_URL,
});

class AdminService {
    getDepartments() {
        return publicApi.get('departments');
    }

    addDepartment(department) {
        return api.post('/departments', department);
    }

    deleteDepartment(id) {
        return api.delete(`/departments/${id}`);
    }

    getDashboardStats() {
        return api.get('/admin/stats');
    }
}

export const adminService = new AdminService();
