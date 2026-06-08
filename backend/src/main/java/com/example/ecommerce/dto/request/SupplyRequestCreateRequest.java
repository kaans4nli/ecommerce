package com.example.ecommerce.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SupplyRequestCreateRequest {

    @NotBlank(message = "Request name is required")
    private String name;

    @Valid
    @NotEmpty(message = "At least one item is required")
    private List<SupplyRequestItemRequest> items;
}