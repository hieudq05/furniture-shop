package org.labpoly.sof3022.service.category;

import org.labpoly.sof3022.model.Category;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SelectCategoryService {
    List<Category> getAllCategories();

    Category getCategoryById(Integer id);

    List<Category> getCategoriesByName(String name);

    List<Category> getCategoriesLikeName(String name);

    List<Category> getCategoriesByDescription(String description);

    List<Category> getCategoriesLikeDescription(String description);
}
