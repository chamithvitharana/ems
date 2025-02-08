package com.ems.commonlib.constant;

public enum WebSocketMessageType {

    CHAT("Chat");

    final String description;

    WebSocketMessageType(String description) {
        this.description = description;
    }
}
