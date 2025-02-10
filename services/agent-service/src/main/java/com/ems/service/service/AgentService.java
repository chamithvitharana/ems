package com.ems.service.service;

import com.ems.commonlib.entity.agent.Agent;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.util.Optional;

public interface AgentService {

    Agent save(Agent agent);

    Page<Agent> getPageBySearchKey(Integer size, Integer page, String searchKey);

    Optional<Agent> getById(Long id);

    Agent update(Agent requestDto);

    ByteArrayInputStream generateReport();
}
