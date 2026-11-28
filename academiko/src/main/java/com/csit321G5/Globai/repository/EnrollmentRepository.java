package com.csit321G5.Globai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G5.Globai.entity.EnrollmentEntity;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Integer> {

    Optional<EnrollmentEntity> findByStudent_StudentidAndCourse_Coursecode(int studentid, String coursecode);

    List<EnrollmentEntity> findByStudent_User_Userid(int userid);

    List<EnrollmentEntity> findByCourse_Coursecode(String coursecode);

    List<EnrollmentEntity> findByCourse_Teacher_User_Userid(int userid);

    long countByCourse_Coursecode(String coursecode);

    void deleteByCourse_Coursecode(String coursecode);

    void deleteByStudent_Studentid(int studentid);
}