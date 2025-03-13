package org.labpoly.sof3022.repository;

import org.labpoly.sof3022.model.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Integer> {
    ProductStock findProductStockById(Integer id);
}