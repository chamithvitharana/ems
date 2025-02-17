package com.ems.service.repository;

import com.ems.commonlib.constant.TransactionStatus;
import com.ems.commonlib.entity.transaction.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVehicleIdAndStatus(Long id, TransactionStatus status);

    @Query("SELECT t FROM Transaction t " +
            "WHERE t.customerId = :customerId " +
            "AND (" +
            "LOWER(t.code) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.vehicleRegistrationNumber) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.entranceName) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.exitName) LIKE LOWER(CONCAT('%', :searchKey, '%'))" +
            ")")
    Page<Transaction> findPageBySearchKeyAndCustomerId(Pageable pageable, @Param("searchKey") String searchKey, @Param("customerId") Long customerId);

    @Query("SELECT t FROM Transaction t " +
            "WHERE " +
            "LOWER(t.code) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.vehicleRegistrationNumber) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.entranceName) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(t.exitName) LIKE LOWER(CONCAT('%', :searchKey, '%'))")
    Page<Transaction> findAllBySearchKey(Pageable pageable, @Param("searchKey") String searchKey);

    Page<Transaction> findPageByCustomerId(Pageable pageable, Long id);


    Integer countByStatus(TransactionStatus status);

    Long countByEntranceIdAndStatus(Long entranceId, TransactionStatus transactionStatus);

    List<Transaction> findAllByVehicleIdAndEntranceTimeBetween(Long id, LocalDateTime localDateTime, LocalDateTime localDateTime1);

    List<Transaction> findAllByEntranceTimeBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);

}
