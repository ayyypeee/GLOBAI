package com.csit321G5.Globai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G5.Globai.entity.EnrollmentEntity;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Integer> {

    Optional<EnrollmentEntity> findByStudent_StudentidAndCourse_Coursecode(int studentid, String coursecode);
}