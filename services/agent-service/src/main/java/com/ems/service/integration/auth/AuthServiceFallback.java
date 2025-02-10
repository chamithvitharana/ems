package com.ems.service.integration.auth;

import com.ems.commonlib.dto.auth.request.SignUpRequest;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Component
public class AuthServiceFallback implements AuthServiceClient {

    @Override
    public ResponseEntity<AppResponse<User>> signUp(@RequestBody SignUpRequest request) {
        AppResponse<User> response = AppResponse.<User>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getByNic")
                .data(null)
                .build();
        return ResponseEntity.status(503).body(response);
    }
}
