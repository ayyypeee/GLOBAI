package com.csit321G5.Globai.service;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csit321G5.Globai.dto.RegisterRequest;
import com.csit321G5.Globai.entity.StudentEntity;
import com.csit321G5.Globai.entity.TeacherEntity;
import com.csit321G5.Globai.entity.UserEntity;
import com.csit321G5.Globai.exception.ApiError;
import com.csit321G5.Globai.repository.CourseRepository;
import com.csit321G5.Globai.repository.EnrollmentRepository;
import com.csit321G5.Globai.repository.StudentRepository;
import com.csit321G5.Globai.repository.TeacherRepository;
import com.csit321G5.Globai.repository.UserRepository;

@Service
public class UserService {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    @Autowired
    UserRepository urepo;

    @Autowired
    StudentRepository srepo;

    @Autowired
    TeacherRepository trepo;

    @Autowired
    CourseRepository crepo;

    @Autowired
    EnrollmentRepository erepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public UserEntity postUser(RegisterRequest request) {
        String username = clean(request.username());
        String fullname = clean(request.fullname());
        String email = clean(request.email());
        String role = clean(request.role()).toUpperCase();
        String password = request.password();

        if (username.isEmpty() || fullname.isEmpty() || email.isEmpty()) {
            throw ApiError.badRequest("Please fill in all fields.");
        }
        if (password == null || password.length() < 6) {
            throw ApiError.badRequest("Password needs at least 6 characters.");
        }
        if (!EMAIL.matcher(email).matches()) {
            throw ApiError.badRequest("Enter a valid email address.");
        }
        if (!"STUDENT".equals(role) && !"TEACHER".equals(role)) {
            throw ApiError.badRequest("Role must be STUDENT or TEACHER.");
        }
        if (request.yearlevel() != null && (request.yearlevel() < 1 || request.yearlevel() > 6)) {
            throw ApiError.badRequest("Year level must be from 1 to 6.");
        }
        if (urepo.existsByUsername(username)) {
            throw ApiError.conflict("Username is already taken.");
        }
        if (urepo.existsByEmail(email)) {
            throw ApiError.conflict("Email is already registered.");
        }

        UserEntity user = urepo.save(new UserEntity(username, encoder.encode(password), role, fullname, email));

        if ("STUDENT".equals(role)) {
            StudentEntity student = new StudentEntity();
            student.setUser(user);
            student.setProgram(blankToNull(request.program()));
            student.setYearlevel(request.yearlevel() == null ? 0 : request.yearlevel());
            srepo.save(student);
        } else {
            TeacherEntity teacher = new TeacherEntity();
            teacher.setUser(user);
            teacher.setDepartment(blankToNull(request.department()));
            trepo.save(teacher);
        }
        return user;
    }

    public UserEntity login(String username, String password) {
        UserEntity user = urepo.findByUsername(clean(username));
        if (user == null || password == null || !encoder.matches(password, user.getPassword())) {
            throw ApiError.unauthorized("Invalid username or password.");
        }
        return user;
    }

    public List<UserEntity> getAllUsers() {
        return urepo.findAll();
    }

    public UserEntity getUser(int id) {
        return find(id);
    }

    public UserEntity putUserEmail(int id, UserEntity details) {
        UserEntity user = find(id);
        String email = clean(details.getEmail());
        if (!EMAIL.matcher(email).matches()) {
            throw ApiError.badRequest("Enter a valid email address.");
        }
        UserEntity owner = urepo.findByEmail(email);
        if (owner != null && owner.getUserid() != user.getUserid()) {
            throw ApiError.conflict("Email is already registered.");
        }
        user.setEmail(email);
        return urepo.save(user);
    }

    @Transactional
    public String deleteUser(int id) {
        UserEntity user = find(id);
        srepo.findByUser_Userid(id).ifPresent(student -> {
            erepo.deleteByStudent_Studentid(student.getStudentid());
            srepo.delete(student);
        });
        trepo.findByUser_Userid(id).ifPresent(teacher -> {
            crepo.findByTeacher_Teacherid(teacher.getTeacherid()).forEach(course -> {
                erepo.deleteByCourse_Coursecode(course.getCoursecode());
                crepo.delete(course);
            });
            trepo.delete(teacher);
        });
        urepo.delete(user);
        return "User " + id + " is successfully deleted!";
    }

    @Transactional
    public StudentEntity getStudentProfile(int userid) {
        UserEntity user = find(userid);
        if (!"STUDENT".equals(user.getRole())) {
            throw ApiError.badRequest("Only students can do this.");
        }
        return srepo.findByUser_Userid(userid).orElseGet(() -> {
            StudentEntity student = new StudentEntity();
            student.setUser(user);
            return srepo.save(student);
        });
    }

    @Transactional
    public TeacherEntity getTeacherProfile(int userid) {
        UserEntity user = find(userid);
        if (!"TEACHER".equals(user.getRole())) {
            throw ApiError.badRequest("Only teachers can do this.");
        }
        return trepo.findByUser_Userid(userid).orElseGet(() -> {
            TeacherEntity teacher = new TeacherEntity();
            teacher.setUser(user);
            return trepo.save(teacher);
        });
    }

    private UserEntity find(int id) {
        return urepo.findById(id).orElseThrow(() -> ApiError.notFound("User " + id + " does not exist!"));
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String blankToNull(String value) {
        String cleaned = clean(value);
        return cleaned.isEmpty() ? null : cleaned;
    }
}