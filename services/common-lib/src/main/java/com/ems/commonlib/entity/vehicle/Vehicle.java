package com.ems.commonlib.entity.vehicle;

import com.ems.commonlib.BaseEntity;
import com.ems.commonlib.constant.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "Vehicles")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle extends BaseEntity {

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "registered_year", length = 100)
    private String registeredYear;

    @Column(name = "manufactured_year", length = 45)
    private String manufacturedYear;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @ManyToOne
    @JoinColumn(name = "FuelTypes_id")
    private FuelType fuelType;

    @ManyToOne
    @JoinColumn(name = "VehicleType_id")
    private VehicleType vehicleType;

    @ManyToOne
    @JoinColumn(name = "Brands_id")
    private Brand brand;

    private Long customerId;

    private String customerNIC;

    @Enumerated(EnumType.STRING)
    private Status status;

}
