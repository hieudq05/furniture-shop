package org.labpoly.sof3022.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpSession;
import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.model.Role;
import org.labpoly.sof3022.dto.CustomerAuthInfo;
import org.labpoly.sof3022.dto.CustomerAuthInfoImpl;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "guS7euRs2RUyWYSMPw//aNIEt8xQBxVTDndPknLLnaM=";
    private static final Long EXPIRATION_TIME = 60 * 60 * 1000L;
    private static final Long REFRESH_TIME = 7 * 24 * 60 * 60 * 1000L;

    private final HttpSession session;
    private final CustomerService customerService;
    private final RedisTemplate<String, String> redisTemplate;

    public JwtService(HttpSession session, CustomerService customerService, RedisTemplate<String, String> redisTemplate) {
        this.session = session;
        this.customerService = customerService;
        this.redisTemplate = redisTemplate;
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Map<String, Object> generateClaims(Customer customer) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", customer.getId());
        claims.put("fullName", customer.getFullName());
        claims.put("role", customer.getRole());
        claims.put("image", customer.getImage());

        return claims;
    }

    // Generate access token
    public String generateAccessToken(String email) {

        Customer customer = customerService.getCustomerByEmail(email);

        // Add customer into session
        session.setAttribute("customerLoggedIn", customer);

        return Jwts.builder()
                .subject(email)
                .claims(generateClaims(customer))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    //Generate refresh token
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TIME))
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    // Extract token to get Claims (payload)
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Get a Claim from token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Get email from token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Get customerAuthInfo from token
    public CustomerAuthInfo extractCustomerAuthInfo(String token) {
        Claims claims = extractAllClaims(token);
        Role role = new ObjectMapper().convertValue(claims.get("role"), Role.class);
        return CustomerAuthInfoImpl.builder()
                .id(UUID.fromString(claims.get("id", String.class)))
                .fullName(claims.get("fullName", String.class))
                .image(claims.get("image", String.class))
                .role(role)
                .build();
    }

    // Check token valid
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void invalidateToken(String token) {
        redisTemplate.opsForValue().set(token, "blacklisted");
    }

    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey(token);
    }
}
