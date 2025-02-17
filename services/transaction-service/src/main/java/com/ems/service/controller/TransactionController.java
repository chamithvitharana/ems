package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.transaction.Transaction;
import com.ems.commonlib.vo.TransactionVo;
import com.ems.service.service.TransactionService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    @Value("${stripe.api.secretKey}")
    private String stripeApiKey;

    public TransactionController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/vehicle-number")
    public ResponseEntity<AppResponse<?>> manage(
            @RequestParam("vehicleNumber") String vehicleNumber
    ) {
        AppResponse<TransactionVo> appResponse = new AppResponse<>();

        Optional<TransactionVo> transaction = transactionService.get(vehicleNumber);

        if(transaction.isPresent()) {
            appResponse.setMessage("success");
            appResponse.setLocalDateTime(LocalDateTime.now());
            appResponse.setData(transaction.get());
            appResponse.setStatusCode(200);
        } else {
            appResponse.setMessage("not found");
            appResponse.setLocalDateTime(LocalDateTime.now());
            appResponse.setStatusCode(404);
        }

        return ResponseEntity.ok(appResponse);
    }

    @PostMapping
    public ResponseEntity<AppResponse<?>> manage(
            @RequestParam("vehicleNumber") String vehicleNumber,
            @RequestParam(value = "accessPointId") Long accessPointId
    ) {
        AppResponse<Transaction> appResponse = new AppResponse<>();

        Transaction transaction = transactionService.transactionManage(vehicleNumber, accessPointId);

        appResponse.setMessage("success");
        appResponse.setLocalDateTime(LocalDateTime.now());
        appResponse.setData(transaction);
        appResponse.setStatusCode(200);

        return ResponseEntity.ok(appResponse);
    }

    @PostMapping("/manual/complete/{id}")
    public ResponseEntity<AppResponse<?>> manualComplete(
            @PathVariable String id) {
        AppResponse<Transaction> appResponse = new AppResponse<>();

        Transaction transaction = transactionService.manualComplete(id);

        appResponse.setMessage("success");
        appResponse.setLocalDateTime(LocalDateTime.now());
        appResponse.setData(transaction);
        appResponse.setStatusCode(200);

        return ResponseEntity.ok(appResponse);
    }

    @PostMapping("/payment-config")
    public ResponseEntity<String> paymentConfig(
            @RequestBody com.ems.commonlib.entity.customer.Customer customer) throws StripeException {
        com.stripe.Stripe.apiKey = stripeApiKey;
        // Example in Java (adjust according to your server-side language)
        CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setEmail(customer.getEmail())
                .setName(customer.getName())
                // Include additional fields as needed
                .build();
        Customer stripe = Customer.create(customerParams);
        String customerId = stripe.getId();

        return ResponseEntity.ok(customerId);
    }

    @PostMapping("/breakdown")
    public ResponseEntity<AppResponse<?>> breakdown(
            @RequestParam("vehicleNumber") String vehicleNumber,
            @RequestParam("description") String description,
            @RequestParam("lon") Double lon,
            @RequestParam("lat") Double lat
    ) {
        AppResponse<Transaction> appResponse = new AppResponse<>();

        Optional<TransactionVo> transaction = transactionService.get(vehicleNumber);

        if(transaction.isEmpty()) {
            appResponse.setMessage("Transaction is not found");
            appResponse.setLocalDateTime(LocalDateTime.now());
            appResponse.setStatusCode(404);
            return ResponseEntity.ok(appResponse);
        }

        transactionService.breakdown(vehicleNumber, description, lon, lat);

        appResponse.setMessage("success");
        appResponse.setLocalDateTime(LocalDateTime.now());
        appResponse.setStatusCode(200);
        return ResponseEntity.ok(appResponse);
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Transaction>>> getList(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "email", required = false) String customerEmail,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Page<Transaction> transactions = transactionService.findPageBySearchKey(page, size, searchKey, customerEmail);
        AppResponse<Page<Transaction>> response = AppResponse.<Page<Transaction>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Customer list retrieved successfully")
                .data(transactions)
                .build();
        return ResponseEntity.ok(response);
    }

}
