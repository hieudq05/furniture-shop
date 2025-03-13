package org.labpoly.sof3022.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDto {
    private UUID id;
    private String name;
    private String description;
    private String highlight;
    private String details;
    private Integer categoryId;
    @JsonDeserialize(as = ArrayList.class)
    private List<ProductColorDto> colors;
    @JsonDeserialize(as = ArrayList.class)
    private List<ProductSizeDto> sizes;
    @JsonDeserialize(contentAs = ProductStockDto.class)
    private List<ProductStockDto> stocks;
}