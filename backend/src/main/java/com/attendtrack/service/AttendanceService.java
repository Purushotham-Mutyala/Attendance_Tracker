```java
package com.attendtrack.service;

import com.attendtrack.domain.Attendance;
import com.attendtrack.domain.Course;
import com.attendtrack.domain.User;
import com.attendtrack.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final CourseService courseService;
    private final UserService userService;

    @Transactional
    public Attendance markAttendance(String courseId, String userId, LocalDateTime date, Attendance.Status status) {
        Course course = courseService.getCourseById(courseId);
        User student = userService.getUserById(userId);
        
        return attendanceRepository.findByCourseAndStudentAndDate(course, student, date)
            .map(attendance -> {
                attendance.setStatus(status);
                return attendanceRepository.save(attendance);
            })
            .orElseGet(() -> {
                Attendance attendance = Attendance.builder()
                    .course(course)
                    .student(student)
                    .date(date)
                    .status(status)
                    .build();
                return attendanceRepository.save(attendance);
            });
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceForCourse(String courseId, String userId) {
        Course course = courseService.getCourseById(courseId);
        User student = userService.getUserById(userId);
        return attendanceRepository.findByCourseAndStudent(course, student);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceForDateRange(String userId, LocalDateTime start, LocalDateTime end) {
        User student = userService.getUserById(userId);
        return attendanceRepository.findByStudentAndDateBetween(student, start, end);
    }
}
```