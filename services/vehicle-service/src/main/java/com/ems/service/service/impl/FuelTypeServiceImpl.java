package com.ems.service.service.impl;

import com.ems.commonlib.entity.vehicle.FuelType;
import com.ems.service.repository.FuelTypeRepository;
import com.ems.service.service.FuelTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuelTypeServiceImpl implements FuelTypeService {

    private final FuelTypeRepository fuelTypeRepository;

    public FuelTypeServiceImpl(FuelTypeRepository fuelTypeRepository) {
        this.fuelTypeRepository = fuelTypeRepository;
    }

    @Override
    public List<FuelType> getAll() {
        return fuelTypeRepository.findAll();
    }

}
