package com.csit321G5.Globai.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblstudent")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentid;

    @OneToOne
    @JoinColumn(name = "userid", nullable = false, unique = true)
    private UserEntity user;

    private String program;
    private int yearlevel;

    public StudentEntity() {
    }

    public int getStudentid() { return studentid; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public int getYearlevel() { return yearlevel; }
    public void setYearlevel(int yearlevel) { this.yearlevel = yearlevel; }
}