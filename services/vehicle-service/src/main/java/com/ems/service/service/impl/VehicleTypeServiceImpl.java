package com.ems.service.service.impl;

import com.ems.commonlib.entity.vehicle.VehicleType;
import com.ems.service.repository.VehicleTypeRepository;
import com.ems.service.service.VehicleTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    public VehicleTypeServiceImpl(VehicleTypeRepository vehicleTypeRepository) {
        this.vehicleTypeRepository = vehicleTypeRepository;
    }

    @Override
    public List<VehicleType> getAll() {
        return vehicleTypeRepository.findAll();
    }
}
