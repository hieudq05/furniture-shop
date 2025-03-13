package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "src", nullable = false)
    private String src;

    @Size(max = 255)
    @Nationalized
    @Column(name = "alt")
    private String alt;

    @OneToMany(mappedBy = "productImage")
    @JsonIgnore
    private Set<ProductStock> productStocks = new LinkedHashSet<>();

}