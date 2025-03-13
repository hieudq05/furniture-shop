package org.labpoly.sof3022.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * DTO for {@link org.labpoly.sof3022.model.ProductSize}
 */

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeDto {
    Integer id;
    @NotNull
    @Size(max = 50)
    String sizeName;
    String description;
}