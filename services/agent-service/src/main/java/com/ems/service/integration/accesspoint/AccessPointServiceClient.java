package com.ems.service.integration.accesspoint;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@FeignClient(name = "ACCESS-POINT-SERVICE", fallback = AccessPointServiceFallback.class)
public interface AccessPointServiceClient {

    @CircuitBreaker(name = "ACCESS-POINT-SERVICE")
    @GetMapping("/api/v1/access-point/id")
    ResponseEntity<AppResponse<Optional<AccessPoint>>> getById(@RequestParam("id") Long id);


}
