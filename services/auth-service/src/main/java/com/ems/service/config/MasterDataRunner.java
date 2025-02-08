package com.ems.service.config;

import com.ems.commonlib.entity.auth.User;
import com.ems.commonlib.entity.auth.UserRole;
import com.ems.commonlib.entity.auth.UserRoles;
import com.ems.service.repository.UserRoleRepository;
import com.ems.service.service.UserService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MasterDataRunner {

    private final UserRoleRepository userRoleRepository;

    private final UserService userService;

    public MasterDataRunner(UserRoleRepository userRoleRepository, UserService userService) {
        this.userRoleRepository = userRoleRepository;
        this.userService = userService;
    }

    @Bean
    public ApplicationRunner loadMasterData() {
        return args -> {
            insertRole();
            insertAdminUser();
        };
    }

    private void insertRole() {
        insertRoleIfNotExist(UserRoles.ADMIN, "ADMIN");
        insertRoleIfNotExist(UserRoles.CUSTOMER, "CUSTOMER");
        insertRoleIfNotExist(UserRoles.AGENT, "AGENT");
    }

    private void insertRoleIfNotExist(UserRoles code, String name) {
        Optional<UserRole> role = userRoleRepository.findByCode(code);
        if (role.isEmpty()) {
            UserRole newRole = UserRole.builder()
                    .code(code)
                    .name(name)
                    .build();
            userRoleRepository.save(newRole);
        }
    }

    private void insertAdminUser() {
        if(userService.findByEmail("admin@gmail.com").isEmpty()) {
            userService.createUser(User.builder()
                    .contactNumber(null)
                    .email("admin@gmail.com")
                    .password("12345678")
                    .username("admin@gmail.com")
                    .role(UserRole.builder().code(UserRoles.ADMIN).build())
                    .build());
        }
    }

}
