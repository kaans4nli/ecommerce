package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.SupplyRequestCreateRequest;
import com.example.ecommerce.dto.request.SupplyRequestItemRequest;
import com.example.ecommerce.dto.request.SupplyRequestStatusUpdateRequest;
import com.example.ecommerce.dto.response.SupplyRequestItemResponse;
import com.example.ecommerce.dto.response.SupplyRequestResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.SupplyRequest;
import com.example.ecommerce.entity.SupplyRequestItem;
import com.example.ecommerce.enums.RequestStatus;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.SupplyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplyRequestService {

    private final SupplyRequestRepository supplyRequestRepository;
    private final ProductRepository productRepository;

    // ─────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────

    @Transactional
    public SupplyRequestResponse createRequest(
            SupplyRequestCreateRequest request
    ) {

        SupplyRequest supplyRequest = SupplyRequest.builder()
                .name(request.getName())
                .status(RequestStatus.PENDING)
                .build();

        List<SupplyRequestItem> items = request.getItems()
                .stream()
                .map(itemRequest -> createItem(supplyRequest, itemRequest))
                .toList();

        supplyRequest.setItems(items);

        SupplyRequest saved =
                supplyRequestRepository.save(supplyRequest);

        return toResponse(saved);
    }

    // ─────────────────────────────────────
    // GET BY STATUS
    // ─────────────────────────────────────

    public List<SupplyRequestResponse> getRequestsByStatus(
            RequestStatus status
    ) {

        return supplyRequestRepository
                .findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ─────────────────────────────────────
    // UPDATE STATUS
    // ─────────────────────────────────────

    @Transactional
    public SupplyRequestResponse updateStatus(
            Long id,
            SupplyRequestStatusUpdateRequest request
    ) {

        SupplyRequest supplyRequest =
                supplyRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "SupplyRequest",
                                        "id",
                                        id
                                ));

        supplyRequest.setStatus(request.getStatus());

        return toResponse(
                supplyRequestRepository.save(supplyRequest)
        );
    }

    // ─────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────

    @Transactional
    public void deleteRequest(Long id) {

        if (!supplyRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "SupplyRequest",
                    "id",
                    id
            );
        }

        supplyRequestRepository.deleteById(id);
    }

    // ─────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────

    private SupplyRequestItem createItem(
            SupplyRequest supplyRequest,
            SupplyRequestItemRequest request
    ) {

        Product product = productRepository.findById(
                        request.getProductId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "id",
                                request.getProductId()
                        ));

        return SupplyRequestItem.builder()
                .supplyRequest(supplyRequest)
                .product(product)
                .quantity(request.getQuantity())
                .build();
    }

    // ─────────────────────────────────────
    // MAPPING
    // ─────────────────────────────────────

    public SupplyRequestResponse toResponse(
            SupplyRequest request
    ) {

        return SupplyRequestResponse.builder()
                .id(request.getId())
                .name(request.getName())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())

                .items(
                        request.getItems()
                                .stream()
                                .map(item ->
                                        SupplyRequestItemResponse.builder()
                                                .id(item.getId())
                                                .productId(item.getProduct().getId())
                                                .productName(item.getProduct().getName())
                                                .imageUrl(item.getProduct().getImageUrl())
                                                .quantity(item.getQuantity())
                                                .build()
                                )
                                .toList()
                )

                .build();
    }
}