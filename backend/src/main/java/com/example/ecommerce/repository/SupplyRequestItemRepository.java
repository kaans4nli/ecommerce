package com.example.ecommerce.repository;

import com.example.ecommerce.entity.SupplyRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplyRequestItemRepository
        extends JpaRepository<SupplyRequestItem, Long> {
}