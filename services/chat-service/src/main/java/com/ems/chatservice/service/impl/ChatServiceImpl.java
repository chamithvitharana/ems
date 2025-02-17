package com.ems.chatservice.service.impl;

import com.ems.chatservice.repository.ChatMessageRepository;
import com.ems.chatservice.service.ChatService;
import com.ems.commonlib.entity.chat.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public Optional<ChatMessage> save(ChatMessage chatMessage) {
        return Optional.of(chatMessageRepository.save(chatMessage));
    }

    @Override
    public Page<ChatMessage> findPage(int size, int page) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return chatMessageRepository.findAllByOrderByTimestampDesc(pageable);
    }
}
