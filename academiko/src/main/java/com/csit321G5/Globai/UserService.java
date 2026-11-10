package com.csit321G5.Globai;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository users) {
        this.users = users;
    }

    // ---------- Read ----------

    public List<User> findAll() {
        return users.findAll();
    }

    public User getById(Long id) {
        return users.findById(id).orElseThrow(() -> new NoSuchElementException("User not found."));
    }

    public Optional<User> findByEmail(String email) {
        if (isBlank(email)) return Optional.empty();
        return users.findByEmailIgnoreCase(email.trim());
    }

    // ---------- Account request (student or staff asks the admin for an account) ----------
    // The account is saved as PENDING. It cannot log in until the admin approves it.

    public User requestAccount(UserRequest req) {
        if (isBlank(req.password()) || isBlank(req.name())
                || isBlank(req.email()) || isBlank(req.role())) {
            throw new IllegalArgumentException("Please fill in all required fields.");
        }

        String role = req.role().trim().toUpperCase();
        if (!role.equals(User.STAFF) && !role.equals(User.STUDENT)) {
            throw new IllegalArgumentException("Role must be Staff or Student.");
        }
        if (role.equals(User.STUDENT) && isBlank(req.studentId())) {
            throw new IllegalArgumentException("Student ID is required for students.");
        }
        if (req.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        String email = req.email().trim();
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Enter a valid email address.");
        }
        String username = email.toLowerCase();   // the email is the username
        String studentId = role.equals(User.STUDENT) ? req.studentId().trim() : null;

        if (users.existsByEmailIgnoreCase(email) || users.existsByUsername(username)) {
            throw new IllegalStateException("That email already has an account or a pending request.");
        }
        if (studentId != null && users.existsByStudentId(studentId)) {
            throw new IllegalStateException("That student ID is already registered.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(req.password()));
        user.setName(req.name().trim());
        user.setRole(role);
        user.setStatus(User.PENDING);
        user.setStudentId(studentId);
        user.setCreatedAt(LocalDate.now());
        return users.save(user);
    }

    // ---------- Admin: approve, reject, delete ----------

    public User approve(Long id) {
        return setStatus(id, User.APPROVED);
    }

    public User reject(Long id) {
        return setStatus(id, User.REJECTED);
    }

    private User setStatus(Long id, String status) {
        User user = getById(id);
        if (user.getRole().equals(User.ADMIN)) {
            throw new IllegalStateException("The admin account cannot be changed.");
        }
        user.setStatus(status);
        return users.save(user);
    }

    public void delete(Long id) {
        User user = getById(id);
        if (user.getRole().equals(User.ADMIN)) {
            throw new IllegalStateException("The admin account cannot be deleted.");
        }
        users.delete(user);
    }

    // ---------- Login and password reset ----------

    // Accepts a username or an email. Returns the user only if the password matches.
    // The caller must still check user.getStatus() before letting the user in.
    public Optional<User> authenticate(String usernameOrEmail, String password) {
        if (isBlank(usernameOrEmail) || password == null) return Optional.empty();
        String key = usernameOrEmail.trim();

        Optional<User> found = users.findByUsername(key.toLowerCase());
        if (found.isEmpty()) {
            found = users.findByEmailIgnoreCase(key);
        }
        return found.filter(u -> encoder.matches(password, u.getPassword()));
    }

    public void changePassword(Long id, String newPassword) {
        if (isBlank(newPassword) || newPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }
        User user = getById(id);
        user.setPassword(encoder.encode(newPassword));
        users.save(user);
    }

    // ---------- Startup setup (runs every time the backend starts) ----------
    // 1. Fixes accounts saved by the old version: TEACHER becomes STAFF,
    //    and accounts with no status become APPROVED so they can still log in.
    // 2. Creates the default admin if it does not exist yet.

    public void prepareAccounts() {
        for (User u : users.findAll()) {
            boolean changed = false;
            if ("TEACHER".equals(u.getRole())) {
                u.setRole(User.STAFF);
                changed = true;
            }
            if (isBlank(u.getStatus())) {
                u.setStatus(User.APPROVED);
                changed = true;
            }
            if (changed) users.save(u);
        }

        if (users.existsByUsername("admin")) return;

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@school.edu");
        admin.setPassword(encoder.encode("admin123"));
        admin.setName("Administrator");
        admin.setRole(User.ADMIN);
        admin.setStatus(User.APPROVED);
        admin.setCreatedAt(LocalDate.now());
        users.save(admin);
        System.out.println("Admin account created: admin / admin123");
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
