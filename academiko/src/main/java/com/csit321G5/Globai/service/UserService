package com.csit321G5.Globai.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G5.Globai.entity.UserEntity;
import com.csit321G5.Globai.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository urepo;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService() {

    }

    public UserEntity postUser(UserEntity user) {
        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getPassword() == null || user.getPassword().length() < 6
                || user.getFullname() == null || user.getFullname().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Please fill in all fields. Password needs at least 6 characters.");
        }
        if (!"STUDENT".equals(user.getRole()) && !"TEACHER".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be STUDENT or TEACHER.");
        }
        if (urepo.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken.");
        }
        if (urepo.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered.");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return urepo.save(user);
    }

    public UserEntity login(String username, String password) {
        UserEntity user = urepo.findByUsername(username);
        if (user == null || password == null || !encoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
        }
        return user;
    }

    public List<UserEntity> getAllUsers() {
        return urepo.findAll();
    }

    public UserEntity putUserEmail(int id, UserEntity newUserDetails) {
        UserEntity user;
        try {
        
            user = urepo.findById(id).get();
        } catch (NoSuchElementException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " does not exist!");
        }
        user.setEmail(newUserDetails.getEmail());
        return urepo.save(user);
    }

    public String deleteUser(int id) {
        String msg = "";
        if (urepo.existsById(id)) {
            urepo.deleteById(id);
            msg = "User " + id + " is successfully deleted!";
        } else
            msg = id + " does not exist!";
        return msg;
    }
}