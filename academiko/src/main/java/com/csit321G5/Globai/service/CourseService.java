package com.csit321G5.Globai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G5.Globai.entity.CourseEntity;
import com.csit321G5.Globai.entity.TeacherEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.CourseRepository;
import com.csit321G5.Globai.repository.TeacherRepository;

@Service
public class CourseService {

    @Autowired
    CourseRepository crepo;

    @Autowired
    TeacherRepository trepo;

    public CourseEntity postCourse(CourseEntity course) {
        if (course.getCoursecode() == null || course.getCoursecode().isBlank()) {
            throw ApiError.badRequest("Enter a course code.");
        }
        course.setCoursecode(course.getCoursecode().trim().toUpperCase());
        if (crepo.existsById(course.getCoursecode())) {
            throw ApiError.conflict("Course code " + course.getCoursecode() + " already exists.");
        }
        checkDetails(course);
        course.setTeacher(findTeacher(course));
        return crepo.save(course);
    }

    public List<CourseEntity> getAllCourses() {
        return crepo.findAll();
    }

    public CourseEntity putCourse(String code, CourseEntity details) {
        CourseEntity course = find(code);
        checkDetails(details);
        course.setTitle(details.getTitle());
        course.setUnits(details.getUnits());
        course.setTeacher(findTeacher(details));
        return crepo.save(course);
    }

    public String deleteCourse(String code) {
        find(code);
        crepo.deleteById(code);
        return "Course " + code + " is successfully deleted!";
    }

    private CourseEntity find(String code) {
        return crepo.findById(code).orElseThrow(() -> ApiError.notFound("Course " + code + " does not exist!"));
    }

    private TeacherEntity findTeacher(CourseEntity course) {
        if (course.getTeacher() == null) {
            throw ApiError.badRequest("Choose a teacher.");
        }
        return trepo.findById(course.getTeacher().getTeacherid())
                .orElseThrow(() -> ApiError.badRequest("Choose a valid teacher."));
    }

    private void checkDetails(CourseEntity course) {
        if (course.getTitle() == null || course.getTitle().isBlank()
                || course.getUnits() < 1 || course.getUnits() > 6) {
            throw ApiError.badRequest("Enter a title and units from 1 to 6.");
        }
    }
}