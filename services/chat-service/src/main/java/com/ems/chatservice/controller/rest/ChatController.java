package com.ems.chatservice.controller.rest;

import com.ems.chatservice.service.ChatService;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.chat.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<ChatMessage>>> get(
            @RequestParam("page") int page,
            @RequestParam("size") int size
    ) {
        Page<ChatMessage> chatMessages = chatService.findPage(size, page);
        AppResponse<Page<ChatMessage>> response = AppResponse.<Page<ChatMessage>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Chat messages retrieved successfully")
                .data(chatMessages)
                .build();
        return ResponseEntity.ok(response);
    }

}
