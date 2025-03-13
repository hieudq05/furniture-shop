package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class ProductStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "color_id")
    private ProductColor productColor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "size_id")
    private ProductSize productSize;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "image_id")
    private ProductImage productImage;

    @NotNull
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @OneToMany(mappedBy = "productStock")
    @JsonIgnore
    private Set<OrderDetail> orderDetails = new LinkedHashSet<>();

    @NotNull
    @ColumnDefault("0")
    @Column(name = "stock", nullable = false)
    private Integer stock;

}