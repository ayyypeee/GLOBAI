package com.csit321G5.Globai.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblcourse")
public class CourseEntity {

    @Id
    private String coursecode;

    private String title;
    private int units;

    @ManyToOne
    @JoinColumn(name = "teacherid", nullable = false)
    private TeacherEntity teacher;

    public CourseEntity() {
    }

    public String getCoursecode() { return coursecode; }
    public void setCoursecode(String coursecode) { this.coursecode = coursecode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }

    public TeacherEntity getTeacher() { return teacher; }
    public void setTeacher(TeacherEntity teacher) { this.teacher = teacher; }
}