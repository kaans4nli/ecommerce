package com.example.ecommerce.dto.request;

import com.example.ecommerce.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplyRequestStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private RequestStatus status;
}