package org.labpoly.sof3022.service.order;

import org.labpoly.sof3022.model.Order;
import org.labpoly.sof3022.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Page<Order> getOrdersByCustomerId(UUID customerId, Pageable pageable) {
        return orderRepository.getOrdersByCustomer_Id(customerId, pageable);
    }

    @Override
    public List<Order> getOrdersByCustomerId(UUID customerId) {
        return orderRepository.getOrdersByCustomer_Id(customerId);
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
}
