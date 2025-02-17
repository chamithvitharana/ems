package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.transaction.Fare;
import com.ems.service.service.FareService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/public/transaction/fare")
public class PublicFareController {

    private final FareService fareService;

    public PublicFareController(FareService fareService) {
        this.fareService = fareService;
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
