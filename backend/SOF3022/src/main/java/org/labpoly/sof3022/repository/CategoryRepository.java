package org.labpoly.sof3022.repository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.labpoly.sof3022.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findCategoryById(Integer id);

    List<Category> findCategoryByDescription(String description);

    List<Category> findCategoryByDescriptionLike(String description);

    List<Category> findCategoryByName(@Size(max = 255) @NotNull String name);

    List<Category> findCategoryByNameLike(@Size(max = 255) @NotNull String name);

    Integer deleteCategoryById(Integer id);
}