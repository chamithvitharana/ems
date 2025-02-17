package com.ems.service.repository;

import com.ems.commonlib.entity.transaction.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FareRepository extends JpaRepository<Fare, Long>, JpaSpecificationExecutor<Fare> {

    Optional<Fare> findBySourceAndDestinationAndCategory(String sourceName, String destinationName, String category);

}
