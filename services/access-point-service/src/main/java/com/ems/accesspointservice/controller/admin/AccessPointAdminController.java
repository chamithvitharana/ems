package com.ems.accesspointservice.controller.admin;

import com.ems.accesspointservice.service.AccessPointService;
import com.ems.commonlib.dto.accesspoint.request.AccessPointRequestDto;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/access-point/admin")
public class AccessPointAdminController {

    private final AccessPointService accessPointService;
    private final ModelMapper modelMapper;

    public AccessPointAdminController(AccessPointService accessPointService, ModelMapper modelMapper) {
        this.accessPointService = accessPointService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/code")
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

    @GetMapping("/{id}")
    public ResponseEntity<AppResponse<AccessPoint>> getById(@PathVariable("id") Long id) {
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

    @GetMapping
    public ResponseEntity<AppResponse<Page<AccessPoint>>> getList(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Page<AccessPoint> accessPoints = accessPointService.findPageBySearchKey(size, page, searchKey);
        AppResponse<Page<AccessPoint>> response = AppResponse.<Page<AccessPoint>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Customer list retrieved successfully")
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

        AccessPoint accessPoint = accessPointService.findById(accessPointRequestDto.getId()).get();
        accessPoint.setName(accessPointRequestDto.getName());
        accessPoint.setLon(accessPointRequestDto.getLon());
        accessPoint.setLat(accessPointRequestDto.getLat());
        accessPoint.setCode(accessPointRequestDto.getCode());
        accessPoint.setEmergencyAlertEmail(accessPointRequestDto.getEmergencyAlertEmail());
        accessPoint.setEmergencyAlertMobile(accessPointRequestDto.getEmergencyAlertMobile());

        Optional<AccessPoint> updatedAccessPoint = accessPointService.save(accessPoint);
        AppResponse<AccessPoint> response = AppResponse.<AccessPoint>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Access Point updated successfully")
                .data(updatedAccessPoint.orElse(null))
                .build();
        return ResponseEntity.ok(response);
    }
}
