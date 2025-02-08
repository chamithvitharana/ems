package com.ems.service.integration.customer;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Component
public class CustomerServiceFallback implements CustomerServiceClient {

    @Override
    public ResponseEntity<AppResponse<Optional<Customer>>> getByNic(@PathVariable String nic) {
        AppResponse<Optional<Customer>> response = AppResponse.<Optional<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getByNic")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<Customer>>> getById(@PathVariable String id) {
        AppResponse<Optional<Customer>> response = AppResponse.<Optional<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getById")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<Customer>>> getByEmail(String username) {
        AppResponse<Optional<Customer>> response = AppResponse.<Optional<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getByEmail")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Page<Customer>>> getAll(Integer size, Integer page) {
        Page<Customer> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);

        AppResponse<Page<Customer>> response = AppResponse.<Page<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getAll")
                .data(emptyPage)
                .build();

        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<Customer>>> save(Customer customer) {
        AppResponse<Optional<Customer>> response = AppResponse.<Optional<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for save")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

    @Override
    public ResponseEntity<AppResponse<Optional<Customer>>> update(Customer customer) {
        AppResponse<Optional<Customer>> response = AppResponse.<Optional<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for save")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }
}
