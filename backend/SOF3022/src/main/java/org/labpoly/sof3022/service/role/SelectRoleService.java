package org.labpoly.sof3022.service.role;

import org.labpoly.sof3022.model.Role;

import java.util.List;
import java.util.UUID;

public interface SelectRoleService {
    List<Role> getAllRoles();

    Role getRoleById(UUID id);

    List<Role> getRolesByName(String name);

    List<Role> getRolesLikeName(String name);
}
