package com.ems.commonlib.vo;

import com.ems.commonlib.constant.NotificationSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationVo {

    private NotificationSource notificationSource;

    private Map<String, Object> variables;

    private List<String> toEmails;

    private List<String> mobileNumbers;
}
