package com.csit321G5.Globai;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private static final Map<String, String> COURSE_TITLES = Map.of(
        "CSIT321", "Applications Development",
        "CSIT327", "Information Management 2",
        "CSIT340", "IT Project Management"
    );
    private static final Map<String, Set<String>> COURSE_STUDENTS = Map.of(
        "CSIT321", Set.of("2026001", "2026002", "2000000"),
        "CSIT327", Set.of("2026003", "2026004", "2000000"),
        "CSIT340", Set.of("2026005", "2026006", "2000000")
    );
    private static final Set<String> STATUSES = Set.of("Present", "Absent", "Excused", "Late");

    private final Map<String, List<AttendanceRecord>> recordsByCourseAndDate = new ConcurrentHashMap<>();

    public record AttendanceEntry(String studentId, String studentName, String status) {}
    public record SaveAttendanceRequest(String courseCode, String date, List<AttendanceEntry> entries) {}
    public record AttendanceRecord(
        String courseCode,
        String courseTitle,
        String date,
        String studentId,
        String studentName,
        String status
    ) {}

    @PostMapping
    public ResponseEntity<?> save(@RequestBody SaveAttendanceRequest request) {
        if (request == null || request.courseCode() == null || request.date() == null || request.entries() == null) {
            return ResponseEntity.badRequest().body("Course, date, and attendance entries are required.");
        }

        String courseCode = request.courseCode().trim().toUpperCase();
        Set<String> expectedStudents = COURSE_STUDENTS.get(courseCode);
        if (expectedStudents == null) {
            return ResponseEntity.badRequest().body("Unknown course.");
        }

        try {
            LocalDate.parse(request.date());
        } catch (DateTimeParseException exception) {
            return ResponseEntity.badRequest().body("Enter a valid attendance date.");
        }

        if (request.entries().size() != expectedStudents.size()) {
            return ResponseEntity.badRequest().body("Submit an attendance status for every student in the course.");
        }

        Set<String> submittedStudents = ConcurrentHashMap.newKeySet();
        for (AttendanceEntry entry : request.entries()) {
            if (entry == null || entry.studentId() == null || entry.studentName() == null || entry.status() == null) {
                return ResponseEntity.badRequest().body("Each attendance entry needs a student, name, and status.");
            }
            if (!expectedStudents.contains(entry.studentId()) || !submittedStudents.add(entry.studentId())) {
                return ResponseEntity.badRequest().body("Attendance contains an unknown or duplicate student.");
            }
            if (entry.studentName().isBlank() || !STATUSES.contains(entry.status())) {
                return ResponseEntity.badRequest().body("Each student needs a name and a valid attendance status.");
            }
        }

        List<AttendanceRecord> savedRecords = request.entries().stream()
            .map(entry -> new AttendanceRecord(
                courseCode,
                COURSE_TITLES.get(courseCode),
                request.date(),
                entry.studentId(),
                entry.studentName().trim(),
                entry.status()
            ))
            .toList();
        recordsByCourseAndDate.put(courseCode + "|" + request.date(), savedRecords);

        return ResponseEntity.ok(Map.of("message", "Attendance saved.", "count", savedRecords.size()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> forStudent(@PathVariable String studentId) {
        if (studentId == null || studentId.isBlank()) {
            return ResponseEntity.badRequest().body("Student ID is required.");
        }

        List<AttendanceRecord> studentRecords = recordsByCourseAndDate.values().stream()
            .flatMap(List::stream)
            .filter(record -> record.studentId().equals(studentId))
            .sorted(Comparator.comparing(AttendanceRecord::date).reversed()
                .thenComparing(AttendanceRecord::courseCode))
            .toList();
        return ResponseEntity.status(HttpStatus.OK).body(studentRecords);
    }
}
