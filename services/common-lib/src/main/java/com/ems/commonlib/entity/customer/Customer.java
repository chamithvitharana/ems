package com.ems.commonlib.entity.customer;

import com.ems.commonlib.BaseEntity;
import com.ems.commonlib.constant.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer extends BaseEntity {

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "nic", length = 20)
    private String nic;

    @Column(name = "address_line_1", columnDefinition = "TEXT")
    private String addressLine1;

    @Column(name = "address_line_2", columnDefinition = "TEXT")
    private String addressLine2;

    @Column(name = "contact_number", length = 45)
    private String contactNumber;

    @Column(name = "email", length = 45)
    private String email;

    @Column(name = "birth_day")
    private LocalDateTime birthday;

    @Column(name = "UserAccounts_id")
    private Long userAccountsId;

    private Boolean smsNotificationEnabled = false;

    private Boolean emailNotificationEnabled = false;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String paymentId;

    private String customerId;

}
