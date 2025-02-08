package com.ems.commonlib.dto.ws;

import com.ems.commonlib.constant.WebSocketMessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketMessage<T> {

    private WebSocketMessageType type;

    private String description;

    private T data;

}
