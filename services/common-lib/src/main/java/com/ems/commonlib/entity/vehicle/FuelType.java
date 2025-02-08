package com.ems.commonlib.entity.vehicle;

import com.ems.commonlib.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "FuelTypes")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FuelType extends BaseEntity {

    @Column(length = 100)
    private String code;

    @Column(length = 100)
    private String name;

}
