package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.Order;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.dto.CustomerAuthInfo;
import org.labpoly.sof3022.dto.OrderRequest;
import org.labpoly.sof3022.service.JwtService;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.labpoly.sof3022.service.order.HandleCreateOrderService;
import org.labpoly.sof3022.service.order.OrderService;
import org.labpoly.sof3022.service.orderDetails.OrderDetailsService;
import org.labpoly.sof3022.service.productStock.ProductStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/order")
public class OrderController {

    private final OrderService orderService;
    private final JwtService jwtService;
    private final CustomerService customerService;
    private final HandleCreateOrderService handleCreateOrderService;
    private final ProductStockService productStockService;
    private final OrderDetailsService orderDetailsService;
    @Autowired
    private CustomerController customerController;

    public OrderController(OrderService orderService, JwtService jwtService, CustomerService customerService, HandleCreateOrderService handleCreateOrderService, ProductStockService productStockService, OrderDetailsService orderDetailsService) {
        this.orderService = orderService;
        this.jwtService = jwtService;
        this.customerService = customerService;
        this.handleCreateOrderService = handleCreateOrderService;
        this.productStockService = productStockService;
        this.orderDetailsService = orderDetailsService;
    }

    @GetMapping("me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyOder(@RequestHeader("Authorization") String token, @RequestParam Integer page) {
        CustomerAuthInfo customerAuthInfo = authenticateCustomer(token);
        Map<String, Object> map = new HashMap<>();

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("createDate").descending());
        Page<Order> orderPage = orderService.getOrdersByCustomerId(customerAuthInfo.getId(), pageable);
        map.put("orders", orderPage.getContent());
        map.put("totalPages", orderPage.getTotalPages());
        map.put("totalElements", orderPage.getTotalElements());
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .code("GET_ORDER_200")
                .message("Get Orders Successfully")
                .data(map)
                .build());
    }

    @PostMapping("me")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestHeader("Authorization") String token, @RequestBody OrderRequest orderRequest) {
        authenticateCustomer(token);

        handleCreateOrderService.createOrderFromOrderRequest(orderRequest, orderService, orderDetailsService, customerService, productStockService);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code("CREATE_ORDER_200")
                .message("Create Order Successfully")
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrderById(@PathVariable("id") String id, @RequestHeader("Authorization") String token) {
        authenticateCustomer(token);

        List<Order> orders = orderService.getOrdersByCustomerId(UUID.fromString(id));
        System.out.println(id);

        return ResponseEntity.ok(ApiResponse.<List<Order>>builder()
                .code("GET_ORDER_200")
                .message("Get Orders Successfully")
                .data(orders)
                .build());
    }

    private CustomerAuthInfo authenticateCustomer(String token) {
        String cusEmail = customerController.authenticateCustomer(token);

        if (token == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
        if (customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        return customerAuthInfo;
    }
}
