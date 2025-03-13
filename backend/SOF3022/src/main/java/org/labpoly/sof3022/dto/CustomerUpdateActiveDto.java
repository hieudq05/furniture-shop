package org.labpoly.sof3022.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerUpdateActiveDto {
    String id;
    Boolean isActive;
}
