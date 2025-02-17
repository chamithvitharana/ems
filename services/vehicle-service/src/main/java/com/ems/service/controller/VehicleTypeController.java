package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.vehicle.VehicleType;
import com.ems.service.service.VehicleTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicle/vehicle-types")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    public VehicleTypeController(VehicleTypeService vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
    }

    @GetMapping
    public ResponseEntity<AppResponse<List<VehicleType>>> getAll() {
        List<VehicleType> vehicleTypes = vehicleTypeService.getAll();
        AppResponse<List<VehicleType>> response = AppResponse.<List<VehicleType>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Vehicle types retrieved successfully")
                .data(vehicleTypes)
                .build();
        return ResponseEntity.ok(response);
    }
}
