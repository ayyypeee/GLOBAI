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

import com.csit321G5.Globai.entity.StudentEntity;
import com.csit321G5.Globai.service.StudentService;

@RestController
@RequestMapping("/student/api")
public class StudentController {

    @Autowired
    StudentService sserv;

    @PostMapping("/postStudent")
    public StudentEntity postStudent(@RequestBody StudentEntity student) {
        return sserv.postStudent(student);
    }

    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return sserv.getAllStudents();
    }

    @PutMapping("/putStudent/{id}")
    public StudentEntity putStudent(@PathVariable int id, @RequestBody StudentEntity details) {
        return sserv.putStudent(id, details);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public String deleteStudent(@PathVariable int id) {
        return sserv.deleteStudent(id);
    }
}