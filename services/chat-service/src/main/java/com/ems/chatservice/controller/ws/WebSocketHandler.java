package com.ems.chatservice.controller.ws;

import com.ems.chatservice.service.ChatService;
import com.ems.commonlib.constant.WebSocketMessageType;
import com.ems.commonlib.dto.ws.WebSocketMessage;
import com.ems.commonlib.entity.chat.ChatMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    public static final String TYPE = "type";
    public static final String USER_ID = "userId";
    public static final String USER_ID_WITH_EQUALS = "userId=";

    private final Map<String, WebSocketSession> wsSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper;

    private final ChatService chatService;

    public WebSocketHandler(ObjectMapper objectMapper, ChatService chatService) {
        this.objectMapper = objectMapper;
        this.chatService = chatService;
    }

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {

        // Extract the type
        WebSocketMessageType type = getWebSocketMessageType(message);
        String username = getUserIdFromQuery(session.getUri().getQuery());

        // identify chat msg type
        if (WebSocketMessageType.CHAT.equals(type)) {

            // Deserialize the incoming JSON message
            WebSocketMessage<ChatMessage> webSocketMessage =
                    objectMapper.readValue(
                            message.getPayload(),
                            objectMapper.getTypeFactory().constructParametricType(WebSocketMessage.class,
                                    ChatMessage.class)
                    );


            ChatMessage chat = webSocketMessage.getData();

            // insert to database
            chatService.save(chat);

            // send msg to live users
            sendMessageToUsers(webSocketMessage);
        }

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = getUserIdFromQuery(session.getUri().getQuery());

        if (username != null) {
            wsSessions.put(username, session);
        } else {
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        wsSessions.values().removeIf(s -> s.equals(session));
    }

    public void sendMessageToUser(String username, Object message) throws Exception {
        WebSocketSession session = wsSessions.get(username);

        if (session != null && session.isOpen()) {
            // Serialize the message object to JSON
            String jsonMessage = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(jsonMessage));
        }
    }

    public void sendMessageToUsers(Object message) throws Exception {
        // Serialize the message object to JSON
        String jsonMessage = objectMapper.writeValueAsString(message);
        TextMessage textMessage = new TextMessage(jsonMessage);

        for (WebSocketSession session : wsSessions.values()) {
            if (session != null && session.isOpen()) {
                session.sendMessage(textMessage);
            }
        }
    }

    private String getUserIdFromQuery(String query) {
        if (query != null && query.contains(USER_ID)) {
            return query.split(USER_ID_WITH_EQUALS)[1];
        }
        return null;
    }

    private WebSocketMessageType getWebSocketMessageType(TextMessage message) throws JsonProcessingException {
        return WebSocketMessageType.valueOf((String) objectMapper.readValue(message.getPayload(), Map.class).get(TYPE));
    }

}
