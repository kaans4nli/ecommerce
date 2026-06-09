package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.ProductImageOrderRequest;
import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.PageResponse;
import com.example.ecommerce.dto.response.ProductImageResponse;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductImage;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductImageRepository;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final CloudinaryService cloudinaryService;

    public PageResponse<ProductResponse> getAllProducts(
            int page, int size, String sortBy, String sortDir,
            Long categoryId, String search) {

        // Validate and sanitize sort field - only allow specific fields
        String validatedSortBy = validateSortField(sortBy);

        Sort sort = sortDir != null && sortDir.equalsIgnoreCase("asc")
                ? Sort.by(validatedSortBy).ascending()
                : Sort.by(validatedSortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products;
        String searchQuery = (search != null && !search.isBlank()) ? search : null;

        // Handle different filtering scenarios
        if (categoryId != null && searchQuery != null) {
            products = productRepository.findByCategoryIdAndIsActiveTrueAndNameContainingIgnoreCase(
                    categoryId, searchQuery, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        } else if (searchQuery != null) {
            products = productRepository.findByIsActiveTrueAndNameContainingIgnoreCase(
                    searchQuery, pageable);
        } else {
            products = productRepository.findByIsActiveTrue(pageable);
        }

        return PageResponse.of(products.map(this::toResponse));
    }

    public PageResponse<ProductResponse> getAllProductsForAdmin(
            int page,
            int size,
            String sortBy,
            String sortDir,
            Long categoryId,
            String search,
            Boolean active
    ) {

        String validatedSortBy = validateSortField(sortBy);

        Sort sort = sortDir != null && sortDir.equalsIgnoreCase("asc")
                ? Sort.by(validatedSortBy).ascending()
                : Sort.by(validatedSortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products;

        String searchQuery =
                (search != null && !search.isBlank())
                        ? search
                        : null;

        // ACTIVE FILTER
        if (Boolean.TRUE.equals(active)) {

            if (categoryId != null && searchQuery != null) {

                products =
                        productRepository
                                .findByCategoryIdAndIsActiveTrueAndNameContainingIgnoreCase(
                                        categoryId,
                                        searchQuery,
                                        pageable
                                );

            } else if (categoryId != null) {

                products =
                        productRepository
                                .findByCategoryIdAndIsActiveTrue(
                                        categoryId,
                                        pageable
                                );

            } else if (searchQuery != null) {

                products =
                        productRepository
                                .findByIsActiveTrueAndNameContainingIgnoreCase(
                                        searchQuery,
                                        pageable
                                );

            } else {

                products =
                        productRepository
                                .findByIsActiveTrue(pageable);
            }

        }

        // ALL PRODUCTS
        else {

            if (categoryId != null && searchQuery != null) {

                products =
                        productRepository
                                .findByCategoryIdAndNameContainingIgnoreCase(
                                        categoryId,
                                        searchQuery,
                                        pageable
                                );

            } else if (categoryId != null) {

                products =
                        productRepository
                                .findByCategoryId(
                                        categoryId,
                                        pageable
                                );

            } else if (searchQuery != null) {

                products =
                        productRepository
                                .findByNameContainingIgnoreCase(
                                        searchQuery,
                                        pageable
                                );

            } else {

                products =
                        productRepository
                                .findAll(pageable);
            }
        }

        return PageResponse.of(
                products.map(this::toResponse)
        );
    }

    private String validateSortField(String sortBy) {
        if (sortBy == null) {
            sortBy = "createdAt";
        }

        // Whitelist of allowed sort fields
        switch (sortBy) {
            case "id":
            case "name":
            case "price":
            case "createdAt":
            case "stock":
                return sortBy;
            default:
                log.warn("Invalid sort field: {}, defaulting to createdAt", sortBy);
                return "createdAt";
        }
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findWithImagesById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        return toResponse(product);
    }

    public List<ProductResponse> getFeaturedProducts(String sortBy, String sortDir) {
        String validatedSortBy = validateSortField(sortBy);
        Sort sort = sortDir != null && sortDir.equalsIgnoreCase("asc")
                ? Sort.by(validatedSortBy).ascending()
                : Sort.by(validatedSortBy).descending();

        Page<Product> products = productRepository.findByIsFeaturedTrueAndIsActiveTrue(
                PageRequest.of(0, Integer.MAX_VALUE, sort)
        );

        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getDiscountedProducts(String sortBy, String sortDir) {

        String validatedSortBy = validateSortField(sortBy);

        Sort sort = sortDir != null && sortDir.equalsIgnoreCase("asc")
                ? Sort.by(validatedSortBy).ascending()
                : Sort.by(validatedSortBy).descending();

        Page<Product> products = productRepository.findDiscountedProducts(
                PageRequest.of(0, Integer.MAX_VALUE, sort)
        );

        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<ProductResponse> searchProducts(int page, int size, String query) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Product> products = productRepository.searchByNameOrId(query, pageable);

        return PageResponse.of(products.map(this::toResponse));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .imageUrl(request.getImageUrl())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .category(category)
                .images(new ArrayList<>())
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);

        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        // Ensure images list is initialized
        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public String uploadProductImage(Long id, MultipartFile file) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String imageUrl = cloudinaryService.uploadFile(file);

        ProductImage productImage = ProductImage.builder()
                .product(product)
                .imageUrl(imageUrl)
                .displayOrder(product.getImages().size())
                .isPrimary(product.getImages().isEmpty())
                .build();

        product.getImages().add(productImage);

        if (product.getImageUrl() == null) {
            product.setImageUrl(imageUrl);
        }

        productRepository.save(product);

        return imageUrl;
    }

    @Transactional
    public List<String> uploadProductImages(
            Long id,
            List<MultipartFile> files
    ) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "id",
                                id
                        ));

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {

            if (file.getContentType() == null ||
                    !file.getContentType().startsWith("image/")) {

                throw new IllegalArgumentException(
                        "Only image files are allowed"
                );
            }

            String imageUrl =
                    cloudinaryService.uploadFile(file);

            uploadedUrls.add(imageUrl);

            ProductImage productImage = ProductImage.builder()
                    .product(product)
                    .imageUrl(imageUrl)
                    .displayOrder(product.getImages().size())
                    .isPrimary(product.getImages().isEmpty())
                    .build();

            product.getImages().add(productImage);

            if (product.getImageUrl() == null) {
                product.setImageUrl(imageUrl);
            }
        }

        productRepository.save(product);

        return uploadedUrls;
    }

    @Transactional
    public void updateImageOrders(
            Long productId,
            List<ProductImageOrderRequest> requests
    ) {

        Product product = productRepository.findWithImagesById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "id",
                                productId
                        ));

        Map<Long, Integer> orderMap = requests.stream()
                .collect(Collectors.toMap(
                        ProductImageOrderRequest::getImageId,
                        ProductImageOrderRequest::getDisplayOrder
                ));

        for (ProductImage image : product.getImages()) {

            Integer newOrder = orderMap.get(image.getId());

            if (newOrder != null) {
                image.setDisplayOrder(newOrder);
            }
        }

        productImageRepository.saveAll(product.getImages());

        // cover image = ilk resim
        product.getImages().stream()
                .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                .ifPresent(first ->
                        product.setImageUrl(first.getImageUrl())
                );

        productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void deleteProductImage(Long imageId) throws IOException {

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ProductImage",
                                "id",
                                imageId
                        ));

        if (image.getImageUrl() != null) {
            cloudinaryService.deleteFile(
                    image.getImageUrl()
            );
        }

        Product product = image.getProduct();

        product.getImages().remove(image);

        // cover image güncelle
        if (Objects.equals(product.getImageUrl(), image.getImageUrl())) {

            if (product.getImages().isEmpty()) {
                product.setImageUrl(null);
            } else {
                product.setImageUrl(
                        product.getImages()
                                .get(0)
                                .getImageUrl()
                );
            }
        }

        productImageRepository.delete(image);
    }

    public ProductResponse toResponse(Product product) {

        List<ProductImageResponse> images =
                product.getImages() != null
                        ? product.getImages().stream()
                        .sorted(Comparator.comparingInt(
                                pi -> pi.getDisplayOrder() != null
                                        ? pi.getDisplayOrder()
                                        : 0
                        ))
                        .map(img -> ProductImageResponse.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .displayOrder(img.getDisplayOrder())
                                .isPrimary(img.getIsPrimary())
                                .build())
                        .toList()
                        : new ArrayList<>();

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .imageUrl(product.getImageUrl())

                .images(images)

                .isActive(product.getIsActive())
                .isFeatured(product.getIsFeatured())
                .categoryId(product.getCategory() != null
                        ? product.getCategory().getId()
                        : null)
                .categoryName(product.getCategory() != null
                        ? product.getCategory().getName()
                        : null)
                .createdAt(product.getCreatedAt() != null
                        ? product.getCreatedAt()
                        : LocalDateTime.now())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
