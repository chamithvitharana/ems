package com.ems.commonlib.vo;

import com.ems.commonlib.entity.accespoint.AccessPoint;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.transaction.Transaction;
import com.ems.commonlib.entity.vehicle.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionVo {

    private AccessPoint entrance;

    private Customer customer;

    private Double charge;

    private Boolean isCardPayment;

    private Vehicle vehicle;

    private Transaction transaction;

}
