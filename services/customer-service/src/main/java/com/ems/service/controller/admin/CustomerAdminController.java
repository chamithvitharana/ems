package com.ems.service.controller.admin;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.service.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/customer/admin")
public class CustomerAdminController {

    private final CustomerService customerService;
    private final ModelMapper modelMapper;

    public CustomerAdminController(CustomerService customerService, ModelMapper modelMapper) {
        this.customerService = customerService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/{id}")
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

    @GetMapping
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

    @PatchMapping("/{id}")
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
        customer.setStatus(isActive ? Status.ACTIVE : Status.INACTIVE);

        Customer updatedCustomer = customerService.save(customer);

        AppResponse<Customer> response = AppResponse.<Customer>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Customer status updated successfully")
                .data(updatedCustomer)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/download")
    public ResponseEntity<byte[]> downloadCustomerPdf() {

        // Generate PDF report as ByteArrayInputStream
        ByteArrayInputStream pdfStream = customerService.generateCustomerReport();

        // Convert InputStream to byte array
        byte[] pdfBytes = pdfStream.readAllBytes();

        // Set response headers for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "customer-report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);

    }

}
