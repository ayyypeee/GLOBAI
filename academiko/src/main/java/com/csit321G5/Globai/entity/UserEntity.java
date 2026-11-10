package com.csit321G5.Globai.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbluser")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;

    @Column(unique = true)
    private String username;

    // WRITE_ONLY: accepted from Postman, but never sent back in the response
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String role;      // STUDENT or TEACHER
    private String fullname;

    @Column(unique = true)
    private String email;

    public UserEntity() {
    }

    public UserEntity(String username, String password, String role, String fullname, String email) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.fullname = fullname;
        this.email = email;
    }

    public int getUserid() { return userid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}