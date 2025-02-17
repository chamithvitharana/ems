package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.transaction.Fare;
import com.ems.service.service.FareService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/transaction/fare/admin")
public class AdminFareController {

    private final FareService fareService;

    public AdminFareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/upload")
    public ResponseEntity<AppResponse<String>> uploadFareSheet(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category)
    {
        AppResponse<String> appResponse = new AppResponse<>();

        try {
            fareService.processFareSheet(file, category);
            appResponse.setStatusCode(200);
            appResponse.setLocalDateTime(LocalDateTime.now());
            appResponse.setMessage("Success");
            appResponse.setData("Fare sheet uploaded and processed successfully");
            return ResponseEntity.ok(appResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(appResponse);
        }
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Fare>>> get(
            @RequestParam(value = "source", required = false) String source,
            @RequestParam(value = "destination", required = false) String destination,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        AppResponse<Page<Fare>> appResponse = new AppResponse<>();

        Pageable pageable = PageRequest.of(page, size);
        Page<Fare> fares = fareService.getFaresWithFilters(source, destination, category, pageable);

        appResponse.setMessage("success");
        appResponse.setLocalDateTime(LocalDateTime.now());
        appResponse.setData(fares);
        appResponse.setStatusCode(200);

        return ResponseEntity.ok(appResponse);
    }
}
