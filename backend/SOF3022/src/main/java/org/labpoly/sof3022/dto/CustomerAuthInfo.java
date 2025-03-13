package org.labpoly.sof3022.dto;

import org.labpoly.sof3022.model.Role;

import java.util.UUID;

/**
 * Projection for {@link org.labpoly.sof3022.model.Customer}
 */
public interface CustomerAuthInfo {
    UUID getId();

    String getFullName();

    Role getRole();

    String getImage();
}