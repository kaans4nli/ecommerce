package com.example.ecommerce.dto.response;

import com.example.ecommerce.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SupplyRequestResponse {

    private Long id;

    private String name;

    private RequestStatus status;

    private List<SupplyRequestItemResponse> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}