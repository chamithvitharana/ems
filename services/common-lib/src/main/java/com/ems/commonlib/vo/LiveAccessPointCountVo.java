package com.ems.commonlib.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LiveAccessPointCountVo {

    private Double lat;
    private Double lon;
    private String name;
    private Long count;

}
