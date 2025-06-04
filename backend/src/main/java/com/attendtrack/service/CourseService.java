```java
package com.attendtrack.service;

import com.attendtrack.domain.Course;
import com.attendtrack.domain.User;
import com.attendtrack.repository.CourseRepository;
import com.attendtrack.exception.CourseNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserService userService;

    @Transactional
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public Course getCourseById(String id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Course> getCoursesForStudent(String userId) {
        User student = userService.getUserById(userId);
        return courseRepository.findByStudentsContaining(student);
    }

    @Transactional
    public Course enrollStudent(String courseId, String userId) {
        Course course = getCourseById(courseId);
        User student = userService.getUserById(userId);
        
        course.addStudent(student);
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(String id, Course updatedCourse) {
        Course course = getCourseById(id);
        
        course.setCode(updatedCourse.getCode());
        course.setName(updatedCourse.getName());
        course.setInstructor(updatedCourse.getInstructor());
        course.setTotalClasses(updatedCourse.getTotalClasses());
        
        return courseRepository.save(course);
    }
}
```