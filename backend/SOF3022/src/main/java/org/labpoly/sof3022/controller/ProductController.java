package org.labpoly.sof3022.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.labpoly.sof3022.dto.ProductDto;
import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.Product;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.dto.CustomerAuthInfo;
import org.labpoly.sof3022.service.AuthenticationToken;
import org.labpoly.sof3022.service.JwtService;
import org.labpoly.sof3022.service.product.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/product")
public class ProductController {

    private final ProductService productService;
    private final JwtService jwtService;
    private final AuthenticationToken authenticationToken;

    public ProductController(ProductService productService, JwtService jwtService, AuthenticationToken authenticationToken) {
        this.productService = productService;
        this.jwtService = jwtService;
        this.authenticationToken = authenticationToken;
    }

    @GetMapping("admin/get/all")
    public List<Product> getAllProducts(@RequestHeader("Authorization") String token) {
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
        if (customerAuthInfo == null || !customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
        }

        return productService.getAllProducts();
    }

    @GetMapping("get/all")
    public Map<String, Object> getAllProducts(@RequestParam(name = "page") Integer page) {
        Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("name").ascending());
        Map<String, Object> map = new HashMap<>();
        Page<Product> productPage = productService.getAllProductsValid(pageable);
        map.put("products", productPage.getContent());
        map.put("totalPages", productPage.getTotalPages());
        map.put("totalElements", productPage.getTotalElements());
        return map;
    }


    @GetMapping("get/{id}")
    public Product getProductById(@PathVariable UUID id) {
        return productService.getProductById(id);
    }

    @GetMapping("get/in/{category_id}")
    public Map<String, Object> getProductsInCategory(@PathVariable Integer category_id, @RequestParam(name = "page") Integer page) {
        Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("name").ascending());
        Map<String, Object> map = new HashMap<>();
        Page<Product> productPage = productService.getProductsByCategoryId(category_id, pageable);
        map.put("products", productPage.getContent());
        map.put("totalPages", productPage.getTotalPages());
        map.put("totalElements", productPage.getTotalElements());
        return map;
    }

    @PostMapping("save")
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @RequestPart(name = "images", required = false) List<MultipartFile> images,
            @ModelAttribute(name = "productDto") String productDtoJson,
            @RequestHeader("Authorization") String token
    ) throws JsonProcessingException {
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
        if (customerAuthInfo == null || !customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        ProductDto productDto = objectMapper.readValue(productDtoJson, ProductDto.class);
        Product product = productService.createProduct(productDto, images);

        return ResponseEntity.ok(ApiResponse.<Product>builder()
                .code("CREATE_PRODUCT_200")
                .message("Product created successfully")
                .data(product)
                .build());
    }

//    @PutMapping("save/{id}")
//    public ResponseEntity<ApiResponse<Product>> updateProduct(
//            @PathVariable UUID id,
//            @RequestPart(name = "images", required = false) List<MultipartFile> images,
//            @ModelAttribute(name = "productDto") String productDtoJson,
//            @RequestHeader("Authorization") String token
//    ) throws IOException {
//        System.out.println(images);
//        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
//        if (customerAuthInfo == null || !customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
//            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
//        }
//
//        ObjectMapper objectMapper = new ObjectMapper();
//        ProductDto productDto = objectMapper.readValue(productDtoJson, ProductDto.class);
//        Product product = productService.updateProduct(id, productDto, images);
//        if (product == null) {
//            throw new ApiException(ErrorCode.PRODUCTS_NOT_FOUND);
//        }
//
//        return ResponseEntity.ok(ApiResponse.<Product>builder()
//                .code("UPDATE_PRODUCT_200")
//                .message("Product updated successfully")
//                .data(product)
//                .build());
//    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<ApiResponse<UUID>> deleteProduct(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String token
    ) {
        authenticationToken.authenticateCustomer(token);
        System.out.println(id);

        productService.deleteProduct(id);

        return ResponseEntity.ok(ApiResponse.<UUID>builder()
                .code("DELETE_PRODUCT_200")
                .message("Product deleted successfully")
                .data(id)
                .build());
    }
}
