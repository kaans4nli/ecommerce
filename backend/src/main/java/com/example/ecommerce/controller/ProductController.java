package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.ProductImageOrderRequest;
import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.PageResponse;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ───── PUBLIC ENDPOINTS ─────

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {

        PageResponse<ProductResponse> data =
                productService.getAllProducts(page, size, sortBy, sortDir, categoryId, search);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active
    ) {

        PageResponse<ProductResponse> data =
                productService.getAllProductsForAdmin(
                        page,
                        size,
                        sortBy,
                        sortDir,
                        categoryId,
                        search,
                        active
                );

        return ResponseEntity.ok(
                ApiResponse.success(data)
        );
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @GetMapping("/products/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                productService.getFeaturedProducts(sortBy, sortDir)
        ));
    }

    @GetMapping("/products/discounted")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getDiscountedProducts(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(
                ApiResponse.success(productService.getDiscountedProducts(sortBy, sortDir))
        );
    }
    @GetMapping("/products/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(productService.searchProducts(page, size, query))
        );
    }

    // ───── ADMIN ENDPOINTS ─────

    @PostMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Product updated successfully", productService.updateProduct(id, request)));
    }

    @PostMapping(value = "/admin/products/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = productService.uploadProductImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded", imageUrl));
    }

    @PostMapping(value = "/admin/products/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        List<String> imageUrls = productService.uploadProductImages(id, files);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded", imageUrls));
    }

    @PutMapping("/admin/products/{id}/images/order")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateImageOrders(
            @PathVariable Long id,
            @RequestBody List<ProductImageOrderRequest> requests
    ) {

        productService.updateImageOrders(id, requests);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Image order updated",
                        null
                )
        );
    }

    @DeleteMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @DeleteMapping("/admin/products/images/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(
            @PathVariable Long imageId
    ) throws IOException {

        productService.deleteProductImage(imageId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Image deleted successfully",
                        null
                )
        );
    }
}
