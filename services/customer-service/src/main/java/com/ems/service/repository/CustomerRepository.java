package com.ems.service.repository;

import com.ems.commonlib.entity.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByNic(String nic);

    Optional<Customer> findByEmail(String email);

    @Query("SELECT c FROM Customer c " +
            "WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(c.nic) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(c.contactNumber) LIKE LOWER(CONCAT('%', :searchKey, '%'))" +
            "OR LOWER(c.email) LIKE LOWER(CONCAT('%', :searchKey, '%'))"
    )
    Page<Customer> findBySearchKey(String searchKey, Pageable pageable);

}
