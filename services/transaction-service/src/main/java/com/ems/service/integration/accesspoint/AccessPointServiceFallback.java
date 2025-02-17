package com.ems.service.integration.accesspoint;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class AccessPointServiceFallback implements AccessPointServiceClient {

    @Override
    public ResponseEntity<AppResponse<Optional<AccessPoint>>> getById(Long id) {
        AppResponse<Optional<AccessPoint>> response = AppResponse.<Optional<AccessPoint>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getById")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<AccessPoint>>> getByNearest(Double lat, Double lon) {
        AppResponse<Optional<AccessPoint>> response = AppResponse.<Optional<AccessPoint>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getByNearest")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<List<AccessPoint>>> getAll() {
        AppResponse<List<AccessPoint>> response = AppResponse.<List<AccessPoint>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getAll")
                .data(Collections.emptyList())
                .build();
        return ResponseEntity.status(503).body(response);
    }
}