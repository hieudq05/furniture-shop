package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "Customer", uniqueConstraints = {
        @UniqueConstraint(name = "Index_Customer_1", columnNames = {"email"}),
        @UniqueConstraint(name = "Index_Customer_2", columnNames = {"phone"})
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {
    @Id
    @ColumnDefault("newid()")
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 20)
    @Nationalized
    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Size(max = 255)
    @Nationalized
    @Column(name = "address")
    private String address;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("1")
    @Column(name = "is_active")
    @JsonProperty("isActive")
    private Boolean isActive;

    @Column(name = "image")
    @Nationalized
    private String image;

    @OneToMany(mappedBy = "customer")
    private Set<Order> orders = new LinkedHashSet<>();

    @ManyToOne
    @JoinColumn(name = "role")
    private Role role;

}