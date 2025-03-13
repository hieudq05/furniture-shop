package org.labpoly.sof3022.service.color;

import org.labpoly.sof3022.model.ProductColor;
import org.labpoly.sof3022.repository.ProductColorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductColorServiceImpl implements ProductColorService {

    private final ProductColorRepository productColorRepository;

    public ProductColorServiceImpl(ProductColorRepository productColorRepository) {
        this.productColorRepository = productColorRepository;
    }

    @Override
    public List<ProductColor> getColors() {
        return productColorRepository.findAll();
    }
}
