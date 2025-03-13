package org.labpoly.sof3022.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // ✅ Cho phép tất cả API có tiền tố `/api/`
                        .allowedOrigins("http://localhost:3000") // ✅ Chỉ cho phép frontend truy cập
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ✅ Cho phép tất cả các method
                        .allowedHeaders("*") // ✅ Cho phép tất cả headers
                        .allowCredentials(true); // ✅ Cho phép gửi cookie nếu có
            }
        };
    }
}