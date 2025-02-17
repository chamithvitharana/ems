package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.vehicle.FuelType;
import com.ems.service.service.FuelTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicle/fuel-types")
public class FuelTypeController {

    private final FuelTypeService fuelTypeService;

    public FuelTypeController(FuelTypeService fuelTypeService) {
        this.fuelTypeService = fuelTypeService;
    }

    @GetMapping
    public ResponseEntity<AppResponse<List<FuelType>>> getAll() {
        List<FuelType> fuelTypes = fuelTypeService.getAll();
        AppResponse<List<FuelType>> response = AppResponse.<List<FuelType>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Fuel types retrieved successfully")
                .data(fuelTypes)
                .build();
        return ResponseEntity.ok(response);
    }
}
