package com.csit321G5.Globai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G5.Globai.entity.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, String> {

    List<CourseEntity> findByTeacher_User_Userid(int userid);

    List<CourseEntity> findByTeacher_Teacherid(int teacherid);
}