package com.ems.service.config;

import com.ems.commonlib.entity.vehicle.Brand;
import com.ems.commonlib.entity.vehicle.FuelType;
import com.ems.commonlib.entity.vehicle.VehicleType;
import com.ems.service.repository.BrandRepository;
import com.ems.service.repository.FuelTypeRepository;
import com.ems.service.repository.VehicleTypeRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MasterDataRunner {

    private final FuelTypeRepository fuelTypeRepository;

    private final VehicleTypeRepository vehicleTypeRepository;

    private final BrandRepository brandRepository;

    public MasterDataRunner(FuelTypeRepository fuelTypeRepository, VehicleTypeRepository vehicleTypeRepository, BrandRepository brandRepository) {
        this.fuelTypeRepository = fuelTypeRepository;
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.brandRepository = brandRepository;
    }

    @Bean
    public ApplicationRunner loadMasterData() {
        return args -> {
            insertVehicleTypes();
            insertFuelTypes();
            insertBrands();
        };
    }

    private void insertVehicleTypes() {
        insertVehicleTypeIfNotExists("Car-van", "Car-van (4 wheels 2 Axles)");
        insertVehicleTypeIfNotExists("Bus", "Bus (6 wheels 2 Axles)");
        insertVehicleTypeIfNotExists("Heavy Duty", "Heavy Duty (More than 2 Axles)");
    }

    private void insertVehicleTypeIfNotExists(String code, String name) {
        Optional<VehicleType> vehicleTypeOptional = vehicleTypeRepository.findByCode(code);
        if (vehicleTypeOptional.isEmpty()) {
            VehicleType newVehicleType = VehicleType.builder()
                    .code(code)
                    .name(name)
                    .build();
            vehicleTypeRepository.save(newVehicleType);
        }
    }

    private void insertFuelTypes() {
        insertFuelTypeIfNotExists("Petrol", "Petrol");
        insertFuelTypeIfNotExists("Diesel", "Diesel");
        insertFuelTypeIfNotExists("Electric", "Electric");
        insertFuelTypeIfNotExists("Hybrid", "Hybrid");
    }

    private void insertFuelTypeIfNotExists(String code, String name) {
        Optional<FuelType> fuelTypeOptional = fuelTypeRepository.findByCode(code);
        if (fuelTypeOptional.isEmpty()) {
            FuelType newFuelType = FuelType.builder()
                    .code(code)
                    .name(name)
                    .build();
            fuelTypeRepository.save(newFuelType);
        }
    }

    private void insertBrands() {
        insertBrandIfNotExists("Toyota");
        insertBrandIfNotExists("Honda");
        insertBrandIfNotExists("Ford");
        insertBrandIfNotExists("BMW");
        insertBrandIfNotExists("Tesla");
        insertBrandIfNotExists("Chevrolet");
        insertBrandIfNotExists("Hyundai");
        insertBrandIfNotExists("Nissan");
        insertBrandIfNotExists("Other");
    }

    private void insertBrandIfNotExists(String name) {
        Optional<Brand> brandOptional = brandRepository.findByName(name);
        if (brandOptional.isEmpty()) {
            Brand newBrand = Brand.builder()
                    .name(name)
                    .code(name)
                    .build();
            brandRepository.save(newBrand);
        }
    }
}
