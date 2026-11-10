package com.csit321G5.Globai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G5.Globai.entity.CourseEntity;
import com.csit321G5.Globai.entity.EnrollmentEntity;
import com.csit321G5.Globai.entity.StudentEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.CourseRepository;
import com.csit321G5.Globai.repository.EnrollmentRepository;
import com.csit321G5.Globai.repository.StudentRepository;

@Service
public class EnrollmentService {

    @Autowired
    EnrollmentRepository erepo;

    @Autowired
    StudentRepository srepo;

    @Autowired
    CourseRepository crepo;

    public EnrollmentEntity postEnrollment(EnrollmentEntity details) {
        EnrollmentEntity enrollment = new EnrollmentEntity();
        fill(enrollment, details);
        return erepo.save(enrollment);
    }

    public List<EnrollmentEntity> getAllEnrollments() {
        return erepo.findAll();
    }

    public EnrollmentEntity putEnrollment(int id, EnrollmentEntity details) {
        EnrollmentEntity enrollment = find(id);
        fill(enrollment, details);
        return erepo.save(enrollment);
    }

    public String deleteEnrollment(int id) {
        find(id);
        erepo.deleteById(id);
        return "Enrollment " + id + " is successfully deleted!";
    }

    private EnrollmentEntity find(int id) {
        return erepo.findById(id).orElseThrow(() -> ApiError.notFound("Enrollment " + id + " does not exist!"));
    }

    private void fill(EnrollmentEntity target, EnrollmentEntity details) {
        if (details.getStudent() == null || details.getCourse() == null) {
            throw ApiError.badRequest("Choose a student and a course.");
        }
        StudentEntity student = srepo.findById(details.getStudent().getStudentid())
                .orElseThrow(() -> ApiError.badRequest("Choose a valid student."));
        CourseEntity course = crepo.findById(details.getCourse().getCoursecode())
                .orElseThrow(() -> ApiError.badRequest("Choose a valid course."));
        erepo.findByStudent_StudentidAndCourse_Coursecode(student.getStudentid(), course.getCoursecode())
                .filter(found -> found.getEnrollmentid() != target.getEnrollmentid())
                .ifPresent(found -> {
                    throw ApiError.conflict("This student is already enrolled in that course.");
                });
        target.setStudent(student);
        target.setCourse(course);
        target.setDateenrolled(details.getDateenrolled() == null ? LocalDate.now() : details.getDateenrolled());
    }
}