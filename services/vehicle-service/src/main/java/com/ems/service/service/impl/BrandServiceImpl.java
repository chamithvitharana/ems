package com.ems.service.service.impl;

import com.ems.commonlib.entity.vehicle.Brand;
import com.ems.service.repository.BrandRepository;
import com.ems.service.service.BrandService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public List<Brand> getAll() {
        return brandRepository.findAll();
    }
}
