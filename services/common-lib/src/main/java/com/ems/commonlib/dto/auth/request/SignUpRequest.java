package com.ems.commonlib.dto.auth.request;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.entity.auth.User;
import com.ems.commonlib.entity.auth.UserRole;
import com.ems.commonlib.entity.auth.UserRoles;
import com.ems.commonlib.entity.auth.UserStatuses;
import com.ems.commonlib.entity.customer.Customer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SignUpRequest {

    private String email;
    private String password;
    private String phoneNumber;
    private String name;
    private String nic;
    private String addressLine1;
    private String addressLine2;
    private LocalDateTime birthday;
    @JsonProperty("smsAlertEnabled")
    private boolean smsNotificationEnabled;
    @JsonProperty("emailAlertEnabled")
    private boolean emailNotificationEnabled;
    private String paymentId;
    private Long agentId;

    @JsonIgnore
    public User getUser() {
        return User.builder()
                .contactNumber(this.phoneNumber)
                .email(this.email)
                .password(this.password)
                .username(this.email)
                .agentId(this.agentId != null ? Long.valueOf(this.agentId): null)
                .role(UserRole.builder().code(UserRoles.CUSTOMER).build())
                .build();
    }

    @JsonIgnore
    public User getUser(UserRoles role) {
        return User.builder()
                .contactNumber(this.phoneNumber)
                .email(this.email)
                .password(this.password)
                .username(this.email)
                .status(UserStatuses.ACTIVE)
                .role(UserRole.builder().code(role).build())
                .build();
    }

    @JsonIgnore
    public Customer getCustomer(User user) {
        return Customer.builder()
                .contactNumber(this.phoneNumber)
                .email(this.email)
                .name(this.name)
                .addressLine1(this.addressLine1)
                .addressLine2(this.addressLine2)
                .birthday(this.birthday)
                .nic(this.nic)
                .userAccountsId(user.getId())
                .smsNotificationEnabled(this.smsNotificationEnabled)
                .emailNotificationEnabled(this.emailNotificationEnabled)
                .paymentId(this.paymentId)
                .status(Status.ACTIVE)
                .build();
    }
}
