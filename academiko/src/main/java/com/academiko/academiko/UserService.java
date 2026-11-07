package com.academiko.academiko;

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

    // ---------- Create (registration: the email is the username) ----------

    public User create(UserRequest req) {
        if (isBlank(req.password()) || isBlank(req.name())
                || isBlank(req.email()) || isBlank(req.role())) {
            throw new IllegalArgumentException("Please fill in all required fields.");
        }

        String role = req.role().trim().toUpperCase();
        if (!role.equals("TEACHER") && !role.equals("STUDENT")) {
            throw new IllegalArgumentException("Role must be Teacher or Student.");
        }
        if (role.equals("STUDENT") && isBlank(req.studentId())) {
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
        String studentId = role.equals("STUDENT") ? req.studentId().trim() : null;

        if (users.existsByEmailIgnoreCase(email) || users.existsByUsername(username)) {
            throw new IllegalStateException("That email is already registered.");
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
        user.setStudentId(studentId);
        return users.save(user);
    }

    // ---------- Update (name, email, student ID, optional new password) ----------

    public User update(Long id, UserRequest req) {
        User user = getById(id);

        if (isBlank(req.name()) || isBlank(req.email())) {
            throw new IllegalArgumentException("Name and email are required.");
        }

        String email = req.email().trim();
        Optional<User> sameEmail = users.findByEmailIgnoreCase(email);
        if (sameEmail.isPresent() && !sameEmail.get().getId().equals(id)) {
            throw new IllegalStateException("That email is already registered.");
        }

        if (user.getRole().equals("STUDENT")) {
            if (isBlank(req.studentId())) {
                throw new IllegalArgumentException("Student ID is required for students.");
            }
            String studentId = req.studentId().trim();
            Optional<User> sameId = users.findByStudentId(studentId);
            if (sameId.isPresent() && !sameId.get().getId().equals(id)) {
                throw new IllegalStateException("That student ID is already registered.");
            }
            user.setStudentId(studentId);
        }

        if (!isBlank(req.password())) {
            if (req.password().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters.");
            }
            user.setPassword(encoder.encode(req.password()));
        }

        user.setName(req.name().trim());
        user.setEmail(email);
        if (!user.getRole().equals("ADMIN")) {
            user.setUsername(email.toLowerCase());   // the username follows the email
        }
        return users.save(user);
    }

    // ---------- Delete ----------

    public void delete(Long id) {
        User user = getById(id);
        if (user.getRole().equals("ADMIN")) {
            throw new IllegalStateException("The admin account cannot be deleted.");
        }
        users.delete(user);
    }

    // ---------- Login and password reset ----------

    // Accepts a username or an email
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

    // ---------- Default admin (runs at startup) ----------

    public void ensureAdmin() {
        if (users.existsByUsername("admin")) return;

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@school.edu");
        admin.setPassword(encoder.encode("admin123"));
        admin.setName("Administrator");
        admin.setRole("ADMIN");
        users.save(admin);
        System.out.println("Admin account created: admin / admin123");
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}