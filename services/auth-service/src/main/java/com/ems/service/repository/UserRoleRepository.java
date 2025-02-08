package com.ems.service.repository;

import com.ems.commonlib.entity.auth.UserRole;
import com.ems.commonlib.entity.auth.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByName(String roleName);

    Optional<UserRole> findByCode(UserRoles code);

}
