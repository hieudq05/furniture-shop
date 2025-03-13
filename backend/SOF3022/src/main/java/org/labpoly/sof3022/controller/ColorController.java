package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.model.ProductColor;
import org.labpoly.sof3022.service.color.ProductColorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/color")
public class ColorController {

    private final ProductColorService productColorService;

    public ColorController(ProductColorService productColorService) {
        this.productColorService = productColorService;
    }

    @GetMapping("get/all")
    public List<ProductColor> getColors() {
        return productColorService.getColors();
    }
}
