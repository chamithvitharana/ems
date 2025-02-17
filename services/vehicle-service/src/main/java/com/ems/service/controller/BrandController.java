package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.vehicle.Brand;
import com.ems.service.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicle/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<AppResponse<List<Brand>>> getAll() {
        List<Brand> brands = brandService.getAll();
        AppResponse<List<Brand>> response = AppResponse.<List<Brand>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Brands retrieved successfully")
                .data(brands)
                .build();
        return ResponseEntity.ok(response);
    }
}
