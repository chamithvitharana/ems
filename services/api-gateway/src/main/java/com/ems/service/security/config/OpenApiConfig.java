package com.ems.service.security.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
@OpenAPIDefinition(info = @Info(title = "API Gateway", version = "1.0", description = "Documentation API Gateway v1.0"))
public class OpenApiConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder
                .routes()
                .route(r -> r.path("/auth/v3/api-docs").and().method(HttpMethod.GET).uri("lb://AUTH-SERVICE"))
                .route(r -> r.path("/customer/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CUSTOMER-SERVICE"))
                .route(r -> r.path("/vehicle/v3/api-docs").and().method(HttpMethod.GET).uri("lb://VEHICLE-SERVICE"))
                .route(r -> r.path("/chat/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CHAT-SERVICE"))
                .route(r -> r.path("/access-point/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CHAT-SERVICE"))
                .route(r -> r.path("/agent/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CHAT-SERVICE"))
                .route(r -> r.path("/notification/v3/api-docs").and().method(HttpMethod.GET).uri("lb://CHAT-SERVICE"))
                .build();
    }
}