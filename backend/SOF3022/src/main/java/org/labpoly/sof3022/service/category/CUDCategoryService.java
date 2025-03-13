package org.labpoly.sof3022.service.category;

import org.labpoly.sof3022.model.Category;

public interface CUDCategoryService {
    Category save(Category category);

    Integer deleteCategoryById(Integer id);
}
