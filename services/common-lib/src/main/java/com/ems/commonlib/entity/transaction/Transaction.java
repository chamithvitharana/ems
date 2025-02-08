package com.ems.commonlib.entity.transaction;

import com.ems.commonlib.BaseEntity;
import com.ems.commonlib.constant.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Transactions")
public class Transaction extends BaseEntity {

    @Column(length = 100)
    private String code;

    @Column(name = "vehicles_id")
    private Long vehicleId;

    private String vehicleRegistrationNumber;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "entrance_id")
    private Long entranceId;

    @Column(name = "exit_id")
    private Long exitId;

    private LocalDateTime entranceTime;

    private LocalDateTime exitTime;

    @Enumerated(value = EnumType.STRING)
    private TransactionStatus status;

    private Double amount;

    private Double distance;

    private String entranceName;

    private String exitName;

}