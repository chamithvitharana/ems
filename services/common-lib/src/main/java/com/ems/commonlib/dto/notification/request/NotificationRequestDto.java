package com.ems.commonlib.dto.notification.request;

import com.ems.commonlib.constant.NotificationType;
import com.ems.commonlib.entity.notification.Notification;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestDto {

    private String content;

    @JsonProperty("isCustomerNotification")
    private boolean isCustomerNotification;

    @JsonProperty("isAgentNotification")
    private boolean isAgentNotification;

    @JsonProperty("isSmsNotification")
    private boolean isSmsNotification;

    @JsonProperty("isEmailNotification")
    private boolean isEmailNotification;

    public Notification getNotification() {

        NotificationType notificationType = null;

        if (this.isSmsNotification && this.isEmailNotification) {
            notificationType = NotificationType.EMAIL_AND_SMS;
        } else if (this.isEmailNotification) {
            notificationType = NotificationType.EMAIL;
        } else if (this.isSmsNotification) {
            notificationType = NotificationType.SMS;
        }

        return Notification
                .builder()
                .notificationType(notificationType)
                .isAgentNotification(this.isAgentNotification)
                .isCustomerNotification(this.isCustomerNotification)
                .content(this.content)
                .build();
    }

}
