package org.labpoly.sof3022.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.labpoly.sof3022.model.Role;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerAuthInfoImpl implements CustomerAuthInfo {
    private UUID id;
    private String fullName;
    private Role role;
    private String image;

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public String getFullName() {
        return fullName;
    }

    @Override
    public Role getRole() {
        return role;
    }

    @Override
    public String getImage() {
        return image;
    }
}
