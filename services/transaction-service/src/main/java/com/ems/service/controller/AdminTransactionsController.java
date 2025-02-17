package com.ems.service.controller;

import com.ems.commonlib.constant.TransactionStatus;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.transaction.Transaction;
import com.ems.commonlib.vo.LiveAccessPointCountVo;
import com.ems.service.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction/admin")
public class AdminTransactionsController {

    private final TransactionService transactionService;

    public AdminTransactionsController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Transaction>>> getList(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "customerEmail", required = false) String customerEmail,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Page<Transaction> transactions = transactionService.findPageBySearchKey(page, size, searchKey, customerEmail);
        AppResponse<Page<Transaction>> response = AppResponse.<Page<Transaction>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("list retrieved successfully")
                .data(transactions)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<AppResponse<Integer>> getCountByStatus(
            @RequestParam(value = "status", required = false, defaultValue = "ENTERED") TransactionStatus status
    ) {
        Integer count = transactionService.findCountByStatus(status);
        AppResponse<Integer> response = AppResponse.<Integer>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Data retrieved successfully")
                .data(count)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/live-count")
    public ResponseEntity<AppResponse<List<LiveAccessPointCountVo>>> getLiveCount(
    ) {
        List<LiveAccessPointCountVo> liveCount = transactionService.getLiveCount();
        AppResponse<List<LiveAccessPointCountVo>> response = AppResponse.<List<LiveAccessPointCountVo>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Data retrieved successfully")
                .data(liveCount)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/download")
    public ResponseEntity<byte[]> downloadCustomerPdf(
            @RequestParam("start") LocalDate start,
            @RequestParam("end") LocalDate end,
            @RequestParam(value = "vehicleNumber", required = false) String vehicleNumber
    ) {

        // Generate PDF report as ByteArrayInputStream
        ByteArrayInputStream pdfStream = transactionService.generateReport(start, end, vehicleNumber);

        // Convert InputStream to byte array
        byte[] pdfBytes = pdfStream.readAllBytes();

        // Set response headers for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);

    }
}
