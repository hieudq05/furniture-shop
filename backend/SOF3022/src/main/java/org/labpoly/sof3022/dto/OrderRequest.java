package org.labpoly.sof3022.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    UUID customerId;
    List<OrderDetailsRequest> orderDetails;
}
