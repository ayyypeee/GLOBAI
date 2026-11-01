package com.academiko.academiko;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** Sample data only. Replace each list with a database query once your tables are ready. */
@RestController
@RequestMapping("/api")
public class DashboardController {

    private static final List<Map<String, String>> ANNOUNCEMENTS = List.of(
        Map.of("title", "Midterm schedule posted", "date", "Nov 3", "body", "Check your course page for the exam schedule."),
        Map.of("title", "Quiz 2 grades released", "date", "Oct 28", "body", "Submit a grade concern if something looks wrong.")
    );

    @GetMapping("/student/dashboard")
    public Map<String, Object> student() {
        return Map.of(
            "summary", Map.of("average", "88.5", "attendanceRate", "94%", "pendingQuizzes", 2, "openConcerns", 1),
            "courses", List.of(
                Map.of("code", "CSIT321", "title", "Applications Development", "grade", "90.0", "attendance", "95%"),
                Map.of("code", "CSIT327", "title", "Information Management 2", "grade", "87.5", "attendance", "92%"),
                Map.of("code", "CSIT340", "title", "IT Project Management", "grade", "88.0", "attendance", "96%")),
            "quizzes", List.of(
                Map.of("title", "Quiz 3: REST APIs", "course", "CSIT321", "due", "Nov 5", "status", "Not taken", "score", "-"),
                Map.of("title", "Quiz 2: SQL Joins", "course", "CSIT327", "due", "Oct 25", "status", "Taken", "score", "18/20")),
            "concerns", List.of(
                Map.of("course", "CSIT327", "subject", "Quiz 2 score looks low", "status", "Under review")),
            "announcements", ANNOUNCEMENTS
        );
    }

    @GetMapping("/teacher/dashboard")
    public Map<String, Object> teacher() {
        return Map.of(
            "summary", Map.of("classes", 3, "students", 96, "activeQuizzes", 2, "openConcerns", 2),
            "classes", List.of(
                Map.of("code", "CSIT321", "title", "Applications Development", "section", "G5", "students", 32, "average", "88.2", "missing", 4, "attendance", "94%"),
                Map.of("code", "CSIT327", "title", "Information Management 2", "section", "G2", "students", 34, "average", "85.9", "missing", 0, "attendance", "91%"),
                Map.of("code", "CSIT340", "title", "IT Project Management", "section", "G1", "students", 30, "average", "89.4", "missing", 7, "attendance", "96%")),
            "quizzes", List.of(
                Map.of("title", "Quiz 3: REST APIs", "course", "CSIT321", "due", "Nov 5", "status", "Published"),
                Map.of("title", "Quiz 4: Normalization", "course", "CSIT327", "due", "-", "status", "Draft")),
            "concerns", List.of(
                Map.of("student", "Santos, Maria L.", "course", "CSIT327", "subject", "Quiz 2 score looks low", "status", "Under review"),
                Map.of("student", "Reyes, John D.", "course", "CSIT321", "subject", "Missing midterm grade", "status", "Pending"),
                Map.of("student", "Cruz, Ana B.", "course", "CSIT340", "subject", "Attendance marked absent", "status", "Resolved")),
            "announcements", ANNOUNCEMENTS
        );
    }
}