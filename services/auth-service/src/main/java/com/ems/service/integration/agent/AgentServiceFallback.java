package com.ems.service.integration.agent;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.agent.Agent;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class AgentServiceFallback implements AgentServiceClient {

    @Override
    public ResponseEntity<AppResponse<Optional<Agent>>> getById(@PathVariable String id) {
        AppResponse<Optional<Agent>> response = AppResponse.<Optional<Agent>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(503)
                .message("Service unavailable - fallback method for getById")
                .data(Optional.empty())
                .build();
        return ResponseEntity.status(503).body(response);
    }

}
