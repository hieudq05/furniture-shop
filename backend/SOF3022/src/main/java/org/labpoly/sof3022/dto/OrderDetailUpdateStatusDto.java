package org.labpoly.sof3022.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

/**
 * DTO for {@link org.labpoly.sof3022.model.OrderDetail}
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailUpdateStatusDto implements Serializable {
    Integer orderDetailId;
    Boolean status;
}