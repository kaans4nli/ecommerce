package com.example.ecommerce.dto.request;

import lombok.Data;

@Data
public class ProductImageOrderRequest {

    private Long imageId;
    private Integer displayOrder;
}