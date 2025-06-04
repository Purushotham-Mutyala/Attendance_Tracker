```java
package com.attendtrack.repository;

import com.attendtrack.domain.Course;
import com.attendtrack.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByStudentsContaining(User student);
    
    @Query("SELECT c FROM Course c JOIN c.students s WHERE s = ?1 AND c.totalClasses > 0")
    List<Course> findActiveCoursesForStudent(User student);
}
```