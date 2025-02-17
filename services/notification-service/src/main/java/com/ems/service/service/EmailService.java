package com.ems.service.service;

import java.util.Map;

public interface EmailService {

    void send(String toEmail, String subject, String templateName, Map<String, Object> variables);

}
