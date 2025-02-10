package com.ems.service.integration;

import com.ems.commonlib.entity.customer.Customer;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRANSACTION-SERVICE", fallback = NotificationServiceFallback.class)
public interface TransactionServiceClient {

    @CircuitBreaker(name = "TRANSACTION-SERVICE")
    @PostMapping("/api/v1/transaction/payment-config")
    ResponseEntity<String> paymentConfig(@RequestBody Customer customer);


}
