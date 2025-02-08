package com.ems.commonlib.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketCommunicationRequest {

    private String receiverUsername;

    private String senderUsername;

    private Object data;

}
