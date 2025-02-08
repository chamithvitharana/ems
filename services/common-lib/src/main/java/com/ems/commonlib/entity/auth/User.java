package com.ems.commonlib.entity.auth;

import com.ems.commonlib.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Users")
public class User extends BaseEntity {

    private String username;

    private String password;

    private String email;

    private Long customerId;

    private Long agentId;

    @Enumerated(EnumType.STRING)
    private UserStatuses status;

    @Column(name = "contact_number")
    private String contactNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private UserRole role;

    private String resetCode;

    private LocalDateTime resetCodeExpiration;

}
