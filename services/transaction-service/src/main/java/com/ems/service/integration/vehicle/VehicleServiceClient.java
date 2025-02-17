package com.ems.service.integration.vehicle;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.vehicle.Vehicle;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@FeignClient(name = "VEHICLE-SERVICE", fallback = VehicleServiceFallback.class)
public interface VehicleServiceClient {

    @CircuitBreaker(name = "VEHICLE-SERVICE")
    @GetMapping("/api/v1/vehicle/registration-number")
    ResponseEntity<AppResponse<Optional<Vehicle>>> getByVehicleNumber(@RequestParam("registrationNumber") String vehicleNumber);

    @CircuitBreaker(name = "VEHICLE-SERVICE")
    @GetMapping("/api/v1/vehicle/id/{id}")
    ResponseEntity<AppResponse<Optional<Vehicle>>> getById(@PathVariable("id") String id);


}
