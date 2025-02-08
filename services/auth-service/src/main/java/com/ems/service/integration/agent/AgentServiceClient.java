package com.ems.service.integration.agent;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.agent.Agent;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(name = "AGENT-SERVICE", fallback = AgentServiceFallback.class)
public interface AgentServiceClient {

    @CircuitBreaker(name = "AGENT-SERVICE")
    @GetMapping("/api/v1/agent/{id}")
    ResponseEntity<AppResponse<Optional<Agent>>> getById(@PathVariable("id") String id);

}
