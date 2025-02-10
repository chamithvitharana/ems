package com.ems.service.integration.accesspoint;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
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
}