package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "name", nullable = false)
    private String name;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;

    @Nationalized
    @Size(max = 355)
    @Column(name = "highlight")
    private String highlight;

    @Nationalized
    @Size(max = 355)
    @Column(name = "details")
    private String details;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "category_id")
    private Category category;

    @ColumnDefault("1")
    @Column(name = "isAvailable")
    private Boolean isAvailable;

    @OneToMany(mappedBy = "product")
    private Set<ProductColor> productColors = new LinkedHashSet<>();

    @OneToMany(mappedBy = "product")
    @JsonManagedReference
    private Set<ProductImage> productImages = new LinkedHashSet<>();

    @OneToMany(mappedBy = "product")
    private Set<ProductSize> productSizes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "product")
    private Set<ProductStock> productStocks = new LinkedHashSet<>();

}