package com.ems.service.service;

import com.ems.commonlib.constant.TransactionStatus;
import com.ems.commonlib.entity.transaction.Transaction;
import com.ems.commonlib.vo.LiveAccessPointCountVo;
import com.ems.commonlib.vo.TransactionVo;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionService {

    Transaction transactionManage(String vehicleNumber, Long accessPointId);

    Optional<Transaction> findByVehicleIdAndStatus(Long id, TransactionStatus status);

    Page<Transaction> findPageBySearchKey(Integer page, Integer size, String searchKey, String customerEmail);

    Transaction manualComplete(String id);

    void breakdown(String vehicleNumber, String description, Double lon, Double lat);

    Integer findCountByStatus(TransactionStatus status);

    List<LiveAccessPointCountVo> getLiveCount();

    Optional<TransactionVo> get(String vehicleNumber);

    ByteArrayInputStream generateReport(LocalDate start, LocalDate end, String vehicleNumber);
}
