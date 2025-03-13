package org.labpoly.sof3022.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailsRequest {
    Integer productStockId;
    Integer quantity;
}
