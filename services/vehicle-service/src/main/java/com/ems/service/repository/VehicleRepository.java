package com.ems.service.repository;

import com.ems.commonlib.entity.vehicle.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Page<Vehicle> findVehiclesByRegistrationNumberLikeIgnoreCaseAndCustomerId(Pageable pageable, String searchKey, Long customerId);

    Page<Vehicle> findAllByCustomerId(Pageable pageable, Long customerId);

    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);

    @Query("SELECT v FROM Vehicle v WHERE " +
            "LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
            "LOWER(v.customerNIC) LIKE LOWER(CONCAT('%', :searchKey, '%'))")
    Page<Vehicle> findVehiclesByRegistrationNumberOrCustomerNICLikeIgnoreCase(Pageable pageable, @Param("searchKey") String searchKey);

}
