package com.ems.service.service;

import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.vehicle.Vehicle;
import com.google.zxing.WriterException;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

public interface VehicleService {

    Optional<Vehicle> save(Vehicle vehicle, Customer customer) throws IOException, WriterException;

    Optional<Vehicle> update(Vehicle vehicle) throws IOException, WriterException;

    Page<Vehicle> findVehiclesByRegistrationNumberLikeIgnoreCaseAndCustomerId(int pageSize, int pageNumber, String searchKey, Long customerId);

    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);

    void delete(Long id);

    Page<Vehicle> findVehiclesByRegistrationNumberLikeIgnoreCase(int size, int page, String searchKey);

    Optional<Vehicle> findById(Long id);

    ByteArrayInputStream generateReport();
}
