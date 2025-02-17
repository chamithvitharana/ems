package com.ems.service.controller;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.dto.vehicle.request.VehicleRequestDto;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.vehicle.Vehicle;
import com.ems.service.integration.customer.CustomerServiceClient;
import com.ems.service.service.VehicleService;
import com.google.zxing.WriterException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;
    private final CustomerServiceClient customerServiceClient;
    private final ModelMapper modelMapper;

    public VehicleController(
            VehicleService vehicleService,
            @Qualifier("com.ems.service.integration.customer.CustomerServiceClient") CustomerServiceClient customerServiceClient,
            ModelMapper modelMapper
    ) {
        this.vehicleService = vehicleService;
        this.customerServiceClient = customerServiceClient;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/registration-number")
    public ResponseEntity<AppResponse<Optional<Vehicle>>> get(
            @RequestParam("registrationNumber") String registrationNumber
    ) {
        Optional<Vehicle> vehicle = vehicleService.findByRegistrationNumber(registrationNumber);

        if (vehicle.isPresent()) {
            AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Vehicle retrieved successfully")
                    .data(vehicle)
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicle not found")
                    .data(Optional.empty())
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<AppResponse<Optional<Vehicle>>> get(
            @PathVariable("id") Long id
    ) {
        Optional<Vehicle> vehicle = vehicleService.findById(id);

        if (vehicle.isPresent()) {
            AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Vehicle retrieved successfully")
                    .data(vehicle)
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Optional<Vehicle>> response = AppResponse.<Optional<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicle not found")
                    .data(Optional.empty())
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Vehicle>>> get(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam("email") String email,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Optional<Customer> customer = customerServiceClient.getByEmail(email).getBody().getData();
        if (customer.isPresent()) {
            Page<Vehicle> vehicles = vehicleService.findVehiclesByRegistrationNumberLikeIgnoreCaseAndCustomerId(size, page, searchKey, customer.get().getId());
            AppResponse<Page<Vehicle>> response = AppResponse.<Page<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Vehicles retrieved successfully")
                    .data(vehicles)
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Page<Vehicle>> response = AppResponse.<Page<Vehicle>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicles not found")
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<AppResponse<Vehicle>> save(@RequestBody VehicleRequestDto requestDto) throws IOException, WriterException {
        Vehicle vehicle = modelMapper.map(requestDto, Vehicle.class);
        vehicle.setStatus(Status.ACTIVE);
        if (vehicleService.findByRegistrationNumber(vehicle.getRegistrationNumber()).isPresent()) {
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(400)
                    .message("Vehicle with this registration number already exists")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        ResponseEntity<AppResponse<Optional<Customer>>> customerResponse = customerServiceClient.getByEmail(requestDto.getCustomerEmail());
        Optional<Customer> customer = customerResponse.getBody().getData();

        if (customer.isPresent()) {
            vehicle.setCustomerId(customer.get().getId());
            vehicle.setCustomerNIC(customer.get().getNic());
            Optional<Vehicle> savedVehicle = vehicleService.save(vehicle, customer.get());
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(201)
                    .message("Vehicle saved successfully")
                    .data(savedVehicle.orElse(null))
                    .build();
            return ResponseEntity.status(201).body(response);
        } else {
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicle not found")
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping
    public ResponseEntity<AppResponse<Vehicle>> update(@RequestBody VehicleRequestDto requestDto) throws IOException, WriterException {
        Vehicle vehicle = modelMapper.map(requestDto, Vehicle.class);

        Optional<Vehicle> existingVehicle = vehicleService.findByRegistrationNumber(vehicle.getRegistrationNumber());
        if (existingVehicle.isPresent() && !existingVehicle.get().getId().equals(requestDto.getId())) {
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(400)
                    .message("Vehicle with this registration number already exists")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        ResponseEntity<AppResponse<Optional<Customer>>> customerResponse = customerServiceClient.getByEmail(requestDto.getCustomerEmail());
        Optional<Customer> customer = customerResponse.getBody().getData();

        if (customer.isPresent()) {
            vehicle.setCustomerId(customer.get().getId());
            vehicle.setCustomerNIC(customer.get().getNic());
            Optional<Vehicle> updatedVehicle = vehicleService.save(vehicle, customer.get());
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Vehicle updated successfully")
                    .data(updatedVehicle.orElse(null))
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicle not found")
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AppResponse<Boolean>> delete(@PathVariable("id") Long id) {
        vehicleService.delete(id);
        AppResponse<Boolean> response = AppResponse.<Boolean>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Vehicle deleted successfully")
                .data(Boolean.TRUE)
                .build();
        return ResponseEntity.ok(response);
    }
}
