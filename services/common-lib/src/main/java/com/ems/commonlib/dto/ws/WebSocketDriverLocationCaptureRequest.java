package com.ems.commonlib.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketDriverLocationCaptureRequest {

    private double lat;
    private double lon;
    private boolean hasReservation;
    private String reservationId;
    private String passengerUsername;
    private String driverUsername;

}
