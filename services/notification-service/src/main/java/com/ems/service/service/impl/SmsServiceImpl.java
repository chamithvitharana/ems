package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.NotificationType;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.service.SmsService;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    private static final String SEND_LK_URL = "https://sms.send.lk/api/v3/sms/send";
    private final OkHttpClient client = new OkHttpClient().newBuilder().build();

    @Value("${sms.account.enabled}")
    public Boolean ACCOUNT_ENABLED;

    @Value("${sms.sendlk.api-key}")
    public String API_KEY;

    @Value("${sms.sendlk.sender-id}")
    public String SENDER_ID;

    private final TemplateEngine templateEngine;

    public SmsServiceImpl(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendSms(NotificationVo notificationVo) {

        NotificationSource source = notificationVo.getNotificationSource();

        if((source.getNotificationType() == NotificationType.EMAIL_AND_SMS
                || source.getNotificationType() == NotificationType.SMS)
                && notificationVo.getMobileNumbers() != null
        ) {
            for (String mobileNumber : notificationVo.getMobileNumbers()) {
                String smsContent = generateSmsContent(notificationVo.getVariables(), source.getSmsTemplateName());
                send(mobileNumber, smsContent);
            }
        }
    }

    private String generateSmsContent(Map<String, Object> variables, String templateName) {
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process(templateName, context);
    }

    @Override
    public void send(String toNumber, String content) {
        if (!ACCOUNT_ENABLED) {
            System.out.println("SMS sending is disabled.");
            return;
        }

        try {
            // Format the phone number (if necessary)
            String formattedToNumber = formatToInternational(toNumber);

            // Build the URL with query parameters
            HttpUrl.Builder urlBuilder = HttpUrl.parse(SEND_LK_URL).newBuilder();
            urlBuilder.addQueryParameter("recipient", formattedToNumber);
            urlBuilder.addQueryParameter("sender_id", SENDER_ID);
            urlBuilder.addQueryParameter("message", content);

            // Build the HTTP request
            Request request = new Request.Builder()
                    .url(urlBuilder.build())
                    .method("POST", RequestBody.create("", null))
                    .addHeader("Authorization", "Bearer " + API_KEY)
                    .build();

            // Execute the request
            Response response = client.newCall(request).execute();

            if (response.isSuccessful()) {
                System.out.println("SMS sent successfully to " + toNumber);
            } else {
                System.out.println("Failed to send SMS: " + response.message());
            }
            response.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String formatToInternational(String phoneNumber) {
        phoneNumber = phoneNumber.replaceAll("\\D", "");

        if (phoneNumber.startsWith("94")) {
            return phoneNumber;
        } else if (phoneNumber.startsWith("0")) {
            return "94" + phoneNumber.substring(1);
        } else {
            return "94" + phoneNumber;
        }
    }
}
