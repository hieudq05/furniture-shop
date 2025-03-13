package org.labpoly.sof3022.service.productStock;

import org.labpoly.sof3022.model.ProductStock;

public interface SelectProductStockService {
    ProductStock getProductStockById(Integer productStockId);
}
