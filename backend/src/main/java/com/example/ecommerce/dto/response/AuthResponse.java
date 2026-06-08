package com.example.ecommerce.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private String username;
    private String fullName;

    public static AuthResponse of(String token, String username, String fullName) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(username)
                .fullName(fullName)
                .build();
    }
}
