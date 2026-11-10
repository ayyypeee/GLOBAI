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

import com.csit321G5.Globai.entity.CourseEntity;
import com.csit321G5.Globai.service.CourseService;

@RestController
@RequestMapping("/course/api")
public class CourseController {

    @Autowired
    CourseService cserv;

    @PostMapping("/postCourse")
    public CourseEntity postCourse(@RequestBody CourseEntity course) {
        return cserv.postCourse(course);
    }

    @GetMapping("/getAllCourses")
    public List<CourseEntity> getAllCourses() {
        return cserv.getAllCourses();
    }

    @PutMapping("/putCourse/{code}")
    public CourseEntity putCourse(@PathVariable String code, @RequestBody CourseEntity details) {
        return cserv.putCourse(code, details);
    }

    @DeleteMapping("/deleteCourse/{code}")
    public String deleteCourse(@PathVariable String code) {
        return cserv.deleteCourse(code);
    }
}