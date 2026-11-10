package com.csit321G5.Globai.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "tblenrollment", uniqueConstraints = @UniqueConstraint(columnNames = { "studentid", "coursecode" }))
public class EnrollmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int enrollmentid;

    @ManyToOne
    @JoinColumn(name = "studentid", nullable = false)
    private StudentEntity student;

    @ManyToOne
    @JoinColumn(name = "coursecode", nullable = false)
    private CourseEntity course;

    private LocalDate dateenrolled;

    public EnrollmentEntity() {
    }

    public int getEnrollmentid() { return enrollmentid; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }

    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }

    public LocalDate getDateenrolled() { return dateenrolled; }
    public void setDateenrolled(LocalDate dateenrolled) { this.dateenrolled = dateenrolled; }
}