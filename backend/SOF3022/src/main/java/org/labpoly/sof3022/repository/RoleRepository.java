package org.labpoly.sof3022.repository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.labpoly.sof3022.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Role findRoleById(UUID id);

    List<Role> findRoleByName(@Size(max = 50) @NotNull String name);

    List<Role> findRoleByNameLike(@Size(max = 50) @NotNull String name);
}