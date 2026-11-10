package com.csit321G5.Globai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G5.Globai.entity.StudentEntity;
import com.csit321G5.Globai.entity.UserEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.StudentRepository;
import com.csit321G5.Globai.repository.UserRepository;

@Service
public class StudentService {

    @Autowired
    StudentRepository srepo;

    @Autowired
    UserRepository urepo;

    public StudentEntity postStudent(StudentEntity student) {
        checkDetails(student);
        UserEntity user = findStudentUser(student);
        if (srepo.existsByUser_Userid(user.getUserid())) {
            throw ApiError.conflict("This user already has a student profile.");
        }
        student.setUser(user);
        return srepo.save(student);
    }

    public List<StudentEntity> getAllStudents() {
        return srepo.findAll();
    }

    public StudentEntity putStudent(int id, StudentEntity details) {
        StudentEntity student = find(id);
        checkDetails(details);
        student.setProgram(details.getProgram());
        student.setYearlevel(details.getYearlevel());
        return srepo.save(student);
    }

    public String deleteStudent(int id) {
        find(id);
        srepo.deleteById(id);
        return "Student " + id + " is successfully deleted!";
    }

    private StudentEntity find(int id) {
        return srepo.findById(id).orElseThrow(() -> ApiError.notFound("Student " + id + " does not exist!"));
    }

    private UserEntity findStudentUser(StudentEntity student) {
        if (student.getUser() == null) {
            throw ApiError.badRequest("Choose a user.");
        }
        UserEntity user = urepo.findById(student.getUser().getUserid())
                .orElseThrow(() -> ApiError.badRequest("Choose a valid user."));
        if (!"STUDENT".equals(user.getRole())) {
            throw ApiError.badRequest("That user is not a student.");
        }
        return user;
    }

    private void checkDetails(StudentEntity student) {
        if (student.getProgram() == null || student.getProgram().isBlank()
                || student.getYearlevel() < 1 || student.getYearlevel() > 6) {
            throw ApiError.badRequest("Enter a program and a year level from 1 to 6.");
        }
    }
}