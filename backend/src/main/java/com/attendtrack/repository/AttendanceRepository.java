```java
package com.attendtrack.repository;

import com.attendtrack.domain.Attendance;
import com.attendtrack.domain.Course;
import com.attendtrack.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByCourseAndStudent(Course course, User student);
    Optional<Attendance> findByCourseAndStudentAndDate(Course course, User student, LocalDateTime date);
    List<Attendance> findByStudentAndDateBetween(User student, LocalDateTime start, LocalDateTime end);
}
```