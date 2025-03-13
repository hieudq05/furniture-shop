package org.labpoly.sof3022.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.model.Role;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.service.JwtService;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.labpoly.sof3022.service.role.RoleService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;


@RestController
@RequestMapping("api/auth")
public class CustomerAuthController {
    private final CustomerService customerService;
    private final RoleService roleService;
    private final JwtService jwtService;

    public CustomerAuthController(CustomerService customerService, RoleService roleService, JwtService jwtService) {
        this.customerService = customerService;
        this.roleService = roleService;
        this.jwtService = jwtService;
    }

    @PostMapping("login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestParam String email, @RequestParam String password, @RequestHeader("Authorization") String token) {
        if(!token.isEmpty()) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_LOGGED_IN);
        }

        Customer customer = customerService.getCustomerByEmailAndPassword(email, password);
        if (customer == null) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        }
        if(!customer.getIsActive()){
            throw new ApiException(ErrorCode.CUSTOMER_IS_BLOCKED);
        }

        String accessToken = jwtService.generateAccessToken(customer.getEmail());
        String refreshToken = jwtService.generateRefreshToken(customer.getEmail());

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);

        return ResponseEntity.ok()
                .header("Set-Cookie", refreshTokenCookie.toString())
                .body(ApiResponse.<Map<String, String>>builder()
                        .code("CUS_LOGIN_200")
                        .message("Customer is logged in successfully!")
                        .data(tokens)
                        .build());

    }

    @PostMapping("register")
    public ResponseEntity<ApiResponse<Map<String, String>>> register(@ModelAttribute Customer customer) {
        if(customerService.getCustomerById(customer.getId()) != null) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_DUPLICATED);
        }

        Role customerRole = roleService.getRoleById(UUID.fromString("F03E5311-AF70-4D5D-9E4B-7C66FCFDE95A"));

        customer.setIsActive(true);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setRole(customerRole);
        customer.setImage("https://scontent.fsgn2-11.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=y_2d5iWHAR8Q7kNvgGNLCLq&_nc_oc=AdjSRhL86y3h01igWRjTprc5njODrqM49JRhk2fUPsGvaXJco1tmw3GP1zcjy9f-A6uIPOz-KE9EnC0ATuoGsOq_&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=As6zVXtGTG_HuwjHbveZ62o&oh=00_AYC3OM5uyKKTV-SQkOKfHFtVd2UHrasOOyUcvXBc2eR-Lw&oe=67D6597A");

        Customer customerSaved = customerService.saveCustomer(customer);

        if (customerSaved == null) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        }

        String accessToken = jwtService.generateAccessToken(customer.getEmail());
        String refreshToken = jwtService.generateRefreshToken(customer.getEmail());

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);

        return ResponseEntity.ok()
                .header("SetCookie", refreshTokenCookie.toString())
                .body(ApiResponse.<Map<String, String>>builder()
                        .code("CUS_REGISTER_200")
                        .message("Customer is registered successfully!")
                        .data(tokens)
                        .build()
                );
    }

    @PostMapping("logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String accessToken, HttpServletResponse response) {
        // Xóa cookie JSESSIONID
        Cookie jsessionCookie = new Cookie("JSESSIONID", null);
        jsessionCookie.setHttpOnly(true);
        jsessionCookie.setPath("/");
        jsessionCookie.setMaxAge(0);
        response.addCookie(jsessionCookie);

        // Xóa cookie refreshToken
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
        jwtService.invalidateToken(accessToken);

        return ResponseEntity.ok()
                .body(ApiResponse.<String>builder()
                        .code("CUS_LOGOUT_200")
                        .message("Logged out successfully, cookies removed")
                        .data(null)
                        .build()
                );
    }
}
