package com.ems.chatservice.service;

import com.ems.commonlib.entity.chat.ChatMessage;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface ChatService {

    Optional<ChatMessage> save(ChatMessage chatMessage);

    Page<ChatMessage> findPage(int size, int page);

}
