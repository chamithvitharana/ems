package com.ems.service.controller;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.service.dto.customer.request.CustomerRequestDto;
import com.ems.service.integration.TransactionServiceClient;
import com.ems.service.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final ModelMapper modelMapper;

    private final TransactionServiceClient transactionServiceClient;

    public CustomerController(CustomerService customerService, ModelMapper modelMapper, TransactionServiceClient transactionServiceClient) {
        this.customerService = customerService;
        this.modelMapper = modelMapper;
        this.transactionServiceClient = transactionServiceClient;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<AppResponse<Customer>> getById(@PathVariable("id") Long id) {
        Optional<Customer> customer = customerService.findById(id);
        if (customer.isPresent()) {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Customer retrieved successfully")
                    .data(customer.get())
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Customer not found")
                    .build();
            return ResponseEntity.ok().body(response);
        }
    }

    @GetMapping("/nic/{nic}")
    public ResponseEntity<AppResponse<Customer>> getByNic(@PathVariable("nic") String nic) {
        Optional<Customer> customer = customerService.findByNic(nic);
        if (customer.isPresent()) {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Customer retrieved successfully by NIC")
                    .data(customer.get())
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Customer not found by NIC")
                    .build();
            return ResponseEntity.ok().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<AppResponse<Customer>> getByEmail(@RequestParam("email") String email) {
        Optional<Customer> customer = customerService.findByEmail(email);
        if (customer.isPresent()) {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Customer retrieved successfully by email")
                    .data(customer.get())
                    .build();
            return ResponseEntity.ok(response);
        } else {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Customer not found by email")
                    .build();
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<AppResponse<Page<Customer>>> getAll(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page
    ) {
        Page<Customer> customers = customerService.findPage(size, page);
        AppResponse<Page<Customer>> response = AppResponse.<Page<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("All customers retrieved successfully")
                .data(customers)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<AppResponse<Page<Customer>>> getList(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Page<Customer> customers = customerService.findPageBySearchKey(size, page, searchKey);
        AppResponse<Page<Customer>> response = AppResponse.<Page<Customer>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Customer list retrieved successfully")
                .data(customers)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AppResponse<Customer>> save(@RequestBody CustomerRequestDto customerRequestDto) {
        Customer customer = modelMapper.map(customerRequestDto, Customer.class);

        try {

           if("paymentId".equalsIgnoreCase(customerRequestDto.getPaymentId())) {
               customerRequestDto.setPaymentId(null);
           }

            if(customerRequestDto.getPaymentId() != null) {
                ResponseEntity<String> stringResponseEntity = transactionServiceClient.paymentConfig(customer);
                customer.setCustomerId(stringResponseEntity.getBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        Customer savedCustomer = customerService.save(customer);
        AppResponse<Customer> response = AppResponse.<Customer>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(201)
                .message("Customer saved successfully")
                .data(savedCustomer)
                .build();
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping
    public ResponseEntity<AppResponse<Customer>> update(@RequestBody CustomerRequestDto customerRequestDto) {

        Optional<Customer> optionalCustomer = customerService.findById(Long.valueOf(customerRequestDto.getId()));
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    AppResponse.<Customer>builder()
                            .localDateTime(LocalDateTime.now())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("Customer not found")
                            .build()
            );
        }

        Customer customer = optionalCustomer.get();

        // Update the fields of the customer entity
        customer.setName(customerRequestDto.getName());
        customer.setAddressLine1(customerRequestDto.getAddressLine1());
        customer.setAddressLine2(customerRequestDto.getAddressLine2());
        customer.setContactNumber(customerRequestDto.getContactNumber());
        customer.setSmsNotificationEnabled(customerRequestDto.getSmsNotificationEnabled());
        customer.setEmailNotificationEnabled(customerRequestDto.getEmailNotificationEnabled());
        customer.setPaymentId(customerRequestDto.getPaymentId());

        // Save the updated customer
        Customer updatedCustomer = customerService.save(customer);

        // Build the response
        AppResponse<Customer> response = AppResponse.<Customer>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .message("Customer updated successfully")
                .data(updatedCustomer)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppResponse<Customer>> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("isActive") Boolean isActive) {

        Optional<Customer> optionalCustomer = customerService.findById(id);
        if (optionalCustomer.isEmpty()) {
            AppResponse<Customer> response = AppResponse.<Customer>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Customer not found")
                    .build();
            return ResponseEntity.ok().body(response);
        }

        Customer customer = optionalCustomer.get();
        customer.setStatus(Status.ACTIVE);

        Customer updatedCustomer = customerService.save(customer);

        AppResponse<Customer> response = AppResponse.<Customer>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Customer status updated successfully")
                .data(updatedCustomer)
                .build();

        return ResponseEntity.ok(response);
    }
}
