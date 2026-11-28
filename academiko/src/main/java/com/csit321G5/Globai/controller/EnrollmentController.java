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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csit321G5.Globai.entity.EnrollmentEntity;
import com.csit321G5.Globai.service.EnrollmentService;

@RestController
@RequestMapping("/enrollment/api")
public class EnrollmentController {

    @Autowired
    EnrollmentService eserv;

    @PostMapping("/postEnrollment")
    public EnrollmentEntity postEnrollment(@RequestBody EnrollmentEntity enrollment) {
        return eserv.postEnrollment(enrollment);
    }

    @PostMapping("/joinCourse")
    public EnrollmentEntity joinCourse(@RequestParam int userid, @RequestParam String code) {
        return eserv.joinCourse(userid, code);
    }

    @GetMapping("/getAllEnrollments")
    public List<EnrollmentEntity> getAllEnrollments() {
        return eserv.getAllEnrollments();
    }

    @GetMapping("/getEnrollmentsByStudent/{userid}")
    public List<EnrollmentEntity> getEnrollmentsByStudent(@PathVariable int userid) {
        return eserv.getEnrollmentsByStudent(userid);
    }

    @GetMapping("/getEnrollmentsByTeacher/{userid}")
    public List<EnrollmentEntity> getEnrollmentsByTeacher(@PathVariable int userid) {
        return eserv.getEnrollmentsByTeacher(userid);
    }

    @GetMapping("/getEnrollmentsByCourse/{code}")
    public List<EnrollmentEntity> getEnrollmentsByCourse(@PathVariable String code) {
        return eserv.getEnrollmentsByCourse(code);
    }

    @GetMapping("/countByCourse/{code}")
    public long countByCourse(@PathVariable String code) {
        return eserv.countByCourse(code);
    }

    @PutMapping("/putEnrollment/{id}")
    public EnrollmentEntity putEnrollment(@PathVariable int id, @RequestBody EnrollmentEntity details) {
        return eserv.putEnrollment(id, details);
    }

    @DeleteMapping("/deleteEnrollment/{id}")
    public String deleteEnrollment(@PathVariable int id) {
        return eserv.deleteEnrollment(id);
    }
}