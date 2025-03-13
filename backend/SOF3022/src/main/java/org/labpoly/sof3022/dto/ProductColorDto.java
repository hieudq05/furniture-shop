package org.labpoly.sof3022.dto;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

/**
 * DTO for {@link org.labpoly.sof3022.model.ProductColor}
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductColorDto implements Serializable {
    Integer id;
    @Size(max = 50)
    String classField;
    @Size(max = 50)
    String selectedClass;
    @Size(max = 200)
    String name;
}