package com.csit321G5.Globai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csit321G5.Globai.entity.UserEntity;
import com.csit321G5.Globai.service.UserService;

@RestController
@RequestMapping("/user/api")
public class UserController {

    @Autowired
    UserService userv;

    @PostMapping("/postNewUser")
    public UserEntity postUser(@RequestBody UserEntity user) {
        return userv.postUser(user);
    }

    @PostMapping("/login")
    public UserEntity login(@RequestBody UserEntity user) {
        return userv.login(user.getUsername(), user.getPassword());
    }

    @GetMapping("/getAllUsers")
    public List<UserEntity> getAllUsers() {
        return userv.getAllUsers();
    }

    @PutMapping("/putUserEmail")
    public UserEntity putUserEmail(@RequestParam int id, @RequestBody UserEntity newUserEmail) {
        return userv.putUserEmail(id, newUserEmail);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id) {
        return userv.deleteUser(id);
    }
}