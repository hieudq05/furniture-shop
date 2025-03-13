package org.labpoly.sof3022.service.role;

import org.labpoly.sof3022.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.labpoly.sof3022.model.Role;

import java.util.List;
import java.util.UUID;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(UUID id) {
        return roleRepository.findRoleById(id);
    }

    @Override
    public List<Role> getRolesByName(String name) {
        return roleRepository.findRoleByName(name);
    }

    @Override
    public List<Role> getRolesLikeName(String name) {
        return roleRepository.findRoleByNameLike(name);
    }
}
