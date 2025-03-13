package org.labpoly.sof3022.repository;

import org.labpoly.sof3022.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Product findProductsById(UUID id);

    List<Product> findProductsByCategory_Id(Integer categoryId, Sort sort);

    List<Product> findAllByIsAvailable(Boolean isAvailable);

    Page<Product> findAllByIsAvailable(Boolean isAvailable, Pageable pageable);

    Page<Product> findAllByCategory_Id(Integer categoryId, Pageable pageable);

    Page<Product> findAllByCategory_IdAndIsAvailable(Integer categoryId, Boolean isAvailable, Pageable pageable);
}