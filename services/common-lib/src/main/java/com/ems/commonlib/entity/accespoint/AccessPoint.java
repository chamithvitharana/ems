package com.ems.commonlib.entity.accespoint;

import com.ems.commonlib.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "AccessPoint")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccessPoint extends BaseEntity {

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "code", length = 100)
    private String code;

    private Double lon;

    private Double lat;

    private String emergencyAlertEmail;

    private String emergencyAlertMobile;

}
