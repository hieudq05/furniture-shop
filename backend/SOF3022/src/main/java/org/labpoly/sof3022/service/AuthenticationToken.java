package org.labpoly.sof3022.service;

import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.dto.CustomerAuthInfo;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationToken {

    private final JwtService jwtService;
    private final CustomerService customerService;

    public AuthenticationToken(JwtService jwtService, CustomerService customerService) {
        this.jwtService = jwtService;
        this.customerService = customerService;
    }

    public CustomerAuthInfo authenticateCustomer(String token) {
        if (!jwtService.validateToken(token) || jwtService.isTokenBlacklisted(token)) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        String cusEmail = jwtService.extractEmail(token);
        if (token == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
        if (customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        return customerAuthInfo;
    }
}
