package com.csit321G5.Globai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G5.Globai.entity.TeacherEntity;
import com.csit321G5.Globai.entity.UserEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.TeacherRepository;
import com.csit321G5.Globai.repository.UserRepository;

@Service
public class TeacherService {

    @Autowired
    TeacherRepository trepo;

    @Autowired
    UserRepository urepo;

    public TeacherEntity postTeacher(TeacherEntity teacher) {
        checkDetails(teacher);
        UserEntity user = findTeacherUser(teacher);
        if (trepo.existsByUser_Userid(user.getUserid())) {
            throw ApiError.conflict("This user already has a teacher profile.");
        }
        teacher.setUser(user);
        return trepo.save(teacher);
    }

    public List<TeacherEntity> getAllTeachers() {
        return trepo.findAll();
    }

    public TeacherEntity putTeacher(int id, TeacherEntity details) {
        TeacherEntity teacher = find(id);
        checkDetails(details);
        teacher.setDepartment(details.getDepartment());
        return trepo.save(teacher);
    }

    public String deleteTeacher(int id) {
        find(id);
        trepo.deleteById(id);
        return "Teacher " + id + " is successfully deleted!";
    }

    private TeacherEntity find(int id) {
        return trepo.findById(id).orElseThrow(() -> ApiError.notFound("Teacher " + id + " does not exist!"));
    }

    private UserEntity findTeacherUser(TeacherEntity teacher) {
        if (teacher.getUser() == null) {
            throw ApiError.badRequest("Choose a user.");
        }
        UserEntity user = urepo.findById(teacher.getUser().getUserid())
                .orElseThrow(() -> ApiError.badRequest("Choose a valid user."));
        if (!"TEACHER".equals(user.getRole())) {
            throw ApiError.badRequest("That user is not a teacher.");
        }
        return user;
    }

    private void checkDetails(TeacherEntity teacher) {
        if (teacher.getDepartment() == null || teacher.getDepartment().isBlank()) {
            throw ApiError.badRequest("Enter a department.");
        }
    }
}