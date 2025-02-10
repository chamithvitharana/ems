package com.ems.service.controller.admin;

import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.agent.Agent;
import com.ems.service.service.AgentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/agent/admin")
public class AgentAdminController {

    private final AgentService agentService;

    public AgentAdminController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping
    public ResponseEntity<AppResponse<Agent>> save(@RequestBody Agent requestDto) {

        AppResponse<Agent> response = null;

        try {

            Agent save = agentService.save(requestDto);

            response = AppResponse.<Agent>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(200)
                    .message("Agent registered successfully")
                    .data(save)
                    .build();

        } catch (Exception e) {
            response = AppResponse.<Agent>builder()
                    .localDateTime(LocalDateTime.now())
                    .statusCode(400)
                    .message(e.getMessage())
                    .build();
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<AppResponse<Agent>> update(@RequestBody Agent requestDto) {

        Agent save = agentService.update(requestDto);

        AppResponse<Agent> response = AppResponse.<Agent>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Agent saved and sent successfully")
                .data(save)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Agent>>> getPage(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {

        Page<Agent> agents = agentService.getPageBySearchKey(size, page, searchKey);
        AppResponse<Page<Agent>> response = AppResponse.<Page<Agent>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Agents retrieved successfully")
                .data(agents)
                .build();
        return ResponseEntity.ok(response);
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

    @GetMapping("/report/download")
    public ResponseEntity<byte[]> downloadCustomerPdf() {

        // Generate PDF report as ByteArrayInputStream
        ByteArrayInputStream pdfStream = agentService.generateReport();

        // Convert InputStream to byte array
        byte[] pdfBytes = pdfStream.readAllBytes();

        // Set response headers for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);

    }
}
