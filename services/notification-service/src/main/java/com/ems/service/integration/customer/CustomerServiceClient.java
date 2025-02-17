package com.ems.service.integration.customer;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.customer.Customer;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@FeignClient(name = "CUSTOMER-SERVICE", fallback = CustomerServiceFallback.class)
public interface CustomerServiceClient {

    @CircuitBreaker(name = "CUSTOMER-SERVICE")
    @GetMapping("/api/v1/customer/nic/{nic}")
    ResponseEntity<AppResponse<Optional<Customer>>> getByNic(@PathVariable("nic") String nic);

    @CircuitBreaker(name = "CUSTOMER-SERVICE")
    @GetMapping("/api/v1/customer/id/{id}")
    ResponseEntity<AppResponse<Optional<Customer>>> getById(@PathVariable("id") String id);

    @CircuitBreaker(name = "CUSTOMER-SERVICE")
    @GetMapping("/api/v1/customer")
    ResponseEntity<AppResponse<Optional<Customer>>> getByEmail(@RequestParam("email") String email);

    @CircuitBreaker(name = "CUSTOMER-SERVICE")
    @GetMapping("/api/v1/customer/all")
    ResponseEntity<AppResponse<Page<Customer>>> getAll(@RequestParam("size") Integer size, @RequestParam("page") Integer page);

    @CircuitBreaker(name = "CUSTOMER-SERVICE")
    @PostMapping("/api/v1/customer")
    ResponseEntity<AppResponse<Optional<Customer>>> save(@RequestBody Customer customer);

}
