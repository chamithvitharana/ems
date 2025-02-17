package com.ems.service.integration.vehicle;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.vehicle.Vehicle;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class VehicleServiceFallback implements VehicleServiceClient {

    @Override
    public ResponseEntity<AppResponse<Optional<Vehicle>>> getByVehicleNumber(String vehicleNumber) {
        AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getByVehicleNumber")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<Vehicle>>> getById(@PathVariable String id) {
        AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getById")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }
}