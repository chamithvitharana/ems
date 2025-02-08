package com.ems.service.service;

import com.ems.commonlib.entity.auth.User;

import java.util.Optional;

public interface UserService {

    User createUser(User user);

    User update(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    void sendResetCode(String email);
}
