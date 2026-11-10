package com.csit321G5.Globai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G5.Globai.entity.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, String> {
}