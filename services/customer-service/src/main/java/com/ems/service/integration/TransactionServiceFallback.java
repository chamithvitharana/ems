package com.ems.service.integration;

import com.ems.commonlib.entity.customer.Customer;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class TransactionServiceFallback implements TransactionServiceClient {

    @Override
    public ResponseEntity<String> paymentConfig(Customer customer) {
        return null;
    }
}
