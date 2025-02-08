package com.ems.commonlib.entity.agent;

import com.ems.commonlib.BaseEntity;
import com.ems.commonlib.constant.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Agents")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Agent extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "contact_number", length = 45)
    private String contactNumber;

    @Column(name = "email", length = 45)
    private String email;

    @Column(name = "UserAccounts_id")
    private Long userAccountsId;

    @Column(name = "access_point_id")
    private Long accessPointId;

    private String accessPointName;

    @Enumerated(EnumType.STRING)
    private Status status;

}
