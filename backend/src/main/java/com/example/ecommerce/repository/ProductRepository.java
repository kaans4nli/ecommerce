package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByIsActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByCategoryIdAndIsActiveTrueAndNameContainingIgnoreCase(
            Long categoryId,
            String name,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    List<Product> findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByOriginalPriceIsNotNullAndOriginalPriceGreaterThanAndIsActiveTrue(
            java.math.BigDecimal price,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "images"})
    List<Product> findByOriginalPriceIsNotNullAndOriginalPriceGreaterThanAndIsActiveTrueOrderByCreatedAtDesc(
            java.math.BigDecimal price
    );

    @EntityGraph(attributePaths = {"category", "images"})
    Optional<Product> findWithImagesById(Long id);

    @Query("""
    SELECT p FROM Product p
    WHERE p.isActive = true
    AND p.originalPrice IS NOT NULL
    AND p.originalPrice > p.price
""")
    Page<Product> findDiscountedProducts(Pageable pageable);

    @Query("""
SELECT p FROM Product p
WHERE p.isActive = true
AND (
    LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
    OR CAST(p.id AS string) = :query
)
""")
    Page<Product> searchByNameOrId(@Param("query") String query, Pageable pageable);

    long countByCategoryId(Long categoryId);

    long countByIsActiveTrue();

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByCategoryId(
            Long categoryId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findByCategoryIdAndNameContainingIgnoreCase(
            Long categoryId,
            String name,
            Pageable pageable
    );
}