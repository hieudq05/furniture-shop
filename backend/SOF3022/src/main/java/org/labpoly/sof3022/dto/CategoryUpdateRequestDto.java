package org.labpoly.sof3022.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Value;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * DTO for {@link org.labpoly.sof3022.model.Category}
 */
@Value
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryUpdateRequestDto implements Serializable {
    Integer id;
    @NotNull
    @Size(max = 255)
    String name;
    String description;
    MultipartFile image;
}