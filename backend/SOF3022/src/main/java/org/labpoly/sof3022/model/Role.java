package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @ColumnDefault("newid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private Set<Customer> customers = new LinkedHashSet<>();

}