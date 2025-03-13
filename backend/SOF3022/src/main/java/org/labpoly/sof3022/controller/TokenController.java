package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/token")
public class TokenController {

    private final JwtService jwtService;

    public TokenController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, String>>builder()
                            .code("TOKEN_INVALID")
                            .message("Refresh token is invalid or expired")
                            .build()
            );
        }

        String customerAuthEmail = jwtService.extractEmail(refreshToken);

        String newAccessToken = jwtService.generateAccessToken(customerAuthEmail);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", newAccessToken);

        System.out.println("tokens : " + tokens);

        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .code("TOKEN_REFRESHED")
                .message("New access token generated successfully")
                .data(tokens)
                .build());
    }

    @PostMapping("validate")
    public ResponseEntity<ApiResponse<Map<String, String>>> validateToken(@RequestHeader("Authorization") String token) {
        if (!jwtService.validateToken(token) || jwtService.isTokenBlacklisted(token)) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", token);

        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .code("VALID_TOKEN_200")
                .message("Validate token successfully.")
                .data(tokens)
                .build()
        );
    }
}
