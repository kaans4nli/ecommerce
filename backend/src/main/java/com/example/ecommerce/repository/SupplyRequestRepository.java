package com.example.ecommerce.repository;

import com.example.ecommerce.entity.SupplyRequest;
import com.example.ecommerce.enums.RequestStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplyRequestRepository extends JpaRepository<SupplyRequest, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.product"
    })
    List<SupplyRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
}