package com.ems.commonlib.dto.auth.response;

import com.ems.commonlib.entity.agent.Agent;
import com.ems.commonlib.entity.auth.UserRoles;
import com.ems.commonlib.entity.customer.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private UserRoles userRole;
    private String email;
    private String username;
    private Agent agent;
    private Customer customer;
}
