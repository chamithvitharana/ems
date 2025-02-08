package com.ems.commonlib.dto.vehicle.response;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.customer.response.CustomerResponseDto;
import com.ems.commonlib.entity.vehicle.Brand;
import com.ems.commonlib.entity.vehicle.FuelType;
import com.ems.commonlib.entity.vehicle.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleResponseDto {

    private String registrationNumber;

    private String registeredYear;

    private String manufacturedYear;

    private String qrCode;

    private FuelType fuelType;

    private VehicleType vehicleType;

    private Brand brand;

    private Long customerId;

    private Status status;

    private CustomerResponseDto customer;

}
