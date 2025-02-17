package com.ems.service.controller.admin;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.customer.response.CustomerResponseDto;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.dto.vehicle.response.VehicleResponseDto;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.vehicle.Vehicle;
import com.ems.service.integration.customer.CustomerServiceClient;
import com.ems.service.service.VehicleService;
import com.google.zxing.WriterException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/vehicle/admin")
public class VehicleAdminController {

    private final VehicleService vehicleService;

    private final CustomerServiceClient customerServiceClient;

    private final ModelMapper modelMapper;

    public VehicleAdminController(
            VehicleService vehicleService,
            @Qualifier("com.ems.service.integration.customer.CustomerServiceClient") CustomerServiceClient customerServiceClient, ModelMapper modelMapper) {
        this.vehicleService = vehicleService;
        this.customerServiceClient = customerServiceClient;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Vehicle>>> get(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {

        Page<Vehicle> vehicles = vehicleService.findVehiclesByRegistrationNumberLikeIgnoreCase(size, page, searchKey);

        AppResponse<Page<Vehicle>> response = AppResponse.<Page<Vehicle>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Vehicles retrieved successfully")
                .data(vehicles)
                .build();

        return ResponseEntity.ok(response);

    }

    @GetMapping("/{id}")
    public ResponseEntity<AppResponse<Optional<VehicleResponseDto>>> getById(
            @PathVariable("id") Long id
    ) {
        Optional<Vehicle> vehicle = vehicleService.findById(id);

        if (vehicle.isPresent()) {

            ResponseEntity<AppResponse<Optional<Customer>>> customer = customerServiceClient.getById(String.valueOf(vehicle.get().getCustomerId()));

            VehicleResponseDto vehicleResponseDto = modelMapper.map(vehicle.get(), VehicleResponseDto.class);

            if (Objects.requireNonNull(customer.getBody()).getData().isPresent()) {
                CustomerResponseDto customerResponseDto = modelMapper.map(Objects.requireNonNull(customer.getBody()).getData().get(), CustomerResponseDto.class);
                vehicleResponseDto.setCustomer(customerResponseDto);
            }

            AppResponse<Optional<VehicleResponseDto>> response = AppResponse.<Optional<VehicleResponseDto>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Vehicle retrieved successfully")
                    .data(Optional.ofNullable(vehicleResponseDto))
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Optional<VehicleResponseDto>> response = AppResponse.<Optional<VehicleResponseDto>>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Vehicle not found")
                    .data(Optional.empty())
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppResponse<Vehicle>> updateStatus(
            @RequestParam("isActive") Boolean isActive,
            @PathVariable("id") Long id
    ) throws IOException, WriterException {


        Optional<Vehicle> existingVehicle = vehicleService.findById(id);

        if (!existingVehicle.isPresent()) {
            AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(400)
                    .message("Vehicle with this registration number not available")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        existingVehicle.get().setStatus(isActive ? Status.ACTIVE : Status.INACTIVE);

        Optional<Vehicle> updatedVehicle = vehicleService.update(existingVehicle.get());
        AppResponse<Vehicle> response = AppResponse.<Vehicle>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Vehicle updated successfully")
                .data(updatedVehicle.orElse(null))
                .build();
        return ResponseEntity.ok(response);
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

    @GetMapping("/report/download")
    public ResponseEntity<byte[]> downloadCustomerPdf() {

        // Generate PDF report as ByteArrayInputStream
        ByteArrayInputStream pdfStream = vehicleService.generateReport();

        // Convert InputStream to byte array
        byte[] pdfBytes = pdfStream.readAllBytes();

        // Set response headers for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "customer-report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);

    }
}
