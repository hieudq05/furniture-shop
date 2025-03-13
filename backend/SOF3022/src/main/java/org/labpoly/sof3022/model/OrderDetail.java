package org.labpoly.sof3022.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "OrderDetails")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_stock_id", nullable = false)
    private ProductStock productStock;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ColumnDefault("0")
    @Column(name = "status")
    private Boolean status;

}