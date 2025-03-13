package org.labpoly.sof3022.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link org.labpoly.sof3022.model.Customer}
 */
@Value
@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
public class CustomerSaveDto implements Serializable {
    UUID id;
    @NotNull
    @Size(max = 255)
    String fullName;
    @NotNull
    @Size(max = 255)
    String email;
    @Size(max = 20)
    String phone;
    @Size(max = 255)
    String address;
    String image;
}