package org.labpoly.sof3022.service.orderDetails;

import org.labpoly.sof3022.model.OrderDetail;
import org.labpoly.sof3022.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderDetailsServiceImpl implements OrderDetailsService {

    private final OrderDetailRepository orderDetailRepository;

    public OrderDetailsServiceImpl(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
    }

    @Override
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public Integer updateOrderDetailStatus(Integer orderDetailId, Boolean status) {
        return orderDetailRepository.updateStatusById(status, orderDetailId);
    }

    @Override
    public OrderDetail getOrderDetailById(Integer orderDetailId) {
        return orderDetailRepository.findOrderDetailById(orderDetailId);
    }

    @Override
    public List<OrderDetail> getOrderDetails() {
        return List.of();
    }

    @Override
    public Map<String, BigDecimal> getReportTotalPrice() {
        Map<String, BigDecimal> map = new HashMap<>();
        map.put("now", orderDetailRepository.getOrderTotalPrice(LocalDate.now().getMonthValue(), LocalDate.now().getYear()));
        LocalDate month = LocalDate.now().minusMonths(1);
        map.put("previous", orderDetailRepository.getOrderTotalPrice(month.getMonthValue()
                , month.getYear()));
        return map;
    }

    @Override
    public Map<String, Long> getReportTotalProductSale() {
        Map<String, Long> map = new HashMap<>();
        map.put("now", orderDetailRepository.countOrderDetailsByOrder_CreateDate_Month(LocalDate.now().getMonthValue(), LocalDate.now().getYear()));
        LocalDate month = LocalDate.now().minusMonths(1);
        map.put("previous", orderDetailRepository.countOrderDetailsByOrder_CreateDate_Month(month.getMonthValue(), month.getYear()));
        return map;
    }

    @Override
    public Map<String, Long> getReportOrderActive() {
        Map<String, Long> map = new HashMap<>();
        map.put("now", orderDetailRepository.countOrderDetailsByStatus(LocalDate.now().getMonthValue(), LocalDate.now().getYear()));
        LocalDate month = LocalDate.now().minusMonths(1);
        map.put("previous", orderDetailRepository.countOrderDetailsByStatus(month.getMonthValue(), month.getYear()));
        return map;
    }

    @Override
    public Map<String, Long> getReportOrderInactive() {
        return Map.of();
    }

    @Override
    public Map<String, BigDecimal> getReportPriceAverage() {
        Map<String, BigDecimal> map = new HashMap<>();
        map.put("now", orderDetailRepository.getOrderTotalPriceAvg(LocalDate.now().getMonthValue(), LocalDate.now().getYear()));
        LocalDate month = LocalDate.now().minusMonths(1);
        map.put("previous", orderDetailRepository.getOrderTotalPriceAvg(month.getMonthValue(), month.getYear()));
        return map;
    }

    @Override
    public List<Object[]> getPricesIn12Months() {
        return orderDetailRepository.getMonthlyTotalForLast12Months(LocalDateTime.now().minus(12, ChronoUnit.MONTHS));
    }

}
