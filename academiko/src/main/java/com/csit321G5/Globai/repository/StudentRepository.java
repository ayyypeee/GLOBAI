package com.csit321G5.Globai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G5.Globai.entity.StudentEntity;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {

    boolean existsByUser_Userid(int userid);

    Optional<StudentEntity> findByUser_Userid(int userid);
}