package com.ems.accesspointservice.controller;

import com.ems.accesspointservice.service.AccessPointService;
import com.ems.commonlib.dto.accesspoint.request.AccessPointRequestDto;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/access-point")
public class AccessPointController {

    private final AccessPointService accessPointService;
    private final ModelMapper modelMapper;

    public AccessPointController(AccessPointService accessPointService, ModelMapper modelMapper) {
        this.accessPointService = accessPointService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<AppResponse<AccessPoint>> getByCode(@RequestParam("code") String code) {
        Optional<AccessPoint> accessPoint = accessPointService.findByCode(code);
        AppResponse<AccessPoint> response = null;

        if (accessPoint.isPresent()) {
            response = AppResponse.<AccessPoint>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Access Point found successfully")
                    .data(accessPoint.get())
                    .build();
        } else {
            response = AppResponse.<AccessPoint>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("not found")
                    .build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/id")
    public ResponseEntity<AppResponse<AccessPoint>> getById(@RequestParam("id") Long id) {
        Optional<AccessPoint> accessPoint = accessPointService.findById(id);
        AppResponse<AccessPoint> response = null;

        if (accessPoint.isPresent()) {
            response = AppResponse.<AccessPoint>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Access Point found successfully")
                    .data(accessPoint.get())
                    .build();
        } else {
            response = AppResponse.<AccessPoint>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("not found")
                    .build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<AppResponse<List<AccessPoint>>> getAll() {
        List<AccessPoint> accessPoints = accessPointService.findAll();
        AppResponse<List<AccessPoint>> response = AppResponse.<List<AccessPoint>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("All access points retrieved successfully")
                .data(accessPoints)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AppResponse<AccessPoint>> save(@RequestBody AccessPointRequestDto accessPointRequestDto) {
        AccessPoint accessPoint = modelMapper.map(accessPointRequestDto, AccessPoint.class);
        Optional<AccessPoint> savedAccessPoint = accessPointService.save(accessPoint);
        AppResponse<AccessPoint> response = AppResponse.<AccessPoint>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(201)
                .message("Access Point saved successfully")
                .data(savedAccessPoint.orElse(null))
                .build();
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping
    public ResponseEntity<AppResponse<AccessPoint>> update(@RequestBody AccessPointRequestDto accessPointRequestDto) {
        AccessPoint accessPoint = modelMapper.map(accessPointRequestDto, AccessPoint.class);
        Optional<AccessPoint> updatedAccessPoint = accessPointService.save(accessPoint);
        AppResponse<AccessPoint> response = AppResponse.<AccessPoint>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Access Point updated successfully")
                .data(updatedAccessPoint.orElse(null))
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearest")
    public ResponseEntity<AppResponse<AccessPoint>> getNearestAccessPoint(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        AccessPoint nearest = accessPointService.getNearestAccessPoint(lat, lon);
        AppResponse<AccessPoint> response = AppResponse.<AccessPoint>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Access Point updated successfully")
                .data(nearest)
                .build();
        return ResponseEntity.ok(response);
    }
}
