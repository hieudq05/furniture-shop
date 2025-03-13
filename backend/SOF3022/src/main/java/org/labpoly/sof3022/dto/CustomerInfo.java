package org.labpoly.sof3022.dto;

import org.labpoly.sof3022.model.Role;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Projection for {@link org.labpoly.sof3022.model.Customer}
 */
public interface CustomerInfo {
    UUID getId();

    String getFullName();

    String getEmail();

    String getPhone();

    String getAddress();

    LocalDateTime getCreatedAt();

    Boolean getIsActive();

    String getImage();

    Role getRole();
}