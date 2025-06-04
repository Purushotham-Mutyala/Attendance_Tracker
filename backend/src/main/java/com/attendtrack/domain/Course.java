```java
package com.attendtrack.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String instructor;

    @Column(nullable = false)
    private Integer totalClasses;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendanceRecords = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "course_enrollments",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> students = new ArrayList<>();

    public double getAttendancePercentage(User student) {
        long attendedClasses = attendanceRecords.stream()
            .filter(a -> a.getStudent().equals(student) && a.getStatus() == Attendance.Status.PRESENT)
            .count();
        
        return totalClasses > 0 ? (attendedClasses * 100.0) / totalClasses : 0;
    }

    public void addStudent(User student) {
        students.add(student);
    }

    public void removeStudent(User student) {
        students.remove(student);
    }
}
```