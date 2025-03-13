package org.labpoly.sof3022.service.product;

import org.labpoly.sof3022.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SelectProductService {
    List<Product> getAllProducts();

    List<Product> getAllProductsValid();

    List<Product> getAllProducts(Pageable pageable);

    Page<Product> getAllProductsValid(Pageable pageable);

    Product getProductById(UUID id);

    List<Product> getProductsByName(String name);

    List<Product> getProductsLikeName(String name);

    List<Product> getProductsByDescription(String description);

    List<Product> getProductsLikeDescription(String description);

    List<Product> getProductsByStock(Integer stock);

    List<Product> getProductsByStockBetween(Integer minStock, Integer maxStock);

    List<Product> getProductsByStockGreaterThan(Integer stock);

    List<Product> getProductsByStockLessThan(Integer stock);

    Page<Product> getProductsByCategoryId(Integer categoryId, Pageable pageable);

    List<Product> getProductsByCategoryId(Integer categoryId);

    List<Product> getProductsByProducts(List<Integer> categoryIds);

    List<Product> getProductsByCategoryAsc(Integer categoryId);

    List<Product> getProductsByCategoryDesc(Integer categoryId);

    List<Product> getProductsByCategoriesAsc(List<Integer> categoryIds);

    List<Product> getProductsByCategoriesDesc(List<Integer> categoryIds);

    List<Product> getProductsByAvailableStock(Boolean availableStock);

    List<Product> getProductsByColor(Integer color);
}
