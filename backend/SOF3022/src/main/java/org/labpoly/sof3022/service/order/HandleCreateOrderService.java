package org.labpoly.sof3022.service.order;

import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.model.Order;
import org.labpoly.sof3022.model.OrderDetail;
import org.labpoly.sof3022.model.ProductStock;
import org.labpoly.sof3022.dto.OrderRequest;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.labpoly.sof3022.service.orderDetails.OrderDetailsService;
import org.labpoly.sof3022.service.productStock.ProductStockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class HandleCreateOrderService {
    public void createOrderFromOrderRequest(OrderRequest orderRequest, OrderService orderService, OrderDetailsService orderDetailsService, CustomerService customerService, ProductStockService productStockService) {
        Customer customer = customerService.getCustomerById(orderRequest.getCustomerId());
        List<ProductStock> productStocks = new ArrayList<>();
        for (int i = 0; i < orderRequest.getOrderDetails().size(); i++) {
            ProductStock productStock = productStockService.getProductStockById(
                    orderRequest.getOrderDetails().get(i).getProductStockId()
            );
            productStocks.add(productStock);
        }

        Order order = Order.builder()
                .customer(customer)
                .address(customer.getAddress())
                .createDate(LocalDateTime.now())
                .build();
        Order orderCreated = orderService.createOrder(order);
        if (orderCreated.getId() == null) {
            throw new RuntimeException("Lỗi: Order chưa được tạo thành công.");
        }

        for (int i = 0; i < productStocks.size(); i++) {
            OrderDetail orderDetail = OrderDetail.builder()
                    .order(orderCreated)
                    .productStock(productStocks.get(i))
                    .quantity(orderRequest.getOrderDetails().get(i).getQuantity())
                    .build();
            orderDetailsService.createOrderDetail(orderDetail);
        }
    }
}
