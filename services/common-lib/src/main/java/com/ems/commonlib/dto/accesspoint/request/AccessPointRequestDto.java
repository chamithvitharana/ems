package com.ems.commonlib.dto.accesspoint.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccessPointRequestDto {

    private Long id;

    private String name;

    private Double lon;

    private Double lat;

    private String code;

    private String emergencyAlertEmail;

    private String emergencyAlertMobile;

}
