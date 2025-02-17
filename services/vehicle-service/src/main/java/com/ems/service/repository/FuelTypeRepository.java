package com.ems.service.repository;

import com.ems.commonlib.entity.vehicle.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FuelTypeRepository extends JpaRepository<FuelType, Long> {
    Optional<FuelType> findByCode(String code);
}
