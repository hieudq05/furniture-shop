package org.labpoly.sof3022.service.order;

import org.labpoly.sof3022.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SelectOrderService {
    Page<Order> getOrdersByCustomerId(UUID customerId, Pageable pageable);
    List<Order> getOrdersByCustomerId(UUID customerId);
}
