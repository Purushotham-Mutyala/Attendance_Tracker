```java
package com.attendtrack.service;

import com.attendtrack.domain.User;
import com.attendtrack.repository.UserRepository;
import com.attendtrack.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public User updateUser(String id, User updatedUser) {
        User user = getUserById(id);
        
        user.setUsername(updatedUser.getUsername());
        user.setYear(updatedUser.getYear());
        user.setCourse(updatedUser.getCourse());
        user.setSection(updatedUser.getSection());
        
        return userRepository.save(user);
    }
}
```