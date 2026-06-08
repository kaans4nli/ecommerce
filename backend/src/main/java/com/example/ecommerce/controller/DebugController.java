package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final ProductRepository productRepository;

    @GetMapping("/products-test")
    public ResponseEntity<ApiResponse<Object>> testProducts() {
        try {
            Sort sort = Sort.by("createdAt").descending();
            Pageable pageable = PageRequest.of(0, 12, sort);
            var products = productRepository.findByIsActiveTrue(pageable);
            
            return ResponseEntity.ok(
                ApiResponse.success("Debug test successful", 
                    java.util.Map.of(
                        "totalElements", products.getTotalElements(),
                        "count", products.getContent().size(),
                        "firstProductName", products.getContent().isEmpty() ? "N/A" : products.getContent().get(0).getName()
                    )
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Error: " + e.getMessage()));
        }
    }
}
