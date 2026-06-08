package com.example.ecommerce.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SupplyRequestItemResponse {

    private Long id;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Integer quantity;
}