package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.SupplyRequestCreateRequest;
import com.example.ecommerce.dto.request.SupplyRequestStatusUpdateRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.SupplyRequestResponse;
import com.example.ecommerce.enums.RequestStatus;
import com.example.ecommerce.service.SupplyRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/supply-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SupplyRequestController {

    private final SupplyRequestService supplyRequestService;

    // ─────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<SupplyRequestResponse>> createRequest(
            @Valid @RequestBody SupplyRequestCreateRequest request
    ) {

        SupplyRequestResponse response =
                supplyRequestService.createRequest(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Supply request created successfully",
                        response
                )
        );
    }

    // ─────────────────────────────────────
    // GET BY STATUS
    // ─────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplyRequestResponse>>> getRequests(
            @RequestParam RequestStatus status
    ) {

        List<SupplyRequestResponse> response =
                supplyRequestService.getRequestsByStatus(status);

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    // ─────────────────────────────────────
    // UPDATE STATUS
    // ─────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SupplyRequestResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody SupplyRequestStatusUpdateRequest request
    ) {

        SupplyRequestResponse response =
                supplyRequestService.updateStatus(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Supply request updated successfully",
                        response
                )
        );
    }

    // ─────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(
            @PathVariable Long id
    ) {

        supplyRequestService.deleteRequest(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Supply request deleted successfully",
                        null
                )
        );
    }
}