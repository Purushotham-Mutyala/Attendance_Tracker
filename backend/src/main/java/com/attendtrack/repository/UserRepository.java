```java
package com.attendtrack.repository;

import com.attendtrack.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByRollNumber(String rollNumber);
    boolean existsByUsername(String username);
    boolean existsByRollNumber(String rollNumber);
}
```