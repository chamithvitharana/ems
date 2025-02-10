package com.ems.service.dto.customer.request;

import com.ems.commonlib.constant.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequestDto {

    private Integer id;

    private String name;

    private String nic;

    private String addressLine1;

    private String addressLine2;

    private String contactNumber;

    private String email;

    private LocalDateTime updatedTime;

    private String updatedBy;

    private LocalDateTime createdTime;

    private String createdBy;

    private Integer userAccountsId;

    private Status status;

    private Boolean smsNotificationEnabled;

    private Boolean emailNotificationEnabled;

    private String paymentId;

}
