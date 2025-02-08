package com.ems.commonlib.dto.vehicle.request;

import com.ems.commonlib.entity.vehicle.Brand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleRequestDto {

    private Long id;

    private String registrationNumber;

    private String registeredYear;

    private String manufacturedYear;

    private FuelTypeRequestDto fuelType;

    private VehicleTypeRequestDto vehicleType;

    private Brand brand;

    private String customerEmail;

}
