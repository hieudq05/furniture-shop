package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.OrderDetail;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.dto.CustomerAuthInfo;
import org.labpoly.sof3022.dto.OrderDetailUpdateStatusDto;
import org.labpoly.sof3022.service.AuthenticationToken;
import org.labpoly.sof3022.service.JwtService;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.labpoly.sof3022.service.orderDetails.OrderDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/order_detail")
public class OrderDetailsController {

    @Autowired
    private CustomerController customerController;
    private final OrderDetailsService orderDetailsService;
    private final JwtService jwtService;
    private final CustomerService customerService;
    private final AuthenticationToken authenticationToken;

    public OrderDetailsController(OrderDetailsService orderDetailsService, JwtService jwtService, CustomerService customerService, AuthenticationToken authenticationToken) {
        this.orderDetailsService = orderDetailsService;
        this.jwtService = jwtService;
        this.customerService = customerService;
        this.authenticationToken = authenticationToken;
    }

    @GetMapping("get/{order_id}/{order_details_id}")
    public ResponseEntity<ApiResponse<OrderDetail>> getOrderDetails(@PathVariable Integer order_id, @PathVariable Integer order_details_id, @RequestHeader("Authorization") String token) {
        String cusEmail = customerController.authenticateCustomer(token);
        Map<String, Object> map = new HashMap<>();

        if (token == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(token);
        if (customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        OrderDetail orderDetail = orderDetailsService.getOrderDetailById(order_details_id);
        if (orderDetail == null || !orderDetail.getOrder().getId().equals(order_id) || !orderDetail.getOrder().getCustomer().getId().equals(customerAuthInfo.getId())) {
            throw new ApiException(ErrorCode.ORDER_DETAILS_NOT_FOUND);
        }
        return ResponseEntity.ok(ApiResponse.<OrderDetail>builder()
                .code("ORDER_DETAILS_200")
                .message("Order details found")
                .data(orderDetail)
                .build());
    }

    @PutMapping("update")
    public ResponseEntity<ApiResponse<String>> updateOrderDetailsStatus(@RequestBody OrderDetailUpdateStatusDto detailUpdateStatusDto, @RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        Integer rowEffected = orderDetailsService.updateOrderDetailStatus(detailUpdateStatusDto.getOrderDetailId(), detailUpdateStatusDto.getStatus());
        System.out.println("Order details id: " + detailUpdateStatusDto.getOrderDetailId() + " status: " + detailUpdateStatusDto.getStatus());
        if (rowEffected == 0) {
            throw new ApiException(ErrorCode.ORDER_DETAILS_NOT_FOUND);
        }

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code("ORDER_DETAILS_UPDATE_200")
                .message("Order details status updated")
                .data(rowEffected + " effected")
                .build());
    }

    @GetMapping("total_price")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getOrderTotalPrice(@RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        return ResponseEntity.ok(ApiResponse.<Map<String, BigDecimal>>builder()
                .message("Get Order Total Price Successfully")
                .code("ORDER_DETAILS_200")
                .data(orderDetailsService.getReportTotalPrice())
                .build());
    }

    @GetMapping("count_sale")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCountSale(@RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .message("Get Order Total Price Successfully")
                .code("ORDER_DETAILS_200")
                .data(orderDetailsService.getReportTotalProductSale())
                .build());
    }

    @GetMapping("count_sale_active")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCountSaleActive(@RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .message("Get Order Total Price Successfully")
                .code("ORDER_DETAILS_200")
                .data(orderDetailsService.getReportOrderActive())
                .build());
    }

    @GetMapping("avg_price")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getAvgPrice(@RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        return ResponseEntity.ok(ApiResponse.<Map<String, BigDecimal>>builder()
                .message("Get Order Total Price Successfully")
                .code("ORDER_DETAILS_200")
                .data(orderDetailsService.getReportPriceAverage())
                .build());
    }

    @GetMapping("prices_in_12_months")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPricesIn12Months(@RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);

        List<Object[]> list = orderDetailsService.getPricesIn12Months();
        List<Map<String, Object>> mapList = new ArrayList<>();

        for (Object[] obj : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("year", obj[0]);
            map.put("month", obj[1]);
            map.put("total", obj[2]);
            mapList.add(map);
        }

        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .message("Get Order Total Price Successfully")
                .code("ORDER_DETAILS_200")
                .data(mapList)
                .build());
    }
}
