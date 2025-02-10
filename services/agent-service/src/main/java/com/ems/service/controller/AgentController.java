package com.ems.service.controller;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.agent.Agent;
import com.ems.service.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/agent/")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("{id}")
    public ResponseEntity<AppResponse<Agent>> getById(
            @PathVariable("id") Long id
    ) {

        Optional<Agent> agent = agentService.getById(id);

        if(agent.isEmpty()) {
            AppResponse<Agent> response = AppResponse.<Agent>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(404)
                    .message("Not found")
                    .build();
            return ResponseEntity.ok(response);
        }

        AppResponse<Agent> response = AppResponse.<Agent>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Agent retrieved successfully")
                .data(agent.get())
                .build();
        return ResponseEntity.ok(response);
    }

}
