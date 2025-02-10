package com.ems.service.service;

import com.ems.commonlib.entity.customer.Customer;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

public interface CustomerService {

    Customer save(Customer customer);

    Optional<Customer> findById(Long id);

    Optional<Customer> findByNic(String nic);

    Optional<Customer> findByEmail(String email);

    Page<Customer> findPage(Integer size, Integer page);

    Page<Customer> findPageBySearchKey(Integer size, Integer page, String searchKey);

    ByteArrayInputStream generateCustomerReport();

    ByteArrayInputStream generateCustomerPdf(List<Customer> customers);
}
