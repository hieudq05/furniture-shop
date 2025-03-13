package org.labpoly.sof3022.service.productStock;

import org.labpoly.sof3022.model.ProductStock;
import org.labpoly.sof3022.repository.ProductStockRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductStockServiceImpl implements ProductStockService {

    private final ProductStockRepository productStockRepository;

    public ProductStockServiceImpl(ProductStockRepository productStockRepository) {
        this.productStockRepository = productStockRepository;
    }

    @Override
    public ProductStock getProductStockById(Integer productStockId) {
        return productStockRepository.findProductStockById(productStockId);
    }
}
