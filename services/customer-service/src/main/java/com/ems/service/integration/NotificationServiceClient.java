package com.ems.service.integration;

import com.ems.commonlib.vo.NotificationVo;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE", fallback = NotificationServiceFallback.class)
public interface NotificationServiceClient {

    @CircuitBreaker(name = "NOTIFICATION-SERVICE")
    @PostMapping("/api/v1/notification")
    ResponseEntity<Boolean> sendEmail(@RequestBody NotificationVo notificationVo);


}
