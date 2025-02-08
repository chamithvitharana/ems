package com.ems.commonlib.dto.customer.response;

import com.ems.commonlib.constant.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponseDto {

    private String name;

    private String nic;

    private String addressLine1;

    private String addressLine2;

    private String contactNumber;

    private String email;

    private LocalDateTime birthday;

    private Long userAccountsId;


    private Boolean smsNotificationEnabled;

    private Boolean emailNotificationEnabled;

    private Status status;

}
