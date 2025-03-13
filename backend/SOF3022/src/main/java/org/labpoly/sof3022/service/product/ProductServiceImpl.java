package org.labpoly.sof3022.service.product;

import org.labpoly.sof3022.dto.ProductColorDto;
import org.labpoly.sof3022.dto.ProductDto;
import org.labpoly.sof3022.dto.ProductSizeDto;
import org.labpoly.sof3022.dto.ProductStockDto;
import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.*;
import org.labpoly.sof3022.repository.*;
import org.labpoly.sof3022.service.UploadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UploadService uploadService;
    private final ProductStockRepository productStockRepository;
    private final ProductSizeRepository productSizeRepository;
    private final ProductColorRepository productColorRepository;
    private final ProductImageRepository productImageRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository, UploadService uploadService, ProductStockRepository productStockRepository, ProductSizeRepository productSizeRepository, ProductColorRepository productColorRepository, ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.uploadService = uploadService;
        this.productStockRepository = productStockRepository;
        this.productSizeRepository = productSizeRepository;
        this.productColorRepository = productColorRepository;
        this.productImageRepository = productImageRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductsValid() {
        return productRepository.findAllByIsAvailable(Boolean.TRUE);
    }

    @Override
    public List<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).getContent();
    }

    @Override
    public Page<Product> getAllProductsValid(Pageable pageable) {
        return productRepository.findAllByIsAvailable(Boolean.TRUE, pageable);
    }

    @Override
    public Product getProductById(UUID id) {
        return productRepository.findProductsById(id);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return List.of();
    }

    @Override
    public List<Product> getProductsLikeName(String name) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByDescription(String description) {
        return List.of();
    }

    @Override
    public List<Product> getProductsLikeDescription(String description) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByStock(Integer stock) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByStockBetween(Integer minStock, Integer maxStock) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByStockGreaterThan(Integer stock) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByStockLessThan(Integer stock) {
        return List.of();
    }

    @Override
    public Page<Product> getProductsByCategoryId(Integer categoryId, Pageable pageable) {
        return productRepository.findAllByCategory_IdAndIsAvailable(categoryId, true, pageable);
    }

    @Override
    public List<Product> getProductsByCategoryId(Integer categoryId) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByProducts(List<Integer> categoryIds) {
        return List.of();
    }

    @Override
    public Product createProduct(ProductDto productDto, List<MultipartFile> images) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setHighlight(productDto.getHighlight());
        product.setDetails(productDto.getDetails());
        product.setCreatedAt(LocalDateTime.now());
        product.setIsAvailable(true);

        // Set category
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        // Save product first to get ID
        Product savedProduct = productRepository.save(product);

        // Handle colors
        List<ProductColor> colors = new ArrayList<>();
        if (productDto.getColors() != null) {
            Set<ProductColor> productColors = new LinkedHashSet<>();
            for (ProductColorDto colorDto : productDto.getColors()) {
                ProductColor productColor = new ProductColor();
                productColor.setProduct(savedProduct);
                productColor.setName(colorDto.getName());
                productColor.setClassField(colorDto.getClassField());
                productColor.setSelectedClass(colorDto.getSelectedClass());
                productColors.add(productColor);
                colors.add(productColorRepository.save(productColor));
            }
            savedProduct.setProductColors(productColors);
        }

        // Handle sizes
        List<ProductSize> sizes = new ArrayList<>();
        if (productDto.getSizes() != null) {
            Set<ProductSize> productSizes = new LinkedHashSet<>();
            for (ProductSizeDto sizeDto : productDto.getSizes()) {
                ProductSize productSize = new ProductSize();
                productSize.setProduct(savedProduct);
                productSize.setSizeName(sizeDto.getSizeName());
                productSizes.add(productSize);
                sizes.add(productSizeRepository.save(productSize));
            }
            savedProduct.setProductSizes(productSizes);
        }

        // Handle stocks
        if (productDto.getStocks() != null) {
            Set<ProductStock> productStocks = new LinkedHashSet<>();
            for (ProductStockDto stockDto : productDto.getStocks()) {
                ProductStock productStock = new ProductStock();
                productStock.setProduct(savedProduct);
                productStock.setStock(stockDto.getStock());
                productStock.setPrice(stockDto.getPrice());
                productStock.setCreatedAt(LocalDateTime.now());

                // Set image, color and size references
                productStock.setProductColor(colors.get(productDto.getStocks().indexOf(stockDto)));
                productStock.setProductSize(sizes.get(productDto.getStocks().indexOf(stockDto)));

                try {
                    String imageUrl = uploadService.uploadFile(images.get(productDto.getStocks().indexOf(stockDto)));
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(savedProduct);
                    productImage.setSrc(imageUrl);
                    productImage.setAlt(productDto.getName());
                    productStock.setProductImage(productImageRepository.save(productImage));
                } catch (IOException e) {
                    throw new ApiException(ErrorCode.FILE_CAN_NOT_UPLOAD);
                }

                productStockRepository.save(productStock);
                productStocks.add(productStock);
            }
            savedProduct.setProductStocks(productStocks);
        }

        return productRepository.save(savedProduct);
    }

    @Override
    public List<Product> getProductsByCategoryAsc(Integer categoryId) {
        return productRepository.findProductsByCategory_Id(categoryId, Sort.by(Sort.Direction.ASC, "name"));
    }

    @Override
    public List<Product> getProductsByCategoryDesc(Integer categoryId) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByCategoriesAsc(List<Integer> categoryIds) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByCategoriesDesc(List<Integer> categoryIds) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByAvailableStock(Boolean availableStock) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByColor(Integer color) {
        return List.of();
    }

//    @Override
//    public Product updateProduct(UUID id, ProductDto productDto, List<MultipartFile> images) throws IOException {
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> new ApiException(ErrorCode.PRODUCTS_NOT_FOUND));
//
//        product.setName(productDto.getName());
//        product.setDescription(productDto.getDescription());
//        product.setHighlight(productDto.getHighlight());
//        product.setDetails(productDto.getDetails());
//
//        // Update category
//        if (productDto.getCategoryId() != null) {
//            Category category = categoryRepository.findById(productDto.getCategoryId())
//                    .orElseThrow(() -> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));
//            product.setCategory(category);
//        }
//
//        // Handle colors
//        if (productDto.getColors() != null) {
//            Set<ProductColor> productColors = new LinkedHashSet<>();
//            for (ProductColorDto colorDto : productDto.getColors()) {
//                ProductColor productColor = new ProductColor();
//                productColor.setProduct(product);
//                productColor.setName(colorDto.getName());
//                productColor.setClassField(colorDto.getClassField());
//                productColor.setSelectedClass(colorDto.getSelectedClass());
//                productColors.add(productColor);
//            }
//            product.setProductColors(productColors);
//        }
//
//        // Handle sizes
//        if (productDto.getSizes() != null) {
//            Set<ProductSize> productSizes = new LinkedHashSet<>();
//            for (ProductSizeDto sizeDto : productDto.getSizes()) {
//                ProductSize productSize = new ProductSize();
//                productSize.setProduct(product);
//                productSize.setSizeName(sizeDto.getSizeName());
//                productSizes.add(productSize);
//            }
//            product.setProductSizes(productSizes);
//        }
//
//        // Handle stocks
//        if (productDto.getStocks() != null) {
//            Set<ProductStock> productStocks = new LinkedHashSet<>();
//            ProductStock productStock = new ProductStock();
//            for (ProductStockDto stockDto : productDto.getStocks()) {
//                ProductStock productStockById = productStockRepository.findProductStockById(stockDto.getId());
//                //handle image
//                ProductImage productImage = new ProductImage();
//                if (images != null && stockDto.getProductImage() != null) {
//                    String imageUrl = uploadService.uploadFile(images.get(productDto.getStocks().indexOf(stockDto)));
//                    productImage.setProduct(product);
//                    productImage.setSrc(imageUrl);
//                    productImage.setAlt(productDto.getName());
//                    productImageRepository.save(productImage);
//                    productStock.setProductImage(productImage);
//                }
//
//                productStock.setProduct(product);
//                productStock.setStock(stockDto.getStock());
//                productStock.setPrice(stockDto.getPrice());
//                productStock.setCreatedAt(LocalDateTime.parse(stockDto.getCreatedAt(), DateTimeFormatter.ofPattern("HH:mm:ss d/M/yyyy")));
//
//                if(productStock.getProductColor() == null) {
//                    stockDto.getProductColor().setId(null);
//                }
//                stockDto.getProductColor().setProduct(product);
//                ProductColor productColor = productColorRepository.save(stockDto.getProductColor());
//                System.out.println("Product color: " + productColor.getId());
//                productStock.setProductColor(productColor);
//
//                if(productStock.getProductSize() == null) {
//                    stockDto.getProductSize().setId(null);
//                }
//                stockDto.getProductSize().setProduct(product);
//                ProductSize productSize = productSizeRepository.save(stockDto.getProductSize());
//                System.out.println("Product size: " + productSize.getId());
//                productStock.setProductSize(productSize);
//
//                if(productStockRepository.findProductStockById(productStock.getId()) == null) {
//                    productStocks.add(productStock);
//                }
//
//                productStockRepository.save(productStock);
//            }
//            product.setProductStocks(productStocks);
//        }
//
//        Product savedProduct = productRepository.save(product);
//
//        return savedProduct;
//    }

    @Override
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.PRODUCTS_NOT_FOUND));
        product.setIsAvailable(!product.getIsAvailable());
        productRepository.save(product);
    }
}
