package com.ems.commonlib.dto.vehicle.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleTypeRequestDto {

    private Long id;

    private String code;

    private String name;

}
