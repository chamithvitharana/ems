package com.ems.accesspointservice.controller;

import com.ems.accesspointservice.service.AccessPointService;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/access-point")
public class AccessPointPublicController {

    private final AccessPointService accessPointService;

    public AccessPointPublicController(AccessPointService accessPointService) {
        this.accessPointService = accessPointService;
    }

    @GetMapping
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

}
