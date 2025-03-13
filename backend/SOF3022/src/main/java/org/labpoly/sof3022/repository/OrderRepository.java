package org.labpoly.sof3022.repository;

import org.labpoly.sof3022.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> getOrdersByCustomer_Id(@Param("customerId") UUID customerId, Pageable pageable);

    List<Order> getOrdersByCustomer_Id(UUID customerId);
}