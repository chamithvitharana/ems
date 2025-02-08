package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.entity.auth.User;
import com.ems.commonlib.entity.auth.UserRole;
import com.ems.commonlib.entity.auth.UserStatuses;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.notification.NotificationServiceClient;
import com.ems.service.repository.UserRepository;
import com.ems.service.repository.UserRoleRepository;
import com.ems.service.service.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserRoleRepository userRoleRepository;

    private final PasswordEncoder passwordEncoder;

    private final NotificationServiceClient notificationServiceClient;

    public UserServiceImpl(UserRepository userRepository, UserRoleRepository userRoleRepository, PasswordEncoder passwordEncoder, @Qualifier("com.ems.service.integration.notification.NotificationServiceClient") NotificationServiceClient notificationServiceClient) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public User createUser(User user) {
        // Create and save the userForCreation
        User userForCreation = new User();
        userForCreation.setUsername(user.getUsername());
        userForCreation.setEmail(user.getEmail());
        userForCreation.setPassword(passwordEncoder.encode(user.getPassword()));
        userForCreation.setContactNumber(user.getContactNumber());
        userForCreation.setStatus(UserStatuses.ACTIVE);
        userForCreation.setCustomerId(user.getCustomerId());
        userForCreation.setAgentId(user.getAgentId());

        Optional<UserRole> userRole = userRoleRepository.findByCode(user.getRole().getCode());
        userRole.ifPresent(userForCreation::setRole);

        return userRepository.save(userForCreation);
    }

    @Override
    public User update(User user) {
        // Create and save the userForCreation
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public void sendResetCode(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String resetCode = generateResetCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);

        user.setResetCode(resetCode);
        user.setResetCodeExpiration(expirationTime);
        userRepository.save(user);

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", user.getUsername());
        variables.put("resetCode", resetCode);

        NotificationVo notificationVo = NotificationVo.builder()
                .toEmails(Collections.singletonList(user.getEmail()))
                .mobileNumbers(Collections.singletonList(user.getContactNumber()))
                .variables(variables)
                .notificationSource(NotificationSource.PASSWORD_RESET)
                .build();

        notificationServiceClient.sendEmail(notificationVo);
    }

    private String generateResetCode() {
        int code = new SecureRandom().nextInt(900000) + 100000;
        return String.valueOf(code);
    }

}
