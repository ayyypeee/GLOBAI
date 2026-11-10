package com.csit321G5.Globai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csit321G5.Globai.entity.TeacherEntity;
import com.csit321G5.Globai.service.TeacherService;

@RestController
@RequestMapping("/teacher/api")
public class TeacherController {

    @Autowired
    TeacherService tserv;

    @PostMapping("/postTeacher")
    public TeacherEntity postTeacher(@RequestBody TeacherEntity teacher) {
        return tserv.postTeacher(teacher);
    }

    @GetMapping("/getAllTeachers")
    public List<TeacherEntity> getAllTeachers() {
        return tserv.getAllTeachers();
    }

    @PutMapping("/putTeacher/{id}")
    public TeacherEntity putTeacher(@PathVariable int id, @RequestBody TeacherEntity details) {
        return tserv.putTeacher(id, details);
    }

    @DeleteMapping("/deleteTeacher/{id}")
    public String deleteTeacher(@PathVariable int id) {
        return tserv.deleteTeacher(id);
    }
}