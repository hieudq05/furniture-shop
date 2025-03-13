package org.labpoly.sof3022.repository;

import org.labpoly.sof3022.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
}