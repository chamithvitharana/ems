package com.ems.service.integration.auth;

import com.ems.commonlib.dto.auth.request.SignUpRequest;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.auth.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AUTH-SERVICE", fallback = AuthServiceFallback.class)
public interface AuthServiceClient {

    @CircuitBreaker(name = "AUTH-SERVICE")
    @GetMapping("/api/v1/auth/agent/sign-up")
    ResponseEntity<AppResponse<User>> signUp(@RequestBody SignUpRequest request);


}
