package com.ems.service.repository;

import com.ems.commonlib.entity.agent.Agent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {

    @Query("SELECT a FROM Agent a " +
            "WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(a.email) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(a.accessPointName) LIKE LOWER(CONCAT('%', :searchKey, '%')) ")
    Page<Agent> findBySearchKey(String searchKey, Pageable pageable);

}
