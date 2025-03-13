package org.labpoly.sof3022.service.product;

import org.labpoly.sof3022.dto.ProductDto;
import org.labpoly.sof3022.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface CUDProductService {
    Product createProduct(ProductDto productDto, List<MultipartFile> images);
//    Product updateProduct(UUID id, ProductDto productDto, List<MultipartFile> images) throws IOException;
    void deleteProduct(UUID id);
}
