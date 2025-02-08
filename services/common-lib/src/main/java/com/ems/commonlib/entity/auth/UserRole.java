package com.ems.commonlib.entity.auth;

import com.ems.commonlib.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity
@Table(name = "UserRole")
public class UserRole extends BaseEntity {

    private String name;

    @Enumerated(EnumType.STRING)
    private UserRoles code;

}
