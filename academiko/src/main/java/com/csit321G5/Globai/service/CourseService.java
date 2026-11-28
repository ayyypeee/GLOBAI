package com.csit321G5.Globai.service;

import java.security.SecureRandom;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csit321G5.Globai.entity.CourseEntity;
import com.csit321G5.Globai.entity.TeacherEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.CourseRepository;
import com.csit321G5.Globai.repository.EnrollmentRepository;
import com.csit321G5.Globai.repository.TeacherRepository;

@Service
public class CourseService {

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    @Autowired
    CourseRepository crepo;

    @Autowired
    TeacherRepository trepo;

    @Autowired
    EnrollmentRepository erepo;

    @Autowired
    UserService userv;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public CourseEntity postCourse(CourseEntity details, Integer userid) {
        checkDetails(details);
        TeacherEntity teacher = userid != null ? userv.getTeacherProfile(userid) : findTeacher(details);
        CourseEntity course = new CourseEntity();
        course.setCoursecode(newCode());
        course.setTitle(details.getTitle().trim());
        course.setUnits(details.getUnits());
        course.setTeacher(teacher);
        return crepo.save(course);
    }

    public List<CourseEntity> getAllCourses() {
        return crepo.findAll();
    }

    public List<CourseEntity> getCoursesByTeacher(int userid) {
        return crepo.findByTeacher_User_Userid(userid);
    }

    @Transactional
    public CourseEntity putCourse(String code, CourseEntity details) {
        CourseEntity course = find(code);
        checkDetails(details);
        course.setTitle(details.getTitle().trim());
        course.setUnits(details.getUnits());
        if (details.getTeacher() != null) {
            course.setTeacher(findTeacher(details));
        }
        return crepo.save(course);
    }

    @Transactional
    public String deleteCourse(String code) {
        find(code);
        erepo.deleteByCourse_Coursecode(code);
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

    private String newCode() {
        String code;
        do {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < CODE_LENGTH; i++) {
                builder.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            code = builder.toString();
        } while (crepo.existsById(code));
        return code;
    }
}