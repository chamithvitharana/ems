package com.ems.commonlib.dto.general;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppResponse<T> {

    private LocalDateTime localDateTime;

    private int statusCode;

    private String message;

    private T data;

}
