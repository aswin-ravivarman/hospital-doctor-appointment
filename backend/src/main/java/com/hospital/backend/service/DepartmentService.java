package com.hospital.backend.service;

import com.hospital.backend.entity.Department;
import com.hospital.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }
    
    public Department addDepartment(Department department) {
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
