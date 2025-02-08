package com.ems.commonlib.entity.transaction;

import com.ems.commonlib.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fares", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"source", "destination", "category"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fare extends BaseEntity {

    private String source;

    private String destination;

    @Column(nullable = false)
    private double fare;

    @Column(nullable = false)
    private String category;
}