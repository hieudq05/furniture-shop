package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
public class ProductColor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @Size(max = 50)
    @Column(name = "class", length = 50)
    private String classField;

    @Size(max = 50)
    @Column(name = "selected_class", length = 50)
    private String selectedClass;

    @Size(max = 200)
    @Nationalized
    @Column(name = "name", length = 200)
    private String name;

    @OneToMany
    @JsonIgnore
    private Set<ProductStock> productStocks = new LinkedHashSet<>();

}